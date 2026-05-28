import { useEffect, useMemo, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Container, Form, ListGroup, Row } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { createSocket } from '../socket.js';
import { useSessions } from '../hooks.js';

export default function LiveSession() {
  const { sessionId } = useParams();
  const { sessions } = useSessions();
  const session = useMemo(() => sessions.find((item) => item.id === sessionId), [sessions, sessionId]);
  const [socket, setSocket] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [notice, setNotice] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const nextSocket = createSocket();
    setSocket(nextSocket);

    nextSocket.on('connect', () => nextSocket.emit('joinRoom', sessionId));
    nextSocket.on('connect_error', () => setError('Could not connect to this live room.'));
    nextSocket.on('participants', setParticipants);
    nextSocket.on('chatHistory', setMessages);
    nextSocket.on('chatMessage', (message) => setMessages((current) => [...current, message]));
    nextSocket.on('roomNotice', setNotice);

    return () => {
      nextSocket.emit('leaveRoom');
      nextSocket.disconnect();
    };
  }, [sessionId]);

  function sendMessage(event) {
    event.preventDefault();
    if (!text.trim() || !socket) {
      return;
    }

    socket.emit('sendMessage', { sessionId, text });
    setText('');
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
        <div>
          <h1 className="h2 mb-1">{session?.title || 'Live Session'}</h1>
          {session && <p className="text-muted mb-0">{session.speaker} · {session.time}</p>}
        </div>
        <Button as={Link} to="/dashboard" variant="outline-secondary">Back</Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {notice && <Alert variant="secondary">{notice}</Alert>}

      <Row className="g-3">
        <Col lg={8}>
          <Card className="chat-card">
            <Card.Header>Live Chat</Card.Header>
            <Card.Body className="chat-messages">
              {messages.length === 0 && <p className="text-muted">No messages yet.</p>}
              {messages.map((message) => (
                <div className="chat-message" key={message.id}>
                  <div className="small text-muted">
                    <strong>{message.sender}</strong> · {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                  <div>{message.text}</div>
                </div>
              ))}
            </Card.Body>
            <Card.Footer>
              <Form onSubmit={sendMessage} className="d-flex gap-2">
                <Form.Control value={text} onChange={(event) => setText(event.target.value)} placeholder="Type a message" />
                <Button type="submit">Send</Button>
              </Form>
            </Card.Footer>
          </Card>
        </Col>
        <Col lg={4}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              Participants <Badge bg="primary">{participants.length}</Badge>
            </Card.Header>
            <ListGroup variant="flush">
              {participants.map((participant) => (
                <ListGroup.Item key={participant.socketId}>{participant.name}</ListGroup.Item>
              ))}
              {participants.length === 0 && <ListGroup.Item className="text-muted">No participants yet.</ListGroup.Item>}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
