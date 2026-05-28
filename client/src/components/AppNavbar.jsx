import { Container, Image, Nav, Navbar, Button } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function AppNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <Navbar bg="dark" data-bs-theme="dark" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={NavLink} to="/dashboard">Conference Connect</Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          {user && (
            <>
              <Nav className="me-auto">
                <Nav.Link as={NavLink} to="/dashboard">Dashboard</Nav.Link>
                <Nav.Link as={NavLink} to="/my-schedule">My Schedule</Nav.Link>
                <Nav.Link as={NavLink} to="/active-sessions">Active Sessions</Nav.Link>
              </Nav>
              <div className="d-flex align-items-center gap-2 text-light">
                {user.photo && <Image src={user.photo} roundedCircle width="32" height="32" alt="Profile" />}
                <span className="small">{user.name}</span>
                <Button variant="outline-light" size="sm" onClick={handleLogout}>Logout</Button>
              </div>
            </>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
