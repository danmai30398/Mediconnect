import React, { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import { apiService } from "./services/apiService";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000";

function AdminCities() {
    const [items, setItems] = useState([]);
    const [form, setForm] = useState({ city_name: "" });
    const [editId, setEditId] = useState(null);
    const [show, setShow] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [showToast, setShowToast] = useState(false);

    const load = async () => {
        try {
            // Sử dụng apiService để lấy danh sách cities
            const data = await apiService.getCities();
            setItems(data);
        } catch (e) { 
            setItems([]); 
        }
    };

    useEffect(() => { load(); }, []);

    const submit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            let res;
            if (editId) {
                // Sử dụng apiService để cập nhật city
                res = await apiService.updateCity(editId, form);
            } else {
                // Sử dụng apiService để tạo city mới
                res = await apiService.createCity(form);
            }
            
            if (res.ok) { 
                setMessage(editId ? 'City updated successfully' : 'City created successfully'); 
                setShowToast(true); 
                setForm({ city_name: "" }); 
                setEditId(null); 
                setShow(false); 
                load(); 
            } else {
                try { 
                    const err = await res.json(); 
                    setMessage(err?.message || 'Save failed'); 
                } catch { 
                    setMessage('Save failed'); 
                } 
                setShowToast(true); 
            }
        } catch (error) {
            setMessage('Save failed');
            setShowToast(true);
        } finally {
            setSaving(false);
        }
    };

    const remove = async (id) => {
        if (!window.confirm("Delete city?")) return;
        // Sử dụng apiService để xóa city
        const res = await apiService.deleteCity(id);
        if (res.ok) {
            setMessage('City deleted successfully');
            setShowToast(true);
            load();
        } else {
            setMessage('Delete failed');
            setShowToast(true);
        }
    };

    return (
        <div className="container-fluid py-4 px-4" style={{ marginTop: '80px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="m-0 text-primary">City Management</h2>
                <Button variant="primary" onClick={() => { setEditId(null); setForm({ city_name: "" }); setShow(true); }}>+ Add City</Button>
            </div>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editId ? 'Update City' : 'Add City'}</Modal.Title>
                </Modal.Header>
                <form onSubmit={submit}>
                    <Modal.Body>
                        <div className="mb-2">
                            <input 
                                className="form-control" 
                                placeholder="City Name" 
                                value={form.city_name} 
                                onChange={e => setForm({ ...form, city_name: e.target.value })} 
                                required 
                            />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShow(false)}>Close</Button>
                        <Button variant="primary" type="submit" disabled={saving}>
                            {saving ? 'Saving...' : 'Save'}
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
            <div className="table-responsive">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>City Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(i => (
                            <tr key={i.city_id}>
                                <td>{i.city_id}</td>
                                <td>{i.city_name}</td>
                                <td className="d-flex gap-2">
                                    <button 
                                        className="btn btn-sm btn-secondary" 
                                        onClick={() => { 
                                            setEditId(i.city_id); 
                                            setForm({ city_name: i.city_name || "" }); 
                                            setShow(true); 
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        className="btn btn-sm btn-danger" 
                                        onClick={() => remove(i.city_id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <ToastContainer position="bottom-end" className="p-3">
                <Toast bg="success" onClose={() => setShowToast(false)} show={showToast} delay={2500} autohide>
                    <Toast.Body className="text-white">{message}</Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    );
}

export default AdminCities;
