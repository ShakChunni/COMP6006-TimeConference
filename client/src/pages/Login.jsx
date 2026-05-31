import { useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { API_URL } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { user, demoLogin } = useAuth();
  const [searchParams] = useSearchParams();
  const [name, setName] = useState('Demo Attendee');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleDemoLogin(event) {
    event.preventDefault();
    setError('');
    try {
      await demoLogin(name);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <Container className="login-page py-5">
      <Row className="justify-content-center align-items-center min-vh-75">
        <Col md={8} lg={6}>
          <Card className="login-card shadow-sm">
            <Card.Body className="p-4">
              <div className="login-title-box mb-3">Conference Connect</div>
              <p className="login-subtitle mb-4">Browse sessions, save your schedule, and join live rooms.</p>

              {searchParams.get('error') && <Alert variant="danger">LinkedIn login failed. Please try again.</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}

              <div className="d-grid gap-2 mb-3">
                <Button href={`${API_URL}/auth/linkedin`} variant="primary" size="lg" className="linkedin-button">
                  <span className="linkedin-icon">in</span>
                  <span>Sign in with LinkedIn</span>
                </Button>
              </div>

              <div className="login-divider">or use a test account</div>

              <Form onSubmit={handleDemoLogin}>
                <Form.Label>Demo/Test Login</Form.Label>
                <Form.Control value={name} onChange={(event) => setName(event.target.value)} className="mb-2" />
                <div className="d-grid">
                  <Button type="submit" variant="outline-secondary">Use Demo Account</Button>
                </div>
                <Form.Text className="d-block mt-2 text-muted">
                  Demo login is included only for testing multiple attendees.
                </Form.Text>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
