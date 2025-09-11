import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Badge, Container, Table, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { apiService } from './services/apiService';
import './Doctors.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000";

function PatientAppointments() {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            // Sử dụng apiService để lấy danh sách appointments
            const data = await apiService.getPatientAppointments();
            // Handle both direct array and object with appointments property
            const appointmentsArray = Array.isArray(data) ? data : (data.appointments || []);
            setAppointments(appointmentsArray);
        } catch (error) {
            setAlert({ show: true, message: 'Error fetching appointments', type: 'danger' });
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'scheduled': { variant: 'primary', text: 'Scheduled' },
            'confirmed': { variant: 'success', text: 'Confirmed' },
            'completed': { variant: 'info', text: 'Completed' },
            'cancelled': { variant: 'danger', text: 'Cancelled' },
            'no_show': { variant: 'warning', text: 'No Show' }
        };
        
        const statusInfo = statusMap[status] || { variant: 'secondary', text: status };
        return <Badge bg={statusInfo.variant}>{statusInfo.text}</Badge>;
    };

    const formatDateTime = (date, time) => {
        if (!date || !time) return 'N/A';
        const dateObj = new Date(date);
        const timeObj = new Date(`2000-01-01T${time}`);
        return `${dateObj.toLocaleDateString()} at ${timeObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    };

    if (loading) {
        return (
            <div className="container-fluid py-4 px-4" style={{ marginTop: '80px' }}>
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4 px-4" style={{ marginTop: '80px' }}>
            <Container>
                <Row className="mb-4">
                    <Col>
                        <h2 className="text-primary mb-0">My Appointments</h2>
                        <p className="text-muted">Manage your medical appointments</p>
                    </Col>
                </Row>

                {alert.show && (
                    <Alert variant={alert.type} dismissible onClose={() => setAlert({ show: false, message: '', type: '' })}>
                        {alert.message}
                    </Alert>
                )}

                <Card className="border-0 shadow-sm">
                    <Card.Body className="p-0">
                        {appointments.length === 0 ? (
                            <div className="text-center py-5">
                                <i className="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                                <h5 className="text-muted">No appointments found</h5>
                                <p className="text-muted">You don't have any appointments yet.</p>
                                <Button variant="primary" onClick={() => navigate('/findUDoctor')}>
                                    <i className="fas fa-search me-2"></i>Find a Doctor
                                </Button>
                            </div>
                        ) : (
                            <Table responsive hover className="mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Doctor</th>
                                        <th>Date & Time</th>
                                        <th>Status</th>
                                        <th>Notes</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.map((appointment) => (
                                        <tr key={appointment.id}>
                                            <td>
                                                <div>
                                                    <strong>{appointment.doctor_name}</strong>
                                                    <br />
                                                    <small className="text-muted">{appointment.specialization || 'General Practice'}</small>
                                                </div>
                                            </td>
                                            <td>
                                                {formatDateTime(appointment.available_date, appointment.available_time)}
                                            </td>
                                            <td>
                                                {getStatusBadge(appointment.status)}
                                            </td>
                                            <td>
                                                <span className="text-muted">
                                                    {appointment.notes || 'No notes'}
                                                </span>
                                            </td>
                                            <td>
                                                <Button 
                                                    variant="outline-primary" 
                                                    size="sm"
                                                    onClick={() => {
                                                        // Handle appointment actions
                                                    }}
                                                >
                                                    <i className="fas fa-eye me-1"></i>View
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                    </Card.Body>
                </Card>

                <Row className="mt-4">
                    <Col className="text-center">
                        <Button 
                            variant="primary" 
                            size="lg"
                            onClick={() => navigate('/findUDoctor')}
                            className="me-3"
                        >
                            <i className="fas fa-search me-2"></i>Find a Doctor
                        </Button>
                        <Button 
                            variant="outline-primary" 
                            size="lg"
                            onClick={() => navigate('/patient/dashboard')}
                        >
                            <i className="fas fa-tachometer-alt me-2"></i>Back to Dashboard
                        </Button>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default PatientAppointments;
