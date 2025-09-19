import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaUserMd, FaClock } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "./AuthContext";
import UpcomingAppointments from "./UpcomingAppointments.jsx";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    appointments: 0,
    patients: 0,
    schedules: 0,
  });

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchDoctorData = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/doctor/dashboard");
        console.log("RES: " + res);

        if (res.data.success && res.data.data) {
          const { stats } = res.data.data;
          setStats({
            appointments: stats.total_appointments || 0,
            patients: stats.booked_slots || 0, // Using booked slots as patient count
            schedules: stats.available_slots || 0,
          });
        } else {
          console.log("NOT LOGIN");
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      }
    };

    fetchDoctorData();
  }, [isAuthenticated]);

  return (
    <Container>
      {/* Welcome Section */}
      <Row className="mb-4">
        <Col>
          <h1>Dashboard</h1>
        </Col>
      </Row>

      {/* Stats Grid */}
      <Row className="mb-4">
        <Col md={4} sm={6}>
          <Card className="stat-card">
            <Card.Body>
              <FaCalendarAlt className="stat-icon" />
              <h3>{stats.appointments}</h3>
              <p>Appointments</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} sm={6}>
          <Card className="stat-card">
            <Card.Body>
              <FaUserMd className="stat-icon" />
              <h3>{stats.patients}</h3>
              <p>Patients</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} sm={6}>
          <Card className="stat-card">
            <Card.Body>
              <FaClock className="stat-icon" />
              <h3>{stats.schedules}</h3>
              <p>Available Slots</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Info Section */}
      <Row className="mb-4">
        <Col>
          <div className="info-box">
            Stay on top of your schedule, patient updates, and availability—all from one dashboard.
          </div>
        </Col>
      </Row>

      {/* Upcoming Appointments */}
      <Row className="mb-4">
        <Col>
          <UpcomingAppointments />
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
