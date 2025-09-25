import React, { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import { apiService } from "./services/apiService";

/**
 * Component AdminPatients - Quản lý thông tin bệnh nhân trong hệ thống y tế
 * Tính năng: Tạo, xem, sửa, xóa hồ sơ bệnh nhân, upload ảnh đại diện
 */
function AdminPatients() {
    // State quản lý dữ liệu component
    const [items, setItems] = useState([]); // Danh sách bệnh nhân từ API
    const [form, setForm] = useState({ 
        name: "", // Tên bệnh nhân
        phone: "", // Số điện thoại
        email: "", // Email liên hệ
        address: "", // Địa chỉ
        gender: "", // Giới tính
        dob: "" // Ngày sinh
    });
    const [editId, setEditId] = useState(null); // ID bệnh nhân đang chỉnh sửa
    const [show, setShow] = useState(false); // Trạng thái hiển thị modal
    const [saving, setSaving] = useState(false); // Trạng thái loading khi lưu
    const [message, setMessage] = useState(""); // Thông báo toast
    const [showToast, setShowToast] = useState(false); // Trạng thái hiển thị toast
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // Trạng thái hiển thị xác nhận xóa
    const [deleteItem, setDeleteItem] = useState(null); // Item đang được chọn để xóa

    /**
     * Tải dữ liệu bệnh nhân từ API
     * Lấy danh sách tất cả bệnh nhân trong hệ thống
     */
    const load = async () => {
        try {
            const data = await apiService.getPatients(); // Gọi API lấy danh sách bệnh nhân
            setItems(data); // Cập nhật state
        } catch (error) {
            console.error('Error fetching patients:', error);
            setItems([]); // Reset danh sách nếu lỗi
        }
    };

    // Tải dữ liệu khi component mount
    useEffect(() => { load(); }, []);

    /**
     * Chỉnh sửa thông tin bệnh nhân
     * Điền form với dữ liệu bệnh nhân được chọn
     */
    const edit = (item) => {
        setForm({
            name: item.name || "", // Tên bệnh nhân
            phone: item.phone || "", // Số điện thoại
            email: item.email || "", // Email
            address: item.address || "", // Địa chỉ
            gender: item.gender || "", // Giới tính
            dob: item.dob || "", // Ngày sinh
        });
        setEditId(item.id); // Lưu ID bệnh nhân đang chỉnh sửa
        setShow(true); // Hiển thị modal
    };

    const submit = async (e) => {
        e.preventDefault();
        // Sử dụng apiService thay vì fetch trực tiếp
        const method = editId ? "POST" : "POST"; // use POST with _method override for PUT
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => {
            if (k === 'image') return; // Bỏ qua image
            if (v !== undefined && v !== null && v !== '') fd.append(k, v);
        });
        if (editId) fd.append('_method', 'PUT');
        setSaving(true);
        try {
            let response;
            if (editId) {
                response = await apiService.updatePatient(editId, fd);
            } else {
                response = await apiService.createPatient(fd);
            }
            
            if (response.ok) {
                setMessage('Saved successfully'); 
                setShowToast(true); 
                setForm({ name: "", phone: "", email: "", address: "", gender: "", dob: "" }); 
                setEditId(null); 
                setShow(false); 
                // Force reload để cập nhật hình ảnh
                setTimeout(() => load(), 100);
                // Auto hide toast after 3 seconds
                setTimeout(() => setShowToast(false), 3000);
            } else {
                const errorData = await response.json();
                setMessage(errorData.message || "Save failed"); 
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
            }
        } catch (error) {
            console.error('Error saving patient:', error);
            setMessage('Save failed'); 
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        } finally {
            setSaving(false);
        }
    };

    const confirmDelete = (item) => {
        setDeleteItem(item);
        setShowDeleteConfirm(true);
    };

    const remove = async () => {
        if (!deleteItem) return;
        
        try {
            await apiService.deletePatient(deleteItem.id);
        } catch (error) {
            console.error('Error deleting patient:', error);
        }
        
        setShowDeleteConfirm(false);
        setDeleteItem(null);
        
        setMessage('Patient and user deleted successfully');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        load();
    };

    return (
        <div className="container-fluid py-4 px-4" style={{ marginTop: '80px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="m-0 text-primary">Patient Management</h2>
                <Button variant="primary" onClick={() => { setEditId(null); setForm({ name: "", phone: "", email: "", address: "", gender: "", dob: "" }); setShow(true); }}>+ Add Patient</Button>
            </div>
            <Modal show={show} onHide={() => setShow(false)} size="lg">
                <Modal.Header closeButton><Modal.Title>{editId ? 'Update Patient' : 'Add Patient'}</Modal.Title></Modal.Header>
                <form onSubmit={submit}>
                <Modal.Body>
                    <div className="row g-2">
                        <div className="col-12 col-md-6"><input className="form-control" placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
                        <div className="col-12 col-md-6"><input className="form-control" placeholder="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></div>
                        <div className="col-12 col-md-6"><input className="form-control" placeholder="Phone Number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required /></div>
                        <div className="col-12 col-md-6"><input className="form-control" placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required /></div>
                        <div className="col-12 col-md-4">
                            <select className="form-select" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                                <option value="">-- Select Gender --</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="col-12 col-md-4"><input className="form-control" type="date" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} /></div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>Close</Button>
                    <Button variant="primary" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
                </Modal.Footer>
                </form>
            </Modal>
            <ToastContainer position="bottom-end" className="p-3">
                <Toast bg={'success'} onClose={() => setShowToast(false)} show={showToast} delay={2500} autohide>
                    <Toast.Body className="text-white">{message}</Toast.Body>
                </Toast>
            </ToastContainer>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="text-danger">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        Confirm Delete
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="text-center">
                        <i className="fas fa-user-times text-danger" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
                        <h5>Are you sure you want to delete this patient?</h5>
                        {deleteItem && (
                            <div className="mt-3 p-3 bg-light rounded">
                                <p className="mb-1"><strong>Name:</strong> {deleteItem.name}</p>
                                <p className="mb-1"><strong>Email:</strong> {deleteItem.email}</p>
                                <p className="mb-0"><strong>Phone:</strong> {deleteItem.phone || 'N/A'}</p>
                            </div>
                        )}
                        <p className="text-muted mt-3 mb-0">This action cannot be undone.</p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
                        <i className="fas fa-times me-1"></i>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={remove}>
                        <i className="fas fa-trash me-1"></i>
                        Delete Patient
                    </Button>
                </Modal.Footer>
            </Modal>
            <div className="table-responsive">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Address</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(i => (
                            <tr key={i.id}>
                                <td>{i.name}</td>
                                <td>{i.email}</td>
                                <td>{i.phone}</td>
                                <td>{i.address}</td>
                                <td className="d-flex gap-2">
                                    <button className="btn btn-sm btn-secondary" onClick={() => edit(i)}>Edit</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => confirmDelete(i)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminPatients;


