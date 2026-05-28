import { useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { createSocket } from '../socket.js';

export default function ActiveSessions() {
  const [activeRooms, setActiveRooms] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const socket = createSocket();

    socket.on('connect_error', () => setError('Could not connect to live session server.'));
    socket.on('activeRooms', setActiveRooms);

    return () => socket.disconnect();
  }, []);

  return (
    <Container className="py-4">
      <h1 className="h2">Active Sessions</h1>
      <p className="text-muted">Rooms appear here when at least one attendee has joined.</p>
      {error && <Alert variant="danger">{error}</Alert>}
      {activeRooms.length === 0 && <Alert variant="info">No live rooms are active yet.</Alert>}
      <Row className="g-3">
        {activeRooms.map((room) => (
          <Col md={6} lg={4} key={room.sessionId}>
            <Card className="h-100">
              <Card.Body>
                <Card.Title>{room.session.title}</Card.Title>
                <Badge bg="success" className="mb-3">{room.participantCount} participant{room.participantCount === 1 ? '' : 's'}</Badge>
                <div>
                  <Button as={Link} to={`/live/${room.sessionId}`}>Join Room</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
