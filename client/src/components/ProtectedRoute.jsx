import { Navigate, Outlet } from 'react-router-dom';
import { Spinner, Container } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
