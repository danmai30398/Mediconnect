import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, Row, Col, ListGroup, Badge, Button } from "react-bootstrap";
import { apiService } from "./services/apiService";

function PatientDashboard() {
    const [stats, setStats] = useState({ 
        total_appointments: 0, 
        upcoming_appointments: 0, 
        completed_appointments: 0,
        cancelled_appointments: 0 
    });
    const [recentAppointments, setRecentAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [patientInfo, setPatientInfo] = useState({ name: "", email: "" });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('MediToken') || '';
                if (!token) return;

                // Get patient info
                const userData = JSON.parse(localStorage.getItem('MediUser') || '{}');
                setPatientInfo({
                    name: userData.name || "Patient",
                    email: userData.email || ""
                });

                // Fetch patient's appointments using apiService
                const appointmentsData = await apiService.getPatientAppointments();
                
                // Calculate stats
                const total = appointmentsData.length;
                const upcoming = appointmentsData.filter(apt => 
                    apt.status === 'pending' || apt.status === 'confirmed'
                ).length;
                const completed = appointmentsData.filter(apt => apt.status === 'completed').length;
                const cancelled = appointmentsData.filter(apt => apt.status === 'cancelled').length;

                setStats({ 
                    total_appointments: total, 
                    upcoming_appointments: upcoming, 
                    completed_appointments: completed,
                    cancelled_appointments: cancelled 
                });
                setRecentAppointments(appointmentsData.slice(0, 5));
            } catch (error) {
                console.error('Error fetching patient data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatTime = (timeString) => {
        if (!timeString) return 'Unknown time';
        const time = new Date(timeString);
        return time.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'pending': { variant: 'warning', text: 'Pending' },
            'confirmed': { variant: 'info', text: 'Confirmed' },
            'completed': { variant: 'success', text: 'Completed' },
            'cancelled': { variant: 'danger', text: 'Cancelled' }
        };
        const statusInfo = statusMap[status] || { variant: 'secondary', text: status };
        return <Badge bg={statusInfo.variant}>{statusInfo.text}</Badge>;
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4 px-4" style={{ marginTop: '80px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="mb-1">Welcome back, {patientInfo.name}!</h2>
                    <p className="text-muted mb-0">Patient Dashboard</p>
                </div>
                <div className="text-end">
                    <small className="text-muted">Last updated: {new Date().toLocaleString()}</small>
                </div>
            </div>

            {/* Stats Cards */}
            <Row className="mb-4 g-3">
                <Col lg={3} md={6} className="mb-3">
                    <Card className="h-100 border-0 shadow-sm bg-primary text-white">
                        <Card.Body className="text-center p-4">
                            <div className="mb-3">
                                <i className="fas fa-calendar-alt fa-3x"></i>
                            </div>
                            <h2 className="mb-2 fw-bold">{stats.total_appointments}</h2>
                            <p className="mb-0 fs-6">Total Appointments</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={3} md={6} className="mb-3">
                    <Card className="h-100 border-0 shadow-sm bg-info text-white">
                        <Card.Body className="text-center p-4">
                            <div className="mb-3">
                                <i className="fas fa-calendar-check fa-3x"></i>
                            </div>
                            <h2 className="mb-2 fw-bold">{stats.upcoming_appointments}</h2>
                            <p className="mb-0 fs-6">Upcoming</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={3} md={6} className="mb-3">
                    <Card className="h-100 border-0 shadow-sm bg-success text-white">
                        <Card.Body className="text-center p-4">
                            <div className="mb-3">
                                <i className="fas fa-check-circle fa-3x"></i>
                            </div>
                            <h2 className="mb-2 fw-bold">{stats.completed_appointments}</h2>
                            <p className="mb-0 fs-6">Completed</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={3} md={6} className="mb-3">
                    <Card className="h-100 border-0 shadow-sm bg-danger text-white">
                        <Card.Body className="text-center p-4">
                            <div className="mb-3">
                                <i className="fas fa-times-circle fa-3x"></i>
                            </div>
                            <h2 className="mb-2 fw-bold">{stats.cancelled_appointments}</h2>
                            <p className="mb-0 fs-6">Cancelled</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Recent Appointments */}
            <Row className="mb-4">
                <Col>
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-light border-bottom py-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0 fw-bold">
                                    <i className="fas fa-calendar-alt me-2 text-primary"></i>
                                    Recent Appointments
                                </h5>
                                <Link to="/patient/appointments" className="btn btn-outline-primary btn-sm">
                                    <i className="fas fa-eye me-1"></i>View All
                                </Link>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0">
                            {recentAppointments.length > 0 ? (
                                <ListGroup variant="flush">
                                    {recentAppointments.map((appointment, index) => (
                                        <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center py-3 px-4">
                                            <div className="d-flex align-items-center">
                                                <div className="me-3">
                                                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                                                        <i className="fas fa-user-md"></i>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h6 className="mb-1 fw-bold">
                                                        Dr. {appointment.doctor?.name || 'Unknown Doctor'}
                                                    </h6>
                                                    <small className="text-muted">
                                                        <i className="fas fa-calendar me-1"></i>
                                                        {appointment.availability_scheduling?.available_date && 
                                                            new Date(appointment.availability_scheduling.available_date).toLocaleDateString()
                                                        } at {appointment.availability_scheduling?.available_time}
                                                    </small>
                                                </div>
                                            </div>
                                            <div className="text-end">
                                                {getStatusBadge(appointment.status)}
                                                <br />
                                                <small className="text-muted">
                                                    <i className="fas fa-clock me-1"></i>
                                                    {formatTime(appointment.created_at)}
                                                </small>
                                            </div>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            ) : (
                                <div className="text-center py-5">
                                    <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                                        <i className="fas fa-calendar-times fa-2x text-muted"></i>
                                    </div>
                                    <h6 className="text-muted mb-3">No appointments found</h6>
                                    <Link to="/findUDoctor" className="btn btn-primary btn-lg">
                                        <i className="fas fa-plus me-2"></i>Book an Appointment
                                    </Link>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Quick Actions */}
            <Row>
                <Col>
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-light border-bottom py-3">
                            <h5 className="mb-0 fw-bold">
                                <i className="fas fa-bolt me-2 text-warning"></i>
                                Quick Actions
                            </h5>
                        </Card.Header>
                        <Card.Body className="p-4">
                            <Row className="g-3">
                                <Col lg={3} md={6} className="mb-2">
                                    <Link to="/findUDoctor" className="btn btn-outline-primary w-100 py-3 d-flex flex-column align-items-center">
                                        <i className="fas fa-search fa-2x mb-2"></i>
                                        <span className="fw-bold">Find a Doctor</span>
                                        <small className="text-muted">Search & Book</small>
                                    </Link>
                                </Col>
                                <Col lg={3} md={6} className="mb-2">
                                    <Link to="/patient/appointments" className="btn btn-outline-success w-100 py-3 d-flex flex-column align-items-center">
                                        <i className="fas fa-calendar-alt fa-2x mb-2"></i>
                                        <span className="fw-bold">My Appointments</span>
                                        <small className="text-muted">View & Manage</small>
                                    </Link>
                                </Col>
                                <Col lg={3} md={6} className="mb-2">
                                    <Link to="/patientProfile" className="btn btn-outline-info w-100 py-3 d-flex flex-column align-items-center">
                                        <i className="fas fa-user fa-2x mb-2"></i>
                                        <span className="fw-bold">My Profile</span>
                                        <small className="text-muted">Edit Information</small>
                                    </Link>
                                </Col>
                                <Col lg={3} md={6} className="mb-2">
                                    <Button variant="outline-secondary" className="w-100 py-3 d-flex flex-column align-items-center" disabled>
                                        <i className="fas fa-file-medical fa-2x mb-2"></i>
                                        <span className="fw-bold">Medical Records</span>
                                        <small className="text-muted">Coming Soon</small>
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default PatientDashboard;
