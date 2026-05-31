import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { conferenceSessions, findSession } from './sessions.js';

const app = express();
const server = createServer(app);
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
const port = process.env.PORT || 3000;

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 'dev-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: false
  }
});

app.use(cors({ origin: clientUrl, credentials: true }));
app.use(express.json());
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(new LinkedInStrategy({
  clientID: process.env.LINKEDIN_CLIENT_ID,
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
  callbackURL: process.env.LINKEDIN_CALLBACK_URL,
  scope: ['openid', 'profile', 'email'],
  state: true,
  skipUserProfile: true
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const response = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!response.ok) {
      return done(new Error('Failed to fetch LinkedIn profile'));
    }

    const linkedInUser = await response.json();
    const user = {
      id: linkedInUser.sub,
      name: linkedInUser.name || 'LinkedIn User',
      email: linkedInUser.email || '',
      photo: linkedInUser.picture || '',
      provider: 'linkedin'
    };

    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

function requireAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.status(401).json({ message: 'Authentication required' });
}

app.get('/', (req, res) => {
  res.json({
    name: 'Conference Connect API',
    frontend: clientUrl,
    login: `${clientUrl}/login`,
    status: 'running'
  });
});

app.get('/auth/linkedin', passport.authenticate('linkedin'));

app.get('/auth/linkedin/callback',
  passport.authenticate('linkedin', { failureRedirect: `${clientUrl}/login?error=linkedin` }),
  (req, res) => res.redirect(`${clientUrl}/dashboard`)
);

app.post('/auth/demo-login', (req, res) => {
  const requestedName = String(req.body?.name || '').trim();
  const name = requestedName || 'Demo Attendee';
  const user = {
    id: `demo-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`,
    name,
    email: `${name.toLowerCase().replace(/[^a-z0-9]+/g, '.')}@demo.local`,
    photo: '',
    provider: 'local-demo'
  };

  req.login(user, (error) => {
    if (error) {
      return res.status(500).json({ message: 'Demo login failed' });
    }

    return res.json(user);
  });
});

app.post('/auth/logout', (req, res) => {
  req.logout((error) => {
    if (error) {
      return res.status(500).json({ message: 'Logout failed' });
    }

    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.json({ message: 'Logged out' });
    });
  });
});

app.get('/auth/user', (req, res) => {
  res.json({ user: req.user || null });
});

app.get('/api/sessions', requireAuth, (req, res) => {
  res.json(conferenceSessions);
});

const io = new Server(server, {
  cors: { origin: clientUrl, credentials: true }
});

io.engine.use(sessionMiddleware);

const rooms = new Map();

function getRoom(sessionId) {
  if (!rooms.has(sessionId)) {
    rooms.set(sessionId, {
      participants: new Map(),
      messages: []
    });
  }

  return rooms.get(sessionId);
}

function activeRoomsPayload() {
  return Array.from(rooms.entries())
    .filter(([, room]) => room.participants.size > 0)
    .map(([sessionId, room]) => ({
      sessionId,
      session: findSession(sessionId),
      participantCount: room.participants.size
    }))
    .filter((room) => room.session);
}

function participantsPayload(room) {
  return Array.from(room.participants.values());
}

function emitActiveRooms() {
  io.emit('activeRooms', activeRoomsPayload());
}

io.use((socket, next) => {
  const user = socket.request.session?.passport?.user;

  if (!user) {
    return next(new Error('Authentication required'));
  }

  socket.user = user;
  next();
});

io.on('connection', (socket) => {
  socket.emit('activeRooms', activeRoomsPayload());

  socket.on('joinRoom', (sessionId) => {
    const sessionData = findSession(sessionId);
    if (!sessionData) {
      return;
    }

    if (socket.currentRoom) {
      leaveCurrentRoom(socket);
    }

    const room = getRoom(sessionId);
    const participant = {
      socketId: socket.id,
      userId: socket.user.id,
      name: socket.user.name,
      photo: socket.user.photo
    };

    socket.join(sessionId);
    socket.currentRoom = sessionId;
    room.participants.set(socket.id, participant);

    socket.emit('chatHistory', room.messages);
    io.to(sessionId).emit('participants', participantsPayload(room));
    io.to(sessionId).emit('roomNotice', `${socket.user.name} joined the room`);
    emitActiveRooms();
  });

  socket.on('sendMessage', ({ sessionId, text }) => {
    const cleanText = String(text || '').trim();
    const room = rooms.get(sessionId);

    if (!cleanText || !room || socket.currentRoom !== sessionId) {
      return;
    }

    const message = {
      id: `${Date.now()}-${socket.id}`,
      sender: socket.user.name,
      text: cleanText,
      timestamp: new Date().toISOString()
    };

    room.messages.push(message);
    io.to(sessionId).emit('chatMessage', message);
  });

  socket.on('leaveRoom', () => leaveCurrentRoom(socket));
  socket.on('disconnect', () => leaveCurrentRoom(socket));
});

function leaveCurrentRoom(socket) {
  const sessionId = socket.currentRoom;
  if (!sessionId) {
    return;
  }

  const room = rooms.get(sessionId);
  socket.leave(sessionId);
  socket.currentRoom = null;

  if (room) {
    room.participants.delete(socket.id);
    io.to(sessionId).emit('participants', participantsPayload(room));
    io.to(sessionId).emit('roomNotice', `${socket.user.name} left the room`);
  }

  emitActiveRooms();
}

server.listen(port, () => {
  console.log(`Conference Connect server running on http://localhost:${port}`);
});
