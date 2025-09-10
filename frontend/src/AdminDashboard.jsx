import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, Row, Col, ListGroup, Badge } from "react-bootstrap";
import { apiService } from "./services/apiService";

function AdminDashboard() {
    const [stats, setStats] = useState({ total_doctors: 0, total_patients: 0, today_appointments: 0 });
    const [recentActivities, setRecentActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [greeting, setGreeting] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsData, activitiesData] = await Promise.all([
                    apiService.getDashboardStats(),
                    apiService.getRecentActivities()
                ]);

                setStats(statsData);
                setRecentActivities(activitiesData);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Load current user for greeting
        const fetchMe = async () => {
            try {
                const me = await apiService.getMe();
                const name = me?.name || me?.username || 'Admin';
                setGreeting(`Welcome, ${name}`);
            } catch {}
        };
        fetchMe();
    }, []);

    const formatTime = (timeString) => {
        if (!timeString) return 'Unknown time';
        
        const time = new Date(timeString);
        const now = new Date();
        const diffInMinutes = Math.floor((now - time) / (1000 * 60));
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);
        
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInHours < 24) return `${diffInHours}h ago`;
        if (diffInDays < 7) return `${diffInDays}d ago`;
        
        // For older dates, show actual date
        return time.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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
                    <h2 className="mb-1">Admin Dashboard</h2>
                    {greeting && <p className="text-muted mb-0">{greeting}</p>}
                </div>
                <Link to="/admin/contents" className="btn btn-primary">
                    <i className="fas fa-plus me-2"></i>Update Web Content
                </Link>
            </div>

            {/* Stats Cards */}
            <Row className="mb-4">
                <Col md={4}>
                    <Card className="text-center h-100">
                        <Card.Body>
                            <i className="fas fa-user-md fa-2x text-primary mb-2"></i>
                            <h3 className="text-primary">{stats.total_doctors}</h3>
                            <p className="text-muted mb-0">Total Doctors</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center h-100">
                        <Card.Body>
                            <i className="fas fa-users fa-2x text-success mb-2"></i>
                            <h3 className="text-success">{stats.total_patients}</h3>
                            <p className="text-muted mb-0">Total Patients</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center h-100">
                        <Card.Body>
                            <i className="fas fa-calendar-day fa-2x text-warning mb-2"></i>
                            <h3 className="text-warning">{stats.today_appointments}</h3>
                            <p className="text-muted mb-0">Today's Appointments</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                {/* Recent Activities */}
                <Col className="mb-4">
                    <Card className="h-100">
                        <Card.Header className="d-flex align-items-center">
                            <i className="fas fa-history me-2 text-primary"></i>
                            <h5 className="mb-0">🛎️ Recent Activities</h5>
                        </Card.Header>
                        <Card.Body className="p-0">
                            {recentActivities.length > 0 ? (
                                <ListGroup variant="flush">
                                    {recentActivities.map((activity, index) => (
                                        <ListGroup.Item key={index} className="d-flex align-items-start">
                                            <div className={`me-3 mt-1 text-${activity.color}`}>
                                                <i className={activity.icon}></i>
                                            </div>
                                            <div className="flex-grow-1">
                                                <p className="mb-1">{activity.message}</p>
                                                <small className="text-muted">{formatTime(activity.time)}</small>
                                            </div>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            ) : (
                                <div className="text-center py-4 text-muted">
                                    <i className="fas fa-inbox fa-2x mb-2"></i>
                                    <p>No recent activities</p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Quick Access Buttons */}
            <Row className="mt-3">
                <Col>
                    <Card>
                        <Card.Header className="py-2">
                            <h5 className="mb-0">➕ Quick Access</h5>
                        </Card.Header>
                        <Card.Body className="py-3">
                            <div className="d-flex flex-wrap gap-2 justify-content-center">
                                <Link to="/admin/contents" className="btn btn-outline-primary">
                                    <i className="fas fa-file-medical me-2"></i>Update Web Content
                                </Link>
                                <Link to="/admin/doctors" className="btn btn-outline-success">
                                    <i className="fas fa-user-md me-2"></i>Manage Doctors
                                </Link>
                                <Link to="/admin/patients" className="btn btn-outline-info">
                                    <i className="fas fa-users me-2"></i>Manage Patients
                                </Link>
                                <Link to="/admin/cities" className="btn btn-outline-secondary">
                                    <i className="fas fa-city me-2"></i>Manage Cities
                                </Link>
                                <Link to="/admin/contact-messages" className="btn btn-outline-warning">
                                    <i className="fas fa-envelope me-2"></i>View Messages
                                </Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default AdminDashboard;


