import { Alert, Col, Container, Row, Spinner } from 'react-bootstrap';
import SessionCard from '../components/SessionCard.jsx';
import { useSchedule } from '../context/ScheduleContext.jsx';
import { useSessions } from '../hooks.js';

export default function Dashboard() {
  const { sessions, loading, error } = useSessions();
  const { scheduleIds, addSession } = useSchedule();

  return (
    <Container className="py-4">
      <h1 className="h2">Conference Sessions</h1>
      <p className="text-muted">Browse available talks and add sessions to your personal schedule.</p>
      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}
      <Row className="g-3">
        {sessions.map((session) => (
          <Col md={6} lg={4} key={session.id}>
            <SessionCard session={session} onAdd={addSession} isSaved={scheduleIds.includes(session.id)} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}
