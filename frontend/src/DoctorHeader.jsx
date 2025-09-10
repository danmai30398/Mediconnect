import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { NavLink } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { apiService } from './services/apiService';

function DoctorHeader() {
  const navigate = useNavigate();
  
  // Check if user is doctor
  useEffect(() => {
    try {
      const raw = localStorage.getItem('MediUser');
      if (!raw) {
        navigate('/login');
        return;
      }
      const user = JSON.parse(raw);
      if (Number(user.role_id) !== 2) {
        // Not doctor, redirect based on role
        if (Number(user.role_id) === 1) {
          navigate('/admin/dashboard');
                } else if (Number(user.role_id) === 3) {
                    navigate('/patient/dashboard');
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
    navigate('/login');
  };

  const user = JSON.parse(localStorage.getItem('MediUser') || '{}');

  return (
    <Navbar variant="light" expand="lg" className='fixed-top navCustom' style={{ backgroundColor: '#13b5e0' }}>
      <Container fluid className="px-4">
        {/* Logo on the left */}
        <Navbar.Brand className='fw-bold text-white' href="#home">MediConnect Doctor</Navbar.Brand>

        {/* Toggle for responsive */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* Menu and Login */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavLink to="/doctor/dashboard" className="nav-link text-white">
              Dashboard
            </NavLink>
            <NavLink to="/doctor/appointments" className="nav-link text-white">
              My Appointments
            </NavLink>
            <NavLink to="/doctor/patients" className="nav-link text-white">
              My Patients
            </NavLink>
            <NavLink to="/doctor/profile" className="nav-link text-white">
              Profile
            </NavLink>
          </Nav>

          <Nav>
            <Nav.Item className="d-flex align-items-center me-3">
              <span className="text-white">Welcome, Dr. {user.name || 'Doctor'}</span>
            </Nav.Item>
            <Nav.Item>
              <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default DoctorHeader;
