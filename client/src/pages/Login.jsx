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
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <h1 className="h3 mb-2">Conference Connect</h1>
              <p className="text-muted">Log in to browse sessions and join live rooms.</p>

              {searchParams.get('error') && <Alert variant="danger">LinkedIn login failed. Please try again.</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}

              <div className="d-grid gap-2 mb-4">
                <Button href={`${API_URL}/auth/linkedin`} variant="primary" size="lg">
                  Sign in with LinkedIn
                </Button>
              </div>

              <hr />

              <Form onSubmit={handleDemoLogin}>
                <Form.Label>Demo/Test Login</Form.Label>
                <Form.Control value={name} onChange={(event) => setName(event.target.value)} className="mb-2" />
                <Button type="submit" variant="outline-secondary">Use Demo Account</Button>
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
