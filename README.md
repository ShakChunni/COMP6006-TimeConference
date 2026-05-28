# Conference Connect

Conference Connect is a React and Socket.io conference engagement platform for COMP6006 Part A.

## Features

- React SPA with React Router
- React-Bootstrap responsive UI
- LinkedIn OAuth login using Passport
- Local demo login for testing multiple attendees
- Protected conference pages
- Dashboard with predefined conference sessions
- Personal schedule stored in browser localStorage
- Active live sessions with real-time participant counts
- Socket.io live rooms with chat, chat history, participant lists, and join/leave notices

## Requirements

- Node.js 18 or newer
- LinkedIn Developer app with Sign In with LinkedIn using OpenID Connect enabled

## Environment Variables

Create `server/.env` using `server/.env.example` as a guide.

```env
PORT=3000
CLIENT_URL=http://localhost:5173
SESSION_SECRET=replace-with-a-long-random-secret
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
LINKEDIN_CALLBACK_URL=http://localhost:3000/auth/linkedin/callback
```

In the LinkedIn Developer Portal, add this redirect URL:

```text
http://localhost:3000/auth/linkedin/callback
```

## Install

Install backend dependencies:

```bash
cd server
npm install
```

Install frontend dependencies:

```bash
cd ../client
npm install
```

## Run

Start the backend:

```bash
cd server
npm run dev
```

Start the frontend in another terminal:

```bash
cd client
npm run dev
```

Open:

```text
http://localhost:5173
```

## Testing Multiple Users

Use different browsers, private windows, or the Demo/Test Login on the login page with different names. The LinkedIn option is the main OAuth login, while demo login is included only for easier multi-user testing during development and demonstration.

## Notes

No database is used. Sessions, active rooms, participant lists, and chat history are stored in server memory and reset when the server restarts.
