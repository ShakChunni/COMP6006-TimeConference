import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppNavbar from './components/AppNavbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ActiveSessions from './pages/ActiveSessions.jsx';
import Dashboard from './pages/Dashboard.jsx';
import LiveSession from './pages/LiveSession.jsx';
import Login from './pages/Login.jsx';
import MySchedule from './pages/MySchedule.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <AppNavbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-schedule" element={<MySchedule />} />
          <Route path="/active-sessions" element={<ActiveSessions />} />
          <Route path="/live/:sessionId" element={<LiveSession />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
