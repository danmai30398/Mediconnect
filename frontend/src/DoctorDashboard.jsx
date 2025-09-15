import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, Row, Col, ListGroup, Badge, Button } from "react-bootstrap";
import { apiService } from "./services/apiService";

function DoctorDashboard() {
    const [stats, setStats] = useState({ 
        total_appointments: 0, 
        today_appointments: 0, 
        pending_appointments: 0,
        completed_appointments: 0 
    });
    const [recentAppointments, setRecentAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [doctorInfo, setDoctorInfo] = useState({ name: "", specialization: "" });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('MediToken') || '';
                if (!token) return;

                // Get doctor info
                const userData = JSON.parse(localStorage.getItem('MediUser') || '{}');
                setDoctorInfo({
                    name: userData.name || "Doctor",
                    specialization: userData.specialization || "General Medicine"
                });

                // Fetch doctor's appointments using apiService
                const appointmentsData = await apiService.getDoctorAppointments();
                
                // Calculate stats
                const total = appointmentsData.length;
                const today = appointmentsData.filter(apt => {
                    const aptDate = new Date(apt.availability_scheduling?.available_date);
                    const today = new Date();
                    return aptDate.toDateString() === today.toDateString();
                }).length;
                const pending = appointmentsData.filter(apt => apt.status === 'pending').length;
                const completed = appointmentsData.filter(apt => apt.status === 'completed').length;

                setStats({ total_appointments: total, today_appointments: today, pending_appointments: pending, completed_appointments: completed });
                setRecentAppointments(appointmentsData.slice(0, 5));
            } catch (error) {
                console.error('Error fetching doctor data:', error);
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
                    <h2 className="mb-1">Welcome back, Dr. {doctorInfo.name}!</h2>
                    <p className="text-muted mb-0">Specialization: {doctorInfo.specialization}</p>
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
                    <Card className="h-100 border-0 shadow-sm bg-success text-white">
                        <Card.Body className="text-center p-4">
                            <div className="mb-3">
                                <i className="fas fa-calendar-day fa-3x"></i>
                            </div>
                            <h2 className="mb-2 fw-bold">{stats.today_appointments}</h2>
                            <p className="mb-0 fs-6">Today's Appointments</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={3} md={6} className="mb-3">
                    <Card className="h-100 border-0 shadow-sm bg-warning text-white">
                        <Card.Body className="text-center p-4">
                            <div className="mb-3">
                                <i className="fas fa-clock fa-3x"></i>
                            </div>
                            <h2 className="mb-2 fw-bold">{stats.pending_appointments}</h2>
                            <p className="mb-0 fs-6">Pending</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={3} md={6} className="mb-3">
                    <Card className="h-100 border-0 shadow-sm bg-info text-white">
                        <Card.Body className="text-center p-4">
                            <div className="mb-3">
                                <i className="fas fa-check-circle fa-3x"></i>
                            </div>
                            <h2 className="mb-2 fw-bold">{stats.completed_appointments}</h2>
                            <p className="mb-0 fs-6">Completed</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Recent Appointments */}
            <Row>
                <Col>
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-white border-bottom">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Recent Appointments</h5>
                                <Link to="/admin/appointments" className="btn btn-outline-primary btn-sm">
                                    View All
                                </Link>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            {recentAppointments.length > 0 ? (
                                <ListGroup variant="flush">
                                    {recentAppointments.map((appointment, index) => (
                                        <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                                            <div className="d-flex align-items-center">
                                                <div className="me-3">
                                                    <i className="fas fa-user-md text-primary"></i>
                                                </div>
                                                <div>
                                                    <h6 className="mb-1">
                                                        {appointment.patient?.name || 'Unknown Patient'}
                                                    </h6>
                                                    <small className="text-muted">
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
                                                    {formatTime(appointment.created_at)}
                                                </small>
                                            </div>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            ) : (
                                <div className="text-center py-4">
                                    <i className="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                                    <p className="text-muted">No appointments found</p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Quick Actions */}
            <Row className="mt-4">
                <Col>
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-white border-bottom">
                            <h5 className="mb-0">Quick Actions</h5>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={3} className="mb-2">
                                    <Link to="/admin/appointments" className="btn btn-outline-primary w-100">
                                        <i className="fas fa-calendar-alt me-2"></i>
                                        Manage Appointments
                                    </Link>
                                </Col>
                                <Col md={3} className="mb-2">
                                    <Link to="/admin/patients" className="btn btn-outline-success w-100">
                                        <i className="fas fa-users me-2"></i>
                                        View Patients
                                    </Link>
                                </Col>
                                <Col md={3} className="mb-2">
                                    <Button variant="outline-info" className="w-100" disabled>
                                        <i className="fas fa-chart-line me-2"></i>
                                        View Reports
                                    </Button>
                                </Col>
                                <Col md={3} className="mb-2">
                                    <Button variant="outline-secondary" className="w-100" disabled>
                                        <i className="fas fa-cog me-2"></i>
                                        Settings
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

export default DoctorDashboard;
