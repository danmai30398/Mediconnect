import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { Table, Button, Spinner, Form, InputGroup, Row, Col } from "react-bootstrap";
import { FaCheckCircle, FaEllipsisH } from "react-icons/fa";
import './App.css';

const AppointmentList = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const doctorId = user?.doctor.doctor_id || user?.id || 1;

  // Fetch appointments from API
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!doctorId) return;

      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8000/api/appointments`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': 'application/json'
          }
        });

        console.log('Appointments API Response:', response.data);

        // Handle API response structure
        const appointmentsData = response.data?.data || response.data || [];
        if (Array.isArray(appointmentsData)) {
          // Map API data to frontend format
          const mappedAppointments = appointmentsData.map(apt => ({
            appointment_id: apt.appointment_id,
            patient_id: apt.patient_id,
            patient_name: apt.patient?.name || 'Unknown Patient',
            availability_id: apt.availability_id,
            date: apt.availability?.available_date || apt.date,
            slot: apt.availability?.available_time || apt.slot,
            status: apt.status
          }));
          setAppointments(mappedAppointments);
        } else {
          console.error('Invalid appointments data:', appointmentsData);
          setAppointments([]);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [doctorId]);

  const handleAction = async (id, newStatus) => {
    try {
      setLoading(true);

      // Update appointment status via API
      const response = await axios.post(`http://localhost:8000/api/appointments/${id}/status`, {
        status: newStatus
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      console.log('Update appointment response:', response.data);

      // Update local state
      const updated = appointments.map((a) =>
        a.appointment_id === id ? { ...a, status: newStatus } : a
      );
      setAppointments(updated);

      alert(`Appointment ${newStatus} successfully!`);
    } catch (error) {
      console.error('Failed to update appointment:', error);
      alert('Failed to update appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <FaCheckCircle color="#3b82f6" />;
      case "completed":
        return <FaCheckCircle color="green" />;
      case "cancelled_by_patient":
        return <span style={{ color: "red" }}>Patient ❌</span>;
      case "cancelled_by_doctor":
        return <span style={{ color: "red" }}>Doctor ❌</span>;
      case "no_show":
        return <span style={{ color: "#f43f5e" }}>🚫</span>;
      case "rescheduled":
        return <span style={{ color: "#eab308" }}>🔁</span>;
      case "pending":
      default:
        return <FaEllipsisH color="#f97316" />;
    }
  };

  const addOneHour = (time) => {
    if (!time || typeof time !== 'string') return '00:00';
    const [h, m] = time.split(":").map(Number);
    const total = h * 60 + m + 60;
    const hour = String(Math.floor(total / 60)).padStart(2, "0");
    const min = String(total % 60).padStart(2, "0");
    return `${hour}:${min}`;
  };

  const filteredAppointments = appointments.filter((a) => {
    const matchName = a.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchStatus = statusFilter === "" || a.status === statusFilter;
    return matchName && matchStatus;
  });

  return (
    <div className="app-container">
      <h2>Appointments</h2>

      {loading && (
        <div className="loading-container">
          <Spinner animation="border" />
          <p>Loading appointments...</p>
        </div>
      )}

      <Row className="mb-3">
        <Col md={6}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search by patient name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>

        <Col md={6}>
          <Form.Control
            as="select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="rescheduled">Rescheduled</option>
            <option value="cancelled_by_patient">Cancelled by Patient</option>
            <option value="cancelled_by_doctor">Cancelled by Doctor</option>
            <option value="no_show">No Show</option>
          </Form.Control>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Patient</th>
            <th>Date</th>
            <th>Slot</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppointments.map((a) => (
            <tr key={a.appointment_id}>
              <td>{a.appointment_id}</td>
              <td>{a.patient_name}</td>
              <td>{a.date}</td>
              <td>{a.slot} – {addOneHour(a.slot)}</td>
              <td>{getStatusIcon(a.status)}</td>
              <td>
                {a.status === "pending" && (
                  <Button
                    variant="success"
                    onClick={() => handleAction(a.appointment_id, "confirmed")}
                    disabled={loading}
                  >
                    {loading ? 'Updating...' : 'Confirm'}
                  </Button>
                )}
                {a.status === "confirmed" && (
                  <>
                    <Button
                      variant="primary"
                      onClick={() => handleAction(a.appointment_id, "completed")}
                      disabled={loading}
                    >
                      {loading ? 'Updating...' : 'Complete'}
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleAction(a.appointment_id, "cancelled_by_doctor")}
                      disabled={loading}
                    >
                      {loading ? 'Updating...' : 'Cancel'}
                    </Button>
                    <Button
                      variant="warning"
                      onClick={() => handleAction(a.appointment_id, "no_show")}
                      disabled={loading}
                    >
                      {loading ? 'Updating...' : 'No Show'}
                    </Button>
                  </>
                )}
                {a.status !== "pending" && a.status !== "confirmed" && (
                  <span>{a.status}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AppointmentList;
