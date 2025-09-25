import React, { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import { apiService } from "./services/apiService";

/**
 * Component AdminUsers - Quản lý tài khoản người dùng trong hệ thống y tế
 * Xử lý cả bảng MediUsers và Laravel Users
 * Tính năng: Tạo, xem, sửa tài khoản bác sĩ và bệnh nhân
 */
function AdminUsers() {
    // Quản lý state cho dữ liệu component
    const [items, setItems] = useState([]); // Danh sách tất cả users từ API
    const [form, setForm] = useState({ 
        id: null, username: "", password: "", role_id: 3, email: "", name: "",
        is_active: true, source: "medi_users", // Mặc định sử dụng bảng medi_users
        phone: "", address: "", city_id: "", gender: "", dob: ""
    });
    const [cities, setCities] = useState([]); // Danh sách thành phố
    const [show, setShow] = useState(false); // Trạng thái hiển thị modal
    const [saving, setSaving] = useState(false); // Trạng thái loading khi lưu
    const [notice, setNotice] = useState(""); // Thông báo toast
    const [showToast, setShowToast] = useState(false); // Trạng thái hiển thị toast

    /**
     * Tải dữ liệu users từ API
     * Lấy cả MediUsers và Laravel Users, kết hợp để hiển thị
     */
    const load = async () => {
        try {
            // Sử dụng apiService để lấy danh sách users
            const data = await apiService.getUsers();
            setItems(data);
        } catch (e) { 
            // Xử lý lỗi mạng một cách graceful
            console.error('Error loading users:', e);
            setItems([]); 
        }
    };

    /**
     * Tải danh sách thành phố từ API
     */
    const loadCities = async () => {
        try {
            const data = await apiService.getCities();
            setCities(data);
        } catch (e) {
            console.error('Error loading cities:', e);
            setCities([]);
        }
    };

    // Tải dữ liệu khi component mount
    useEffect(() => { 
        load(); 
        loadCities(); 
    }, []);

    /**
     * Xử lý submit form để tạo/cập nhật users
     * Validate dữ liệu đầu vào và gửi request API phù hợp
     */
    const submit = async (e) => {
        e.preventDefault();
        
        // Validate phía client trước khi gọi API
        if (!form.username || !form.username.trim()) {
            setNotice('Username is required');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            return;
        }
        if (!form.email || !form.email.trim()) {
            setNotice('Email is required');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            return;
        }
        if (!form.name || !form.name.trim()) {
            setNotice('Full name is required');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            return;
        }
        // Mật khẩu chỉ bắt buộc cho user mới (không có ID nghĩa là user mới)
        if (!form.id && (!form.password || typeof form.password !== 'string' || !form.password.trim())) {
            setNotice('Password is required for new user');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            return;
        }
        
        setSaving(true);
        let payload;
        
        // Tạo payload khác nhau tùy theo loại user (Laravel users vs MediUsers)
        if (form.source === 'users') {
            // Bảng Laravel users cần email/password/role_id/is_active ở cấp cao nhất
            payload = {
                source: 'users', // Thêm source parameter
                email: form.email,
                role_id: form.role_id ? Number(form.role_id) : undefined,
                is_active: form.is_active !== undefined ? !!form.is_active : undefined,
            };
            // Chỉ thêm password nếu có và không rỗng
            if (form.password && typeof form.password === 'string' && form.password.trim() !== '') {
                payload.password = form.password;
            }
        } else {
            // Bảng MediUsers cần username, role_id, email, name, is_active + profile data
            payload = {
                source: 'medi_users', // Thêm source parameter
                username: form.username,
                role_id: Number(form.role_id),
                email: form.email,
                name: form.name,
                is_active: form.is_active !== undefined ? !!form.is_active : undefined,
                phone: form.phone,
                gender: form.gender,
                dob: form.dob,
                city_id: form.city_id,
                address: form.address,
            };
            // Chỉ thêm password nếu có và không rỗng
            if (form.password && typeof form.password === 'string' && form.password.trim() !== '') {
                payload.password = form.password;
            }
        }
        
        // Xác định đây là edit hay create dựa trên có ID hay không
        const isEdit = !!form.id;
        
        // Sử dụng apiService thay vì fetch trực tiếp
        try {
            let response;
            if (isEdit) {
                response = await apiService.updateUser(form.id, payload);
            } else {
                response = await apiService.createUser(payload);
            }
            
            if (response.ok) { 
                setForm({ 
                    username: "", password: "", role_id: 3, name: "", email: "", phone: "", address: "", 
                    is_active: true, source: "medi_users"
                }); 
                setShow(false); 
                setNotice(isEdit ? 'User updated successfully' : 'User created successfully'); 
                setShowToast(true); 
                setTimeout(() => setShowToast(false), 3000);
                load(); 
            } else {
                const errorData = await response.json();
                setNotice(errorData.message || 'An error occurred');
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
            }
        } catch (error) {
            console.error('Error saving user:', error);
            setNotice('An error occurred');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        } finally {
            setSaving(false);
        }
    };

    const createProfile = async (userId, roleId) => {
        const profileData = {
            name: prompt('Enter full name:'),
            phone: prompt('Enter phone number (optional):') || '',
            address: prompt('Enter address (optional):') || '',
            gender: prompt('Enter gender (Male/Female/Other, optional):') || 'Other',
            dob: prompt('Enter date of birth (YYYY-MM-DD, optional):') || new Date().toISOString().split('T')[0],
        };

        if (!profileData.name) {
            setNotice('Name is required');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            return;
        }

        try {
            const response = await apiService.createUserProfile(userId, profileData);

            if (response.ok) {
                setNotice('Profile created successfully');
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
                load();
            } else {
                setNotice('Profile creation failed');
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
            }
        } catch (error) {
            console.error('Create profile error:', error);
            setNotice('Profile creation failed');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }
    };

    return (
        <div className="container-fluid py-4 px-4" style={{ marginTop: '80px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="m-0 text-primary">User Management</h2>
                <Button onClick={() => {
                    setForm({ 
                        id: null, username: "", password: "", role_id: 3, email: "", name: "",
                        is_active: true, source: "medi_users", phone: "", address: "", 
                        city_id: "", gender: "", dob: ""
                    });
                    setShow(true);
                }}>+ Create User</Button>
            </div>
            <ToastContainer position="bottom-end" className="p-3">
                <Toast bg="success" onClose={() => setShowToast(false)} show={showToast} delay={2500} autohide>
                    <Toast.Body className="text-white">{notice}</Toast.Body>
                </Toast>
            </ToastContainer>
            <Modal show={show} onHide={() => {
                setShow(false);
                setForm({ 
                username: "", password: "", role_id: 3, name: "", email: "", phone: "", address: "", 
                is_active: true, source: "medi_users", city_id: "", gender: "", dob: ""
            });
            }}>
                <Modal.Header closeButton><Modal.Title>{form.id ? 'Edit User' : 'Create User'}</Modal.Title></Modal.Header>
                <form onSubmit={submit}>
                <Modal.Body>
                    <div className="mb-2"><input className="form-control" placeholder="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required /></div>
                    <div className="mb-2"><input className="form-control" placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required={!form.id} /></div>
                    <div className="mb-2"><input className="form-control" placeholder="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></div>
                    <div className="mb-2"><input className="form-control" placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
                    <div className="mb-2">
                        <select 
                            className="form-select" 
                            value={form.role_id} 
                            onChange={e => setForm({ ...form, role_id: e.target.value })}
                            disabled={!!form.id}
                        >
                            <option value="">-- Select Role --</option>
                            <option value={1}>Admin</option>
                            <option value={2}>Doctor</option>
                            <option value={3}>Patient</option>
                        </select>
                        {form.id && (
                            <div className="form-text text-muted">
                                <i className="fas fa-lock me-1"></i>
                                Role cannot be changed when editing
                            </div>
                        )}
                    </div>
                    <div className="mb-2">
                        <select className="form-select" value={form.is_active ? 'enable' : 'disable'} onChange={e => setForm({ ...form, is_active: e.target.value === 'enable' })}>
                            <option value="enable">Enable</option>
                            <option value="disable">Disable</option>
                        </select>
                    </div>
                    
                    {/* Profile Information - chỉ hiển thị cho Doctor và Patient */}
                    {form.role_id && (form.role_id == 2 || form.role_id == 3) && (
                        <>
                            <hr />
                            <h6 className="text-primary">Profile Information</h6>
                            <div className="mb-2">
                                <label className="form-label">Phone Number</label>
                                <input className="form-control" placeholder="Phone Number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Gender</label>
                                <select className="form-select" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                                    <option value="">-- Select Gender --</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Date of Birth</label>
                                <input className="form-control" type="date" placeholder="Date of Birth" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} />
                            </div>
                            
                            {/* Doctor: City dropdown */}
                            {form.role_id == 2 && (
                                <div className="mb-2">
                                    <label className="form-label">City</label>
                                    <select className="form-select" value={form.city_id} onChange={e => setForm({ ...form, city_id: e.target.value })}>
                                        <option value="">-- Select City --</option>
                                        {cities.map(city => (
                                            <option key={city.city_id} value={city.city_id}>{city.city_name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            
                            {/* Patient: Address field */}
                            {form.role_id == 3 && (
                                <div className="mb-2">
                                    <label className="form-label">Address</label>
                                    <input className="form-control" placeholder="Enter detailed address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
                                </div>
                            )}
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        setShow(false);
                        setForm({ 
                            id: null, username: "", password: "", role_id: 3, name: "", email: "", phone: "", address: "", 
                            is_active: true, source: "medi_users", city_id: "", gender: "", dob: ""
                        });
                    }}>Close</Button>
                    <Button variant="primary" type="submit" disabled={saving}>{saving ? 'Saving...' : (form.id ? 'Update' : 'Create')}</Button>
                </Modal.Footer>
                </form>
            </Modal>
            <div className="table-responsive">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Source</th>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Address</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(items) && items.map((u, idx) => (
                            <tr key={(u.user_id || u.id || idx) + (u.source || '')}>
                                <td>{u.source}</td>
                                <td>{u.user_id || u.id}</td>
                                <td>{u.username}</td>
                                <td>{u.name}</td>
                                <td>{u.email}</td>
                                <td>{u.role_label || u.role_id || '-'}</td>
                                <td>
                                    {u.role_id == 2 ? (u.city_name || '-') : (u.address || '-')}
                                </td>
                                <td>{u.is_active ? 'Enable' : 'Disable'}</td>
                                <td>
                                    <div className="btn-group">
                                        {u.source === 'medi_users' && (
                                            <>
                                                <Button 
                                                    size="sm" 
                                                    variant="primary"
                                                    onClick={() => { 
                                                        setShow(true); 
                                                        const formData = { 
                                                            id: u.user_id, 
                                                            source: 'medi_users', 
                                                            username: u.username, 
                                                            password: '', 
                                                            role_id: u.role_id, 
                                                            name: u.name || '', 
                                                            email: u.email || '', 
                                                            phone: u.phone || '', 
                                                            address: u.address || '', 
                                                            city_id: u.city_id || '',
                                                            gender: u.gender || '',
                                                            dob: u.dob || '',
                                                            is_active: u.is_active !== undefined ? u.is_active : true 
                                                        };
                                                        setForm(formData); 
                                                        setSaving(false); 
                                                    }}
                                                >
                                                    Edit
                                                </Button>
                                                {!u.name && (
                                                    <Button 
                                                        size="sm" 
                                                        variant="success" 
                                                        onClick={() => createProfile(u.user_id, u.role_id)}
                                                    >
                                                        Create Profile
                                                    </Button>
                                                )}
                                                <Button 
                                                    size="sm" 
                                                    variant={u.locked_until ? "danger" : "secondary"}
                                                    disabled={!u.locked_until}
                                                    onClick={async () => {
                                                        if (u.locked_until) {
                                                            try {
                                                                const res = await apiService.unlockUser(u.user_id);
                                                                if (res.ok) { 
                                                                    setNotice('Unlock successful'); 
                                                                    setShowToast(true); 
                                                                    load(); 
                                                                }
                                                            } catch (error) {
                                                                console.error('Error unlocking user:', error);
                                                                setNotice('Error unlocking user');
                                                                setShowToast(true);
                                                            }
                                                        }
                                                    }}
                                                >
                                                    {u.locked_until ? 'Unlock' : 'Unlocked'}
                                                </Button>
                                            </>
                                        )}
                                        {u.source === 'users' && (
                                            <Button 
                                                size="sm" 
                                                variant="secondary" 
                                                onClick={() => { setShow(true); setForm({ id: u.id, source: 'users', username: u.username, password: '', role_id: u.role_id || '', name: u.name || '', email: u.email || '', phone: '', address: '', is_active: u.is_active !== undefined ? u.is_active : true }); setSaving(false); }}
                                            >
                                                Edit
                                            </Button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminUsers;


