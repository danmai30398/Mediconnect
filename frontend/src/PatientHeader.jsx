import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Link, NavLink } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useNavigate } from 'react-router-dom';

function PatientHeader({ onNavClick }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('MediUser');
    localStorage.removeItem('showWelcome');
    navigate('/home');
  };

  return (
    <div>
      <Navbar variant="light" expand="lg" className='fixed-top navCustom p-0'>
        <Container fluid>
          {/* Logo bên trái */}
          <Navbar.Brand className='fw-bold' href="#home">
            <img style={{ width: '50px', height: '50px', objectFit: 'contain' }} src={`${process.env.PUBLIC_URL}/Images/logo.jpg`} alt="logo" />
            MediConnect Group</Navbar.Brand>

          {/* Toggle cho responsive */}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          {/* Menu và Login */}
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto d-flex align-items-center gap-5 ">
              {/* <Nav.Link className='nav-link' as={NavLink} to="/llll" end>HOME</Nav.Link> */}

              <Nav.Link className='nav-link' as={NavLink} to="/findUDoctor" onClick={onNavClick}>FIND YOUR DOCTOR</Nav.Link>
              <Nav.Link className='nav-link' as={NavLink} to="/appointmentMg" onClick={onNavClick}>APPOINTMENT MANAGEMENT </Nav.Link>
              {/* Login */}
              <NavDropdown className='pe-4' title="MEMBERSHIP" id="basic-nav-dropdown" >
                <NavDropdown.Item className='p-0 text-center' as={Link}
                  to="/patientProfile" onClick={onNavClick}>My Profile</NavDropdown.Item>
                <NavDropdown.Item className='p-0 text-center' ><button className='btn btn-link opacity-50 text-decoration-none text-dark p-0 w-100' onClick={handleLogout}>Logout</button></NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default PatientHeader;
