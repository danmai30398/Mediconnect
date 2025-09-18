import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Badge, Container, Modal, Form, Alert } from "react-bootstrap";
import { apiService } from "./services/apiService";
import "./Doctors.css";

// Cấu hình URL API - sử dụng localhost nếu không có biến môi trường
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000";

/**
 * Component DoctorProfile - Quản lý hồ sơ bác sĩ
 * Cho phép xem và chỉnh sửa thông tin bác sĩ, upload ảnh đại diện
 */
function DoctorProfile() {
    // State quản lý dữ liệu component
    const [profile, setProfile] = useState({
        username: '',
        doctor: {
            name: '',
            phone: '',
            email: '',
            specialization: '',
            experience: '',
            qualification: '',
            gender: '',
            dob: '',
            image: '',
            description: '',
            city: null
        }
    });

    const [showEditModal, setShowEditModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        phone: '',
        email: '',
        specialization: '',
        experience: '',
        qualification: '',
        gender: '',
        dob: '',
        description: ''
    });
    const [passwordForm, setPasswordForm] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    });
    const [loading, setLoading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(true);
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [cities, setCities] = useState([]);

    // Load profile data và cities
    useEffect(() => {
        loadProfile();
        loadCities();
    }, []);

    const loadProfile = async () => {
        try {
            setProfileLoading(true);
            console.log('Loading profile...');
            // Sử dụng apiService để lấy thông tin profile
            const data = await apiService.getMe();
            console.log('Profile data received:', data);
            
            setProfile(data);
            
            // Check if doctor data exists
            if (!data.doctor) {
                console.error('No doctor data found!');
                setAlert({ show: true, message: 'No doctor profile found. Please contact administrator.', type: 'danger' });
                setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
                return;
            }
            
            if (!data.doctor.id) {
                console.error('Doctor ID is missing!');
                setAlert({ show: true, message: 'Doctor ID is missing. Please contact administrator.', type: 'danger' });
                setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
                return;
            }
            
            // Initialize edit form with current data
            setEditForm({
                name: data.doctor?.name || '',
                phone: data.doctor?.phone || '',
                email: data.doctor?.email || '',
                specialization: data.doctor?.specialization || '',
                experience: data.doctor?.experience || '',
                qualification: data.doctor?.qualification || '',
                gender: data.doctor?.gender || '',
                dob: data.doctor?.dob || '',
                description: data.doctor?.description || ''
            });
            
            console.log('Profile loaded successfully!');
        } catch (err) {
            console.error("Fetch error:", err);
            setAlert({ show: true, message: 'Failed to load profile: ' + err.message, type: 'danger' });
            setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
        } finally {
            setProfileLoading(false);
        }
    };

    const loadCities = async () => {
        try {
            const data = await apiService.getCities();
            setCities(data);
        } catch (err) {
            console.error("Error loading cities:", err);
        }
    };

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
            const formData = new FormData();
            formData.append('image', imageFile);

            // Debug logging
            console.log('Uploading doctor image:', {
                doctorId: profile.doctor.id,
                fileName: imageFile.name,
                fileSize: imageFile.size,
                fileType: imageFile.type
            });

            // Sử dụng apiService để upload ảnh
            const response = await apiService.uploadDoctorImage(profile.doctor.id, formData);
            const responseData = await response.json();
            
            console.log('Upload response:', {
                status: response.status,
                ok: response.ok,
                data: responseData
            });

            if (response.ok) {
                setProfile(prev => ({
                    ...prev,
                    doctor: { ...prev.doctor, image: responseData.image }
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
        if (profileLoading) {
            setAlert({ show: true, message: 'Profile is still loading, please wait...', type: 'warning' });
            setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
            return;
        }

        if (!profile.doctor || !profile.doctor.id) {
            setAlert({ show: true, message: 'Doctor profile not loaded yet. Please refresh the page.', type: 'danger' });
            setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
            return;
        }

        setLoading(true);
        try {
            // Ensure all fields are properly formatted
            const updateData = {
                name: editForm.name || '',
                email: editForm.email || '',
                phone: editForm.phone || '',
                specialization: editForm.specialization || '',
                experience: editForm.experience ? parseInt(editForm.experience) : 0,
                qualification: editForm.qualification || '',
                gender: editForm.gender || '',
                dob: editForm.dob || '',
                description: editForm.description || ''
            };
            
            // Sử dụng apiService để cập nhật profile
            const response = await apiService.updateDoctor(profile.doctor.id, updateData);
            const responseData = await response.json();

            if (response.ok) {
                // Reload profile data from server to get updated information
                const updatedProfile = await apiService.getMe();
                setProfile(updatedProfile);
                // Update edit form with new data
                setEditForm({
                    name: updatedProfile.doctor?.name || '',
                    phone: updatedProfile.doctor?.phone || '',
                    email: updatedProfile.doctor?.email || '',
                    specialization: updatedProfile.doctor?.specialization || '',
                    experience: updatedProfile.doctor?.experience || '',
                    qualification: updatedProfile.doctor?.qualification || '',
                    gender: updatedProfile.doctor?.gender || '',
                    dob: updatedProfile.doctor?.dob || '',
                    description: updatedProfile.doctor?.description || ''
                });
                setShowEditModal(false);
                setAlert({ show: true, message: 'Profile updated successfully!', type: 'success' });
                setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
            } else {
                console.error('Update failed:', responseData);
                setAlert({ show: true, message: responseData.error || responseData.message || 'Failed to update profile', type: 'danger' });
                setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
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
            // Sử dụng apiService để đổi mật khẩu
            const response = await apiService.changePassword({
                current_password: passwordForm.current_password,
                new_password: passwordForm.new_password
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

    // Show loading spinner while profile is loading
    if (profileLoading) {
        return (
            <div className="container-fluid py-4 px-4" style={{ marginTop: '80px' }}>
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                    <div className="text-center">
                        <div className="spinner-border text-primary mb-3" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <h5>Loading profile...</h5>
                        <p className="text-muted">Please wait while we load your profile information.</p>
                    </div>
                </div>
            </div>
        );
    }

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
                                    src={imagePreview || (profile.doctor.image ? `${API_BASE_URL}/storage/doctor-images/${profile.doctor.image}` : `${process.env.PUBLIC_URL}/Images/Doctors/Unknown_person.jpg`)}
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
                            <h2 className="fw-bold mb-2">Hello, Dr. {profile.doctor?.name || profile.username}!</h2>
                            <p className="text-muted mb-4">Welcome to your professional profile</p>
                            <div className="mb-3">
                                <Badge bg="info" className="px-3 py-2 me-2">
                                    <i className="fas fa-user-md me-1"></i>
                                    Doctor Account
                                </Badge>
                                {profile.doctor?.id && (
                                    <Badge bg="success" className="px-3 py-2">
                                        <i className="fas fa-check me-1"></i>
                                        Profile Loaded
                                    </Badge>
                                )}
                                {!profile.doctor?.id && (
                                    <Badge bg="warning" className="px-3 py-2">
                                        <i className="fas fa-exclamation-triangle me-1"></i>
                                        Profile Not Loaded
                                    </Badge>
                                )}
                            </div>
                        </Card.Body>
                    </Card>

                    {/* Profile Information Card */}
                    <Card className="border-0 shadow-sm mb-4">
                        <Card.Header className="bg-light border-bottom py-3">
                            <h5 className="mb-0 fw-bold">
                                <i className="fas fa-user-md me-2 text-primary"></i>
                                Professional Information
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
                                            <h6 className="mb-0 fw-bold">{profile.doctor.name || 'Not provided'}</h6>
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
                                            <h6 className="mb-0 fw-bold">{profile.doctor.email || 'Not provided'}</h6>
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
                                            <h6 className="mb-0 fw-bold">{profile.doctor.phone || 'Not provided'}</h6>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="d-flex align-items-center p-3 bg-light rounded">
                                        <div className="me-3">
                                            <i className="fas fa-stethoscope text-primary fa-lg"></i>
                                        </div>
                                        <div>
                                            <small className="text-muted d-block">Specialization</small>
                                            <h6 className="mb-0 fw-bold">{profile.doctor.specialization || 'Not provided'}</h6>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="d-flex align-items-center p-3 bg-light rounded">
                                        <div className="me-3">
                                            <i className="fas fa-graduation-cap text-primary fa-lg"></i>
                                        </div>
                                        <div>
                                            <small className="text-muted d-block">Qualification</small>
                                            <h6 className="mb-0 fw-bold">{profile.doctor.qualification || 'Not provided'}</h6>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="d-flex align-items-center p-3 bg-light rounded">
                                        <div className="me-3">
                                            <i className="fas fa-calendar-alt text-primary fa-lg"></i>
                                        </div>
                                        <div>
                                            <small className="text-muted d-block">Experience</small>
                                            <h6 className="mb-0 fw-bold">{profile.doctor.experience ? `${profile.doctor.experience} years` : 'Not provided'}</h6>
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
                                            <h6 className="mb-0 fw-bold">{profile.doctor.gender || 'Not provided'}</h6>
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
                                            <h6 className="mb-0 fw-bold">{profile.doctor.dob || 'Not provided'}</h6>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={12}>
                                    <div className="d-flex align-items-start p-3 bg-light rounded">
                                        <div className="me-3">
                                            <i className="fas fa-info-circle text-primary fa-lg"></i>
                                        </div>
                                        <div>
                                            <small className="text-muted d-block">Description</small>
                                            <p className="mb-0">{profile.doctor.description || 'No description provided'}</p>
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
                                    <Button 
                                        variant="primary" 
                                        size="lg" 
                                        className="w-100 py-3" 
                                        onClick={handleEditClick}
                                        disabled={!profile.doctor || !profile.doctor.id}
                                    >
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
                                    <Form.Label>Specialization</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="specialization"
                                        value={editForm.specialization}
                                        onChange={handleInputChange}
                                        placeholder="Enter your specialization"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Qualification</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="qualification"
                                        value={editForm.qualification}
                                        onChange={handleInputChange}
                                        placeholder="Enter your qualification"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Experience (years)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="experience"
                                        value={editForm.experience}
                                        onChange={handleInputChange}
                                        placeholder="Enter years of experience"
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
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="description"
                                        value={editForm.description}
                                        onChange={handleInputChange}
                                        placeholder="Enter your professional description"
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

export default DoctorProfile;
