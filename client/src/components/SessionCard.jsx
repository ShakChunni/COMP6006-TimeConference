import { Badge, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function SessionCard({ session, onAdd, onRemove, isSaved, showRemove = false }) {
  return (
    <Card className="h-100 session-card">
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
          <Card.Title className="mb-0">{session.title}</Card.Title>
          <Badge bg="secondary">{session.topic}</Badge>
        </div>
        <Card.Subtitle className="text-muted mb-2">{session.speaker} · {session.time}</Card.Subtitle>
        <Card.Text className="flex-grow-1">{session.description}</Card.Text>
        <div className="d-flex gap-2 flex-wrap">
          <Button as={Link} to={`/live/${session.id}`} variant="primary">Join Live Session</Button>
          {showRemove ? (
            <Button variant="outline-danger" onClick={() => onRemove(session.id)}>Remove</Button>
          ) : (
            <Button variant={isSaved ? 'success' : 'outline-primary'} onClick={() => onAdd(session.id)} disabled={isSaved}>
              {isSaved ? 'Added' : 'Add to My Schedule'}
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}
