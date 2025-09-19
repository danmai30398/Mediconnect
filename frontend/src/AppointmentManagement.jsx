import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { Row, Col, Button, Card, Modal, Form, Spinner } from 'react-bootstrap';
import './App.css';

const AppointmentManagement = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    console.log('AppointmentManagement mounted, fetching appointments...');
    console.log('Current user:', user);
    fetchAppointments();
  }, [user]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:8000/api/appointments');
      console.log('API Response:', response.data); // Debug log
      
      // Ensure we always have an array
      const appointmentsData = response.data?.data || response.data || [];
      if (Array.isArray(appointmentsData)) {
        setAppointments(appointmentsData);
      } else {
        console.error('Invalid appointments data:', appointmentsData);
        setAppointments([]);
        setError('Invalid data received from server');
      }
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      setAppointments([]);
      setError('Failed to load appointments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedAppointment || !newStatus) return;

    try {
      setLoading(true);
      await axios.post(`http://localhost:8000/api/appointments/${selectedAppointment.appointment_id}/status`, {
        status: newStatus
      });
      
      // Refresh appointments
      await fetchAppointments();
      setShowStatusModal(false);
      setSelectedAppointment(null);
      setNewStatus('');
      alert('Appointment status updated successfully!');
    } catch (error) {
      console.error('Failed to update appointment status:', error);
      alert('Failed to update appointment status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openStatusModal = (appointment) => {
    setSelectedAppointment(appointment);
    setNewStatus(appointment.status);
    setShowStatusModal(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': '#f39c12',
      'confirmed': '#27ae60',
      'completed': '#3498db',
      'cancelled_by_doctor': '#e74c3c',
      'cancelled_by_patient': '#e74c3c',
      'no_show': '#95a5a6',
      'rescheduled': '#9b59b6'
    };
    return colors[status] || '#95a5a6';
  };

  const getStatusText = (status) => {
    const texts = {
      'pending': 'Pending Confirmation',
      'confirmed': 'Confirmed',
      'completed': 'Completed',
      'cancelled_by_doctor': 'Cancelled by Doctor',
      'cancelled_by_patient': 'Cancelled by Patient',
      'no_show': 'No Show',
      'rescheduled': 'Rescheduled'
    };
    return texts[status] || status;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Ensure appointments is always an array
  const safeAppointments = Array.isArray(appointments) ? appointments : [];

  if (loading && safeAppointments.length === 0) {
    return (
      <div className="loading-container">
        <Spinner animation="border" variant="primary" />
        <p>Loading appointments...</p>
      </div>
    );
  }

  return (
    <div className="appointment-management-container">
      <h2>Appointment Management</h2>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <Button onClick={fetchAppointments} variant="warning">
            Retry
          </Button>
        </div>
      )}

      {!error && safeAppointments.length === 0 ? (
        <div className="no-appointments">
          <p>No appointments found.</p>
        </div>
      ) : !error && (
        <div className="appointments-list">
          {safeAppointments.map((appointment) => (
            <Card key={appointment.appointment_id} className="appointment-card mb-4">
              <Card.Body>
                <Card.Title>{appointment.patient.name}</Card.Title>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(appointment.status) }}
                >
                  {getStatusText(appointment.status)}
                </span>

                <div className="appointment-details mt-3">
                  <Row>
                    <Col><strong>Date:</strong> {formatDate(appointment.availability.available_date)}</Col>
                    <Col><strong>Time:</strong> {formatTime(appointment.availability.available_time)}</Col>
                  </Row>
                  <Row>
                    <Col><strong>Patient Phone:</strong> {appointment.patient.phone}</Col>
                    <Col><strong>Patient Email:</strong> {appointment.patient.email}</Col>
                  </Row>
                  <Row>
                    <Col><strong>Booked On:</strong> {formatDate(appointment.created_at)}</Col>
                  </Row>
                </div>

                <Button
                  variant="primary"
                  className="mt-3"
                  onClick={() => openStatusModal(appointment)}
                >
                  Update Status
                </Button>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}

      {/* Status Update Modal */}
      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Appointment Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Patient:</strong> {selectedAppointment?.patient.name}</p>
          <p><strong>Date:</strong> {selectedAppointment && formatDate(selectedAppointment.availability.available_date)}</p>
          <p><strong>Time:</strong> {selectedAppointment && formatTime(selectedAppointment.availability.available_time)}</p>

          <Form.Group controlId="status">
            <Form.Label>New Status:</Form.Label>
            <Form.Control
              as="select"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="pending">Pending Confirmation</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled_by_doctor">Cancelled by Doctor</option>
              <option value="no_show">No Show</option>
              <option value="rescheduled">Rescheduled</option>
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStatusModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleStatusUpdate}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Status'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AppointmentManagement;
