import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaCalendarAlt, FaUsers, FaEnvelope, FaSignOutAlt } from "react-icons/fa";
import { useDoctor } from "./DoctorContext";
import { useAuth } from "./AuthContext";
import { Nav, Button, Image, Col, Row } from "react-bootstrap";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { doctor } = useDoctor();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClass = (path) =>
    location.pathname === path ? "active" : "inactive";

  return (
    <Col md={2} className="sidebar" style={{ backgroundColor: "#0069D9" }}>
      <Row className="d-flex align-items-center justify-content-center p-3 doctor-profile-logo-row">
        <Image
          src="/doctor-images/logo.png"
          alt="MediConnect Logo"
          fluid
        />
      </Row>

      <Row className="d-flex flex-column align-items-center justify-content-center p-3 text-center" style={{ width: '100%' }}>
        <div className="avatar-wrapper mb-2">
          <Image
            src={doctor?.image ? `http://localhost:8000${doctor.image}` : "/default-avatar.jpg"}
            alt="Doctor"
            roundedCircle
            fluid
            style={{ width: "120px", height: "120px" }}
          />
        </div>
        <h5>{doctor?.name || user?.name || "Doctor"}</h5>
        <p className="text-muted">{doctor?.specialization || "Specialist"}</p>
      </Row>

      <Nav className="flex-column">
        <Nav.Item>
          <Nav.Link as={Link} to="/dashboard" className={`nav-link ${linkClass("/dashboard")}`}>
            <FaTachometerAlt /> Dashboard
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/doctorprofile" className={`nav-link ${linkClass("/doctorprofile")}`}>
            <FaCalendarAlt /> Doctor Profile
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/AvailabilityPage" className={`nav-link ${linkClass("/AvailabilityPage")}`}>
            <FaUsers /> Availability Scheduling
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/docappointment" className={`nav-link ${linkClass("/docappointment")}`}>
            <FaEnvelope /> Appointment Viewing
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/appointment-management" className={`nav-link ${linkClass("/appointment-management")}`}>
            <FaEnvelope /> Appointment Management
          </Nav.Link>
        </Nav.Item>
      </Nav>


      <div className="mt-auto p-3">
        <Button variant="link" onClick={handleLogout} className="text-danger d-flex align-items-center">
          <FaSignOutAlt /> Logout
        </Button>
      </div>
    </Col>
  );
};

export default Sidebar;
