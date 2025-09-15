import React, { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import { Link } from "react-router-dom";
import { apiService } from "./services/apiService";

/**
 * Component AdminDoctors - Quản lý thông tin bác sĩ trong hệ thống y tế
 * Tính năng: Tạo, xem, sửa, xóa hồ sơ bác sĩ, upload ảnh đại diện
 */
function AdminDoctors() {
    // State quản lý dữ liệu component
    const [items, setItems] = useState([]); // Danh sách bác sĩ từ API
    const [cities, setCities] = useState([]); // Danh sách thành phố để chọn
    const [form, setForm] = useState({ 
        name: "", // Tên bác sĩ
        phone: "", // Số điện thoại
        email: "", // Email liên hệ
        specialization: "", // Chuyên khoa
        experience: "", // Số năm kinh nghiệm
        qualification: "", // Bằng cấp
        gender: "", // Giới tính
        dob: "", // Ngày sinh
        image: "", // Ảnh đại diện
        description: "", // Mô tả chi tiết
        city_id: "" // ID thành phố
    });
    const [editId, setEditId] = useState(null); // ID bác sĩ đang chỉnh sửa
    const [show, setShow] = useState(false); // Trạng thái hiển thị modal
    const [saving, setSaving] = useState(false); // Trạng thái loading khi lưu
    const [message, setMessage] = useState(""); // Thông báo toast
    const [showToast, setShowToast] = useState(false); // Trạng thái hiển thị toast
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // Trạng thái hiển thị xác nhận xóa
    const [deleteItem, setDeleteItem] = useState(null); // Item đang được chọn để xóa
    const [loading, setLoading] = useState(true); // Trạng thái loading dữ liệu

    /**
     * Tải dữ liệu bác sĩ và thành phố từ API
     * Sử dụng Promise.all để tải song song, tối ưu performance
     */
    const load = async () => {
        try {
            const [doctors, citiesData] = await Promise.all([
                apiService.getDoctors(), // Lấy danh sách bác sĩ
                apiService.getCities() // Lấy danh sách thành phố
            ]);
            
            setItems(doctors); // Cập nhật danh sách bác sĩ
            setCities(citiesData); // Cập nhật danh sách thành phố
        } catch (error) {
            console.error('Error loading data:', error);
            setItems([]); // Reset danh sách bác sĩ nếu lỗi
            setCities([]); // Reset danh sách thành phố nếu lỗi
        } finally {
            setLoading(false); // Tắt loading state
        }
    };

    // Tải dữ liệu khi component mount
    useEffect(() => { load(); }, []);

    /**
     * Chỉnh sửa thông tin bác sĩ
     * Điền form với dữ liệu bác sĩ được chọn
     */
    const edit = (item) => {
        setForm({
            name: item.name || "", // Tên bác sĩ
            phone: item.phone || "", // Số điện thoại
            email: item.email || "", // Email
            specialization: item.specialization || "", // Chuyên khoa
            experience: item.experience || "", // Kinh nghiệm
            qualification: item.qualification || "", // Bằng cấp
            gender: item.gender || "", // Giới tính
            dob: item.dob || "", // Ngày sinh
            image: "", // Reset ảnh để upload mới
            description: item.description || "", // Mô tả
            city_id: item.city_id || "" // ID thành phố
        });
        setEditId(item.doctor_id); // Lưu ID bác sĩ đang chỉnh sửa
        setShow(true); // Hiển thị modal
    };

    /**
     * Xử lý submit form để tạo/cập nhật bác sĩ
     * Hỗ trợ upload ảnh đại diện qua FormData
     */
    const submit = async (e) => {
        e.preventDefault();
        
        // Tạo FormData để gửi dữ liệu và file ảnh
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => {
            if (k === 'image') { 
                // Xử lý upload ảnh đại diện
                if (v instanceof File) fd.append('image', v); 
                return; 
            }
            // Chỉ gửi các field có giá trị
            if (v !== undefined && v !== null && v !== '') fd.append(k, v);
        });
        
        // Thêm _method=PUT cho update request
        if (editId) fd.append('_method', 'PUT');
        
        setSaving(true); // Bật loading state
        try {
            let response;
            if (editId) {
                // Cập nhật bác sĩ hiện có
                response = await apiService.updateDoctor(editId, fd);
            } else {
                // Tạo bác sĩ mới
                response = await apiService.createDoctor(fd);
            }
            
            if (response.ok) {
                setMessage('Saved successfully'); 
                setShowToast(true); 
                // Reset form sau khi lưu thành công
                setForm({ name: "", phone: "", email: "", specialization: "", experience: "", qualification: "", gender: "", dob: "", image: "", description: "", city_id: "" }); 
                setEditId(null); 
                setShow(false); 
                load(); // Reload danh sách
                // Auto hide toast after 3 seconds
                setTimeout(() => setShowToast(false), 3000);
            } else {
                // Xử lý lỗi từ API
                const errorData = await response.json();
                setMessage(errorData.message || "Save failed"); 
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
            }
        } catch (error) {
            console.error('Error saving doctor:', error);
            setMessage("Save failed"); 
            setShowToast(true);
            // Auto hide toast after 3 seconds
            setTimeout(() => setShowToast(false), 3000);
        } finally {
            setSaving(false); // Tắt loading state
        }
    };

    /**
     * Xác nhận xóa bác sĩ
     * Hiển thị modal xác nhận trước khi xóa
     */
    const confirmDelete = (item) => {
        setDeleteItem(item); // Lưu item cần xóa
        setShowDeleteConfirm(true); // Hiển thị modal xác nhận
    };

    /**
     * Xóa bác sĩ khỏi hệ thống
     * Gọi API để xóa bác sĩ được chọn
     */
    const remove = async () => {
        if (!deleteItem) return;
        
        try {
            await apiService.deleteDoctor(deleteItem.doctor_id); // Gọi API xóa
        } catch (error) {
            console.error('Error deleting doctor:', error);
        }
        
        setShowDeleteConfirm(false); // Đóng modal xác nhận
        setDeleteItem(null); // Reset item cần xóa
        
        setMessage('Deleted successfully'); // Hiển thị thông báo thành công
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        load(); // Reload danh sách
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
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="m-0 text-primary">Doctor Management</h2>
                <Button variant="primary" onClick={() => { 
                    setEditId(null); 
                    setForm({ name: "", phone: "", email: "", specialization: "", experience: "", qualification: "", gender: "", dob: "", image: "", description: "", city_id: "" }); 
                    setShow(true); 
                }}>+ Add Doctor</Button>
            </div>
            <Modal show={show} onHide={() => setShow(false)} size="lg">
                <Modal.Header closeButton><Modal.Title>{editId ? 'Update Doctor' : 'Add Doctor'}</Modal.Title></Modal.Header>
                <form onSubmit={submit}>
                <Modal.Body>
                    <div className="row g-2">
                        <div className="col-12 col-md-6"><input className="form-control" placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
                        <div className="col-12 col-md-6"><input className="form-control" placeholder="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></div>
                        <div className="col-12 col-md-6"><input className="form-control" placeholder="Phone Number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required /></div>
                        <div className="col-12 col-md-6"><input className="form-control" placeholder="Specialization" value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} required /></div>
                        <div className="col-12 col-md-6"><input className="form-control" placeholder="Experience (years)" type="number" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} required /></div>
                        <div className="col-12 col-md-6"><input className="form-control" placeholder="Qualification" value={form.qualification} onChange={e => setForm({ ...form, qualification: e.target.value })} required /></div>
                        <div className="col-12 col-md-4">
                            <select className="form-select" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                                <option value="">-- Select Gender --</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="col-12 col-md-4"><input className="form-control" type="date" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} /></div>
                        <div className="col-12 col-md-4">
                            <select className="form-select" value={form.city_id} onChange={e => setForm({ ...form, city_id: e.target.value })}>
                                <option value="">-- Select City --</option>
                                {cities.map(city => (
                                    <option key={city.city_id} value={city.city_id}>{city.city_name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-12"><textarea className="form-control" placeholder="Description" rows="3" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
                        <div className="col-12"><input className="form-control" type="file" accept="image/*" onChange={e => setForm({ ...form, image: e.target.files[0] })} /></div>
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
            <div className="table-responsive">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Avatar</th>
                            <th>Full Name</th>
                            <th>Gender</th>
                            <th>DOB</th>
                            <th>Experience</th>
                            <th>Qualification</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(i => (
                            <tr key={i.doctor_id}>
                                <td className="text-center">
                                    <img 
                                        src={i.image_url || `${process.env.PUBLIC_URL}/Images/Doctors/Unknown_person.jpg`} 
                                        alt={i.name} 
                                        style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }}
                                    />
                                </td>
                                <td><Link to={`/admin/doctors/${i.doctor_id}`}>{i.name}</Link></td>
                                <td>{i.gender}</td>
                                <td>{i.dob}</td>
                                <td>{i.experience} years</td>
                                <td>{i.qualification}</td>
                                <td className="d-flex gap-2">
                                    <button className="btn btn-sm btn-secondary" onClick={() => edit(i)}>Edit</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => confirmDelete(i)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="text-danger">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        Confirm Delete Doctor
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="text-center">
                        <i className="fas fa-user-md text-danger" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
                        <h5>Are you sure you want to delete this doctor?</h5>
                        {deleteItem && (
                            <div className="mt-3 p-3 bg-light rounded">
                                <p className="mb-1"><strong>Name:</strong> {deleteItem.name}</p>
                                <p className="mb-1"><strong>Email:</strong> {deleteItem.email}</p>
                                <p className="mb-1"><strong>Phone:</strong> {deleteItem.phone || 'N/A'}</p>
                                <p className="mb-1"><strong>Specialization:</strong> {deleteItem.specialization || 'N/A'}</p>
                                <p className="mb-0"><strong>Experience:</strong> {deleteItem.experience || 0} years</p>
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
                        Delete Doctor
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default AdminDoctors;
