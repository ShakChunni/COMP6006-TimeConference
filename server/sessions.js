export const conferenceSessions = [
  {
    id: 'react-patterns',
    title: 'Practical React Patterns',
    speaker: 'Mia Chen',
    topic: 'Frontend',
    time: '09:30 AM',
    description: 'A beginner-friendly session on building reusable React components.'
  },
  {
    id: 'node-apis',
    title: 'Building APIs with Node.js',
    speaker: 'Daniel Brooks',
    topic: 'Backend',
    time: '10:30 AM',
    description: 'An introduction to Express routes, middleware, and simple API design.'
  },
  {
    id: 'realtime-web',
    title: 'Real-Time Web Apps',
    speaker: 'Sarah Ahmed',
    topic: 'Real-Time',
    time: '11:30 AM',
    description: 'How Socket.io rooms can support live chat and participant updates.'
  },
  {
    id: 'oauth-security',
    title: 'OAuth Login Basics',
    speaker: 'Liam Patel',
    topic: 'Security',
    time: '01:00 PM',
    description: 'A simple explanation of OAuth login flows and protected routes.'
  },
  {
    id: 'cloud-intro',
    title: 'Cloud Deployment Introduction',
    speaker: 'Emma Wilson',
    topic: 'Cloud',
    time: '02:00 PM',
    description: 'Basic deployment ideas for small web applications.'
  },
  {
    id: 'ux-basics',
    title: 'UI Design for Developers',
    speaker: 'Noah Singh',
    topic: 'Design',
    time: '03:00 PM',
    description: 'Simple layout and usability choices for developer-built interfaces.'
  }
];

export function findSession(sessionId) {
  return conferenceSessions.find((session) => session.id === sessionId);
}
