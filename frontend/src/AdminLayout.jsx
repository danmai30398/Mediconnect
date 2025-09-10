import React, { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import NotificationBell from "./NotificationBell";
import { apiService } from "./services/apiService";

function AdminLayout() {
    const navigate = useNavigate();
    
    // Check if user is admin
    useEffect(() => {
        try {
            const raw = localStorage.getItem('MediUser');
            if (!raw) {
                navigate('/login');
                return;
            }
            const user = JSON.parse(raw);
            
            if (Number(user.role_id) !== 1) {
                // Not admin, redirect based on role
                if (Number(user.role_id) === 2) {
                    navigate('/doctor/dashboard');
                } else if (Number(user.role_id) === 3) {
                    navigate('/patient/dashboard');
                } else {
                    navigate('/login');
                }
            } else {
            }
        } catch (error) {
            navigate('/login');
        }
    }, [navigate]);
    const logout = async () => {
        try {
            await apiService.logout();
        } catch {}
        localStorage.removeItem('MediUser');
        localStorage.removeItem('MediToken');
        navigate('/login');
    };

    return (
        <div>
            <Navbar variant="light" expand="lg" className='fixed-top navCustom' style={{ backgroundColor: '#13b5e0' }}>
                <Container fluid className="px-4">
                    {/* Logo on the left */}
                    <Navbar.Brand className='fw-bold text-white' href="#home">MediConnect Admin</Navbar.Brand>

                    {/* Toggle for responsive */}
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />

                    {/* Menu and User Info */}
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <NavLink to="/admin/dashboard" className="nav-link text-white">
                                Dashboard
                            </NavLink>
                            <NavLink to="/admin/users" className="nav-link text-white">
                                Users
                            </NavLink>
                            <NavLink to="/admin/contents" className="nav-link text-white">
                                Medical Content
                            </NavLink>
                            <NavLink to="/admin/contact-messages" className="nav-link text-white">
                                Contact Messages
                            </NavLink>
                            <NavLink to="/admin/doctors" className="nav-link text-white">
                                Doctors
                            </NavLink>
                            <NavLink to="/admin/patients" className="nav-link text-white">
                                Patients
                            </NavLink>
                            <NavLink to="/admin/cities" className="nav-link text-white">
                                Cities
                            </NavLink>
                        </Nav>
                        <Nav className="ms-auto d-flex align-items-center gap-3">
                            <NotificationBell />
                            <span className="text-white">Welcome, Admin</span>
                            <button className="btn btn-outline-light btn-sm" onClick={logout}>Logout</button>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <main>
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;


