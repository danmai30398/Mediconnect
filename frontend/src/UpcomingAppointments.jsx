import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Button, Alert, Spinner, Card } from "react-bootstrap";

const generateNext7Days = () => {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() + i);
    return {
      date,
      iso: date.toISOString().split("T")[0],
    };
  });
};

const UpcomingAppointments = () => {
  const days = generateNext7Days();
  const [selectedDate, setSelectedDate] = useState(days[0].iso);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(
          `http://localhost:8000/api/appointments?from=${days[0].iso}&to=${days[6].iso}`
        );
        console.log('UpcomingAppointments API Response:', res.data); // Debug log
        
        // Ensure we always have an array
        const appointmentsData = res.data?.data || res.data || [];
        if (Array.isArray(appointmentsData)) {
          setAppointments(appointmentsData);
        } else {
          console.error('Invalid appointments data:', appointmentsData);
          setAppointments([]);
          setError('Invalid data received from server');
        }
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
        setAppointments([]);
        setError('Failed to load appointments. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const safeAppointments = Array.isArray(appointments) ? appointments : [];
  
  const grouped = {};
  safeAppointments.forEach((item) => {
    const dateKey = item.availability?.available_date || item.date;
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(item);
  });

  const currentAppointments = grouped[selectedDate] || [];

  if (loading) {
    return (
      <Container>
        <h3>Upcoming Appointments</h3>
        <div className="d-flex justify-content-center">
          <Spinner animation="border" variant="primary" />
          <p>Loading appointments...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <h3>Upcoming Appointments</h3>

      {error && (
        <Alert variant="danger">
          <p>{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline-danger">
            Retry
          </Button>
        </Alert>
      )}

      {/* Timeline selector */}
      <Row className="mb-4">
        {days.map((day) => (
          <Col key={day.iso} className="d-flex justify-content-center">
            <Button
              variant={day.iso === selectedDate ? "primary" : "secondary"}
              onClick={() => setSelectedDate(day.iso)}
              className="timeline-day-btn"
            >
              <div>{day.date.toLocaleDateString("en-US", { weekday: "short" })}</div>
              <div>
                {day.date.getDate()} {day.date.toLocaleDateString("en-US", { month: "short" })}
              </div>
            </Button>
          </Col>
        ))}
      </Row>

      {/* Appointment list */}
      <div>
        {!error && currentAppointments.length === 0 ? (
          <p>No appointments for this day.</p>
        ) : !error && (
          currentAppointments.map((appt, index) => (
            <Card key={appt.appointment_id || index} className="mb-3">
              <Card.Body className="d-flex">
                <img 
                  src={`http://localhost:8000/storage/${appt.patient?.image}` || "/default-avatar.jpg"} 
                  alt="avatar" 
                  className="appt-avatar rounded-circle" 
                  style={{ width: "50px", height: "50px", objectFit: "cover" }}
                />
                <div className="ml-3">
                  <strong>{appt.patient?.name || 'Unknown Patient'}</strong>
                  <div className="appointment-details">
                    <span>Status: {appt.status}</span>
                  </div>
                  <div className="time-price">
                    <span>{appt.availability?.available_time || 'N/A'}</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))
        )}
      </div>
    </Container>
  );
};

export default UpcomingAppointments;
