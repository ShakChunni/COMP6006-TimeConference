import { Alert, Col, Container, Row, Spinner } from 'react-bootstrap';
import SessionCard from '../components/SessionCard.jsx';
import { useSchedule } from '../context/ScheduleContext.jsx';
import { useSessions } from '../hooks.js';

export default function MySchedule() {
  const { sessions, loading, error } = useSessions();
  const { scheduleIds, removeSession } = useSchedule();
  const savedSessions = sessions.filter((session) => scheduleIds.includes(session.id));

  return (
    <Container className="py-4">
      <h1 className="h2">My Schedule</h1>
      <p className="text-muted">Sessions saved for quick access during the conference.</p>
      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && savedSessions.length === 0 && <Alert variant="info">No sessions added yet.</Alert>}
      <Row className="g-3">
        {savedSessions.map((session) => (
          <Col md={6} lg={4} key={session.id}>
            <SessionCard session={session} onRemove={removeSession} showRemove />
          </Col>
        ))}
      </Row>
    </Container>
  );
}
