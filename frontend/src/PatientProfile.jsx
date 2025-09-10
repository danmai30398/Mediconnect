import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Row, Col, Button, Badge, Container, Modal, Form, Alert } from "react-bootstrap";
import "./Doctors.css";

// Cấu hình URL API - sử dụng localhost nếu không có biến môi trường
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000";

/**
 * Component PatientProfile - Quản lý hồ sơ y tế cá nhân của bệnh nhân
 * Cho phép xem và chỉnh sửa thông tin y tế, upload ảnh đại diện
 * Tích hợp với cả bảng patients và medi_users
 */
function PatientProfile() {
    // Lấy thông tin user từ localStorage
    const user = JSON.parse(localStorage.getItem('MediUser'));
    const id = user?.id;

        const [profile, setProfile] = useState({
            username: '',
            patient: {
                name: '',
                phone: '',
                email: '',
                address: '',
                dob: '',
                gender:'',
                image:''
            }
        });

    const [showEditModal, setShowEditModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        dob: '',
        gender: ''
    });
    const [passwordForm, setPasswordForm] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    });
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    
        useEffect(() => {
        const token = localStorage.getItem('MediToken') || '';
        const url = `${API_BASE_URL}/api/me`;
        fetch(url, { headers: token ? { 'Authorization': `Bearer ${token}` } : {} })
                .then(res => res.json())
            .then(data => {
                setProfile(data);
                // Initialize edit form with current data
                setEditForm({
                    name: data.patient?.name || '',
                    phone: data.patient?.phone || '',
                    email: data.patient?.email || '',
                    address: data.patient?.address || '',
                    dob: data.patient?.dob || '',
                    gender: data.patient?.gender || ''
                });
            })
                .catch(err => console.error("Fetch error:", err));
    }, []);

    const handleEditClick = () => {
        setShowEditModal(true);
    };

    const handlePasswordClick = () => {
        setShowPasswordModal(true);
        setPasswordForm({
            current_password: '',
            new_password: '',
            confirm_password: ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageClick = () => {
        document.getElementById('imageInput').click();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                setAlert({ show: true, message: 'File size must be less than 10MB', type: 'danger' });
                setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
                return;
            }
            
            // Check file type
            if (!file.type.startsWith('image/')) {
                setAlert({ show: true, message: 'Please select an image file', type: 'danger' });
                setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
                return;
            }

            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageUpload = async () => {
        if (!imageFile) return;

        setLoading(true);
        try {
            const token = localStorage.getItem('MediToken') || '';
            const formData = new FormData();
            formData.append('image', imageFile);

            const response = await fetch(`${API_BASE_URL}/api/patients/${profile.patient.id}/upload-image`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                body: formData
            });

            const responseData = await response.json();

            if (response.ok) {
                setProfile(prev => ({
                    ...prev,
                    patient: { ...prev.patient, image: responseData.image }
                }));
                setImageFile(null);
                setImagePreview(null);
                setAlert({ show: true, message: 'Profile image updated successfully!', type: 'success' });
                setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
            } else {
                setAlert({ show: true, message: responseData.error || 'Failed to upload image', type: 'danger' });
                setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
            }
        } catch (error) {
            console.error('Image upload error:', error);
            setAlert({ show: true, message: 'Error uploading image', type: 'danger' });
            setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('MediToken') || '';
            
            const response = await fetch(`${API_BASE_URL}/api/patients/${profile.patient.id}/profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(editForm)
            });

            const responseData = await response.json();

            if (response.ok) {
                // Reload profile data from server to get updated information
                const reloadResponse = await fetch(`${API_BASE_URL}/api/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (reloadResponse.ok) {
                    const updatedProfile = await reloadResponse.json();
                    setProfile(updatedProfile);
                    // Update edit form with new data
                    setEditForm({
                        name: updatedProfile.patient?.name || '',
                        phone: updatedProfile.patient?.phone || '',
                        email: updatedProfile.patient?.email || '',
                        address: updatedProfile.patient?.address || '',
                        dob: updatedProfile.patient?.dob || '',
                        gender: updatedProfile.patient?.gender || ''
                    });
                }
                setShowEditModal(false);
                setAlert({ show: true, message: 'Profile updated successfully!', type: 'success' });
                setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
            } else {
                setAlert({ show: true, message: responseData.error || 'Failed to update profile', type: 'danger' });
                setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
            }
        } catch (error) {
            console.error('Update error:', error);
            setAlert({ show: true, message: 'Error updating profile', type: 'danger' });
            setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSave = async () => {
        // Validate passwords
        if (passwordForm.new_password !== passwordForm.confirm_password) {
            setAlert({ show: true, message: 'New passwords do not match', type: 'danger' });
            setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
            return;
        }

        if (passwordForm.new_password.length < 6) {
            setAlert({ show: true, message: 'New password must be at least 6 characters', type: 'danger' });
            setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('MediToken') || '';
            const response = await fetch(`${API_BASE_URL}/api/change-password`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    current_password: passwordForm.current_password,
                    new_password: passwordForm.new_password
                })
            });

            const responseData = await response.json();

            if (response.ok) {
                setShowPasswordModal(false);
                setAlert({ show: true, message: 'Password changed successfully!', type: 'success' });
                setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
            } else {
                setAlert({ show: true, message: responseData.error || 'Failed to change password', type: 'danger' });
                setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
            }
        } catch (error) {
            console.error('Password change error:', error);
            setAlert({ show: true, message: 'Error changing password', type: 'danger' });
            setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid py-4 px-4" style={{ marginTop: '80px' }}>
            {alert.show && (
                <Alert variant={alert.type} className="position-fixed" style={{ top: '100px', right: '20px', zIndex: 9999 }}>
                    {alert.message}
                </Alert>
            )}
            
            <Row className="justify-content-center">
                <Col lg={8} md={10}>
                    {/* Profile Header Card */}
                    <Card className="border-0 shadow-sm mb-4">
                        <Card.Body className="text-center p-5">
                            <div className="position-relative d-inline-block mb-4">
                                <img
                                    src={imagePreview || (profile.patient.image ? `${API_BASE_URL}/storage/patient-images/${profile.patient.image}` : `${process.env.PUBLIC_URL}/Images/Patients/Unknown_person.jpg`)}
                                    className="rounded-circle border border-4 border-white shadow"
                                    style={{ width: "150px", height: "150px", objectFit: "cover", cursor: "pointer" }}
                                    alt="Profile"
                                    onClick={handleImageClick}
                                />
                                <div className="position-absolute bottom-0 end-0">
                                    <Button 
                                        size="sm" 
                                        variant="primary" 
                    className="rounded-circle"
                                        style={{ width: "40px", height: "40px" }}
                                        onClick={handleImageClick}
                                    >
                                        <i className="fas fa-camera"></i>
                                    </Button>
                                </div>
                                <input
                                    id="imageInput"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                />
                            </div>
                            {imageFile && (
                                <div className="mb-3">
                                    <Button 
                                        variant="success" 
                                        size="sm" 
                                        onClick={handleImageUpload}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-upload me-2"></i>
                                                Upload Image
                                            </>
                                        )}
                                    </Button>
                                    <Button 
                                        variant="outline-secondary" 
                                        size="sm" 
                                        className="ms-2"
                                        onClick={() => {
                                            setImageFile(null);
                                            setImagePreview(null);
                                        }}
                                    >
                                        <i className="fas fa-times me-2"></i>
                                        Cancel
                                    </Button>
                                </div>
                            )}
                            <h2 className="fw-bold mb-2">Hello, {profile.username}!</h2>
                            <p className="text-muted mb-4">Welcome to your personal profile</p>
                            <Badge bg="success" className="px-3 py-2">
                                <i className="fas fa-user-check me-1"></i>
                                Patient Account
                            </Badge>
                        </Card.Body>
                    </Card>

                    {/* Profile Information Card */}
                    <Card className="border-0 shadow-sm mb-4">
                        <Card.Header className="bg-light border-bottom py-3">
                            <h5 className="mb-0 fw-bold">
                                <i className="fas fa-user me-2 text-primary"></i>
                                Personal Information
                            </h5>
                        </Card.Header>
                        <Card.Body className="p-4">
                            <Row className="g-4">
                                <Col md={6}>
                                    <div className="d-flex align-items-center p-3 bg-light rounded">
                                        <div className="me-3">
                                            <i className="fas fa-user text-primary fa-lg"></i>
                                        </div>
                                        <div>
                                            <small className="text-muted d-block">Full Name</small>
                                            <h6 className="mb-0 fw-bold">{profile.patient.name || 'Not provided'}</h6>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="d-flex align-items-center p-3 bg-light rounded">
                                        <div className="me-3">
                                            <i className="fas fa-envelope text-primary fa-lg"></i>
                                        </div>
                                        <div>
                                            <small className="text-muted d-block">Email Address</small>
                                            <h6 className="mb-0 fw-bold">{profile.patient.email || 'Not provided'}</h6>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="d-flex align-items-center p-3 bg-light rounded">
                                        <div className="me-3">
                                            <i className="fas fa-phone text-primary fa-lg"></i>
            </div>
            <div>
                                            <small className="text-muted d-block">Phone Number</small>
                                            <h6 className="mb-0 fw-bold">{profile.patient.phone || 'Not provided'}</h6>
                                        </div>
                </div>
                                </Col>
                                <Col md={6}>
                                    <div className="d-flex align-items-center p-3 bg-light rounded">
                                        <div className="me-3">
                                            <i className="fas fa-venus-mars text-primary fa-lg"></i>
                </div>
                                        <div>
                                            <small className="text-muted d-block">Gender</small>
                                            <h6 className="mb-0 fw-bold">{profile.patient.gender || 'Not provided'}</h6>
                </div>
                </div>
                                </Col>
                                <Col md={6}>
                                    <div className="d-flex align-items-center p-3 bg-light rounded">
                                        <div className="me-3">
                                            <i className="fas fa-birthday-cake text-primary fa-lg"></i>
                </div>
                                        <div>
                                            <small className="text-muted d-block">Date of Birth</small>
                                            <h6 className="mb-0 fw-bold">{profile.patient.dob || 'Not provided'}</h6>
                </div>
            </div>
                                </Col>
                                <Col md={6}>
                                    <div className="d-flex align-items-center p-3 bg-light rounded">
                                        <div className="me-3">
                                            <i className="fas fa-map-marker-alt text-primary fa-lg"></i>
                                        </div>
                                        <div>
                                            <small className="text-muted d-block">Address</small>
                                            <h6 className="mb-0 fw-bold">{profile.patient.address || 'Not provided'}</h6>
                                        </div>
        </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    {/* Action Buttons */}
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="p-4">
                            <Row className="g-3">
                                <Col md={6}>
                                    <Button variant="primary" size="lg" className="w-100 py-3" onClick={handleEditClick}>
                                        <i className="fas fa-edit me-2"></i>
                                        Edit Profile
                                    </Button>
                                </Col>
                                <Col md={6}>
                                    <Button variant="outline-secondary" size="lg" className="w-100 py-3" onClick={handlePasswordClick}>
                                        <i className="fas fa-key me-2"></i>
                                        Change Password
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Edit Profile Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <i className="fas fa-edit me-2"></i>
                        Edit Profile
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row className="g-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Full Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={editForm.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter your full name"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Email Address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={editForm.email}
                                        onChange={handleInputChange}
                                        placeholder="Enter your email"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Phone Number</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        name="phone"
                                        value={editForm.phone}
                                        onChange={handleInputChange}
                                        placeholder="Enter your phone number"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Gender</Form.Label>
                                    <Form.Select
                                        name="gender"
                                        value={editForm.gender}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Date of Birth</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="dob"
                                        value={editForm.dob}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="address"
                                        value={editForm.address}
                                        onChange={handleInputChange}
                                        placeholder="Enter your address"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSave} disabled={loading}>
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Saving...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-save me-2"></i>
                                Save Changes
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Change Password Modal */}
            <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <i className="fas fa-key me-2"></i>
                        Change Password
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Current Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="current_password"
                                value={passwordForm.current_password}
                                onChange={handlePasswordChange}
                                placeholder="Enter current password"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="new_password"
                                value={passwordForm.new_password}
                                onChange={handlePasswordChange}
                                placeholder="Enter new password"
                            />
                            <Form.Text className="text-muted">
                                Password must be at least 6 characters long.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Confirm New Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="confirm_password"
                                value={passwordForm.confirm_password}
                                onChange={handlePasswordChange}
                                placeholder="Confirm new password"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handlePasswordSave} disabled={loading}>
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Changing...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-save me-2"></i>
                                Change Password
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default PatientProfile;
