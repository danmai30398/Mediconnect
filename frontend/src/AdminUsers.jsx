import React, { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import { apiService } from "./services/apiService";

/**
 * Component AdminUsers - Quản lý tài khoản người dùng trong hệ thống y tế
 * Xử lý cả bảng MediUsers và Laravel Users
 * Tính năng: Tạo, xem, sửa, xóa tài khoản bác sĩ và bệnh nhân
 */
function AdminUsers() {
    // Quản lý state cho dữ liệu component
    const [items, setItems] = useState([]); // Danh sách tất cả users từ API
    const [form, setForm] = useState({ 
        username: "", password: "", role_id: 3, email: "", name: "",
        is_active: true, source: "medi_users" // Mặc định sử dụng bảng medi_users
    });
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

    // Tải dữ liệu khi component mount
    useEffect(() => { load(); }, []);

    /**
     * Xử lý submit form để tạo/cập nhật users
     * Validate dữ liệu đầu vào và gửi request API phù hợp
     */
    const submit = async (e) => {
        e.preventDefault();
        
        // Validate phía client trước khi gọi API
        if (!form.username || !form.username.trim()) {
            setNotice('Tên đăng nhập là bắt buộc');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            return;
        }
        if (!form.email || !form.email.trim()) {
            setNotice('Email là bắt buộc');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            return;
        }
        if (!form.name || !form.name.trim()) {
            setNotice('Họ tên là bắt buộc');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            return;
        }
        // Mật khẩu chỉ bắt buộc cho user mới (không có ID nghĩa là user mới)
        if (!form.id && (!form.password || typeof form.password !== 'string' || !form.password.trim())) {
            setNotice('Mật khẩu là bắt buộc cho user mới');
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
            // Bảng MediUsers cần username, role_id, email, name, is_active
            payload = {
                source: 'medi_users', // Thêm source parameter
                username: form.username,
                role_id: Number(form.role_id),
                email: form.email,
                name: form.name,
                is_active: form.is_active !== undefined ? !!form.is_active : undefined,
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
                        username: "", password: "", role_id: 3, email: "", name: "",
                        is_active: true, source: "medi_users"
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
                is_active: true, source: "medi_users"
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
                        <select className="form-select" value={form.role_id} onChange={e => setForm({ ...form, role_id: e.target.value })}>
                            <option value={2}>Doctor</option>
                            <option value={3}>Patient</option>
                        </select>
                    </div>
                    <div className="mb-2">
                        <select className="form-select" value={form.is_active ? 'enable' : 'disable'} onChange={e => setForm({ ...form, is_active: e.target.value === 'enable' })}>
                            <option value="enable">Enable</option>
                            <option value="disable">Disable</option>
                        </select>
                    </div>
                    <hr />
                    {/* Thông tin y tế chi tiết sẽ được quản lý riêng trong Patient/Doctor Management */}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        setShow(false);
                        setForm({ 
                username: "", password: "", role_id: 3, name: "", email: "", phone: "", address: "", 
                is_active: true, source: "medi_users"
            });
                    }}>Close</Button>
                    <Button variant="primary" type="submit" disabled={saving}>{saving ? 'Saving...' : (form.id ? 'Update' : 'Create')}</Button>
                </Modal.Footer>
                </form>
            </Modal>
            <div className="table-responsive">
                <table className="table table-bordered">
                    <thead><tr><th>Source</th><th>ID</th><th>Username</th><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                        {Array.isArray(items) && items.map((u, idx) => (
                            <tr key={(u.user_id || u.id || idx) + (u.source || '')}>
                                <td>{u.source}</td>
                                <td>{u.user_id || u.id}</td>
                                <td>{u.username}</td>
                                <td>{u.name}</td>
                                <td>{u.email}</td>
                                <td>{u.role_label || u.role_id || '-'}</td>
                                <td>{u.is_active ? 'Enable' : 'Disable'}</td>
                                <td className="d-flex gap-2">
                                    {u.source === 'medi_users' && (
                                        <>
                                            <Button size="sm" onClick={() => { setShow(true); setForm({ id: u.user_id, source: 'medi_users', username: u.username, password: '', role_id: u.role_id, name: u.name || '', email: u.email || '', phone: u.phone || '', address: u.address || '', is_active: u.is_active !== undefined ? u.is_active : true }); setSaving(false); }}>Edit</Button>
                                            {!u.name && (
                                                <Button size="sm" variant="success" onClick={() => createProfile(u.user_id, u.role_id)}>Create Profile</Button>
                                            )}
                                        </>
                                    )}
                                    {u.source === 'users' && (
                                        <Button size="sm" variant="secondary" onClick={() => { setShow(true); setForm({ id: u.id, source: 'users', username: u.username, password: '', role_id: u.role_id || '', name: u.name || '', email: u.email || '', phone: '', address: '', is_active: u.is_active !== undefined ? u.is_active : true }); setSaving(false); }}>Edit</Button>
                                    )}
                                    {u.source === 'medi_users' && u.locked_until && (
                                        <Button size="sm" variant="warning" onClick={async () => {
                                            try {
                                                const res = await apiService.unlockUser(u.user_id);
                                                if (res.ok) { 
                                                    setNotice('Unlock successful'); 
                                                    setShowToast(true); 
                                                    load(); 
                                                }
                                            } catch (error) {
                                                console.error('Error unlocking user:', error);
                                            }
                                        }}>Unlock</Button>
                                    )}
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


