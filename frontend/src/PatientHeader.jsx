import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { NavLink } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useNavigate } from 'react-router-dom';

function PatientHeader() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('MediUser');
    navigate('/dashboard');
  };

  return (
    <Navbar variant="light" expand="lg" className='fixed-top navCustom'>
      <Container fluid>
        {/* Logo bên trái */}
        <Navbar.Brand className='fw-bold' href="#home">Mediconnect</Navbar.Brand>

        {/* Toggle cho responsive */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* Menu và Login */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto d-flex align-items-center gap-5 ">
            <Nav.Link className='nav-link' as={NavLink} to="/llll" end>HOME</Nav.Link>

            <Nav.Link className='nav-link' as={NavLink} to="/findUDoctor">FIND YOUR DOCTOR</Nav.Link>
            <Nav.Link className='nav-link' as={NavLink} to="/kkk">APPOINTMENT MANAGEMENT </Nav.Link>
            {/* Login */}
            <NavDropdown className='pe-4' title="MEMBERSHIP" id="basic-nav-dropdown">
              <NavDropdown.Item className='p-0 text-center' href="/patientProfile">My Profile</NavDropdown.Item>
              <NavDropdown.Item className='p-0 text-center' href=""><button className='btn btn-link opacity-50 text-decoration-none text-dark p-0 w-100' onClick={handleLogout}>Logout</button></NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default PatientHeader;
