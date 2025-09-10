import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { NavLink } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { apiService } from './services/apiService';

function PatientHeader() {
  const navigate = useNavigate();
  
  // Check if user is patient
  useEffect(() => {
    try {
      const raw = localStorage.getItem('MediUser');
      if (!raw) {
        navigate('/login');
        return;
      }
      const user = JSON.parse(raw);
      if (Number(user.role_id) !== 3) {
        // Not patient, redirect based on role
        if (Number(user.role_id) === 1) {
          navigate('/admin/dashboard');
        } else if (Number(user.role_id) === 2) {
          navigate('/doctor/dashboard');
        } else {
          navigate('/login');
        }
      }
    } catch (error) {
      navigate('/login');
    }
  }, [navigate]);
  const handleLogout = async () => {
    try {
      await apiService.logout();
    } catch {}
    localStorage.removeItem('MediUser');
    localStorage.removeItem('MediToken');
    navigate('/dashboard');
  };

  return (
    <Navbar variant="light" expand="lg" className='fixed-top navCustom' style={{ backgroundColor: '#13b5e0' }}>
      <Container fluid className="px-4">
        {/* Logo on the left */}
        <Navbar.Brand className='fw-bold text-white' href="#home">MediConnect Patient</Navbar.Brand>

        {/* Toggle for responsive */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* Menu and User Info */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavLink to="/patient/dashboard" className="nav-link text-white">
              Dashboard
            </NavLink>
            <NavLink to="/findUDoctor" className="nav-link text-white">
              Find Your Doctor
            </NavLink>
            <NavLink to="/patient/appointments" className="nav-link text-white">
              My Appointments
            </NavLink>
            <NavLink to="/patient/profile" className="nav-link text-white">
              Profile
            </NavLink>
          </Nav>
          <Nav className="ms-auto d-flex align-items-center gap-3">
            <span className="text-white">Welcome, Patient</span>
            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default PatientHeader;
