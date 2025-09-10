import React, { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000";

function AdminCategories() {
    const [items, setItems] = useState([]);
    const [form, setForm] = useState({ category_name: "" });
    const [editId, setEditId] = useState(null);
    const [show, setShow] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [showToast, setShowToast] = useState(false);

    const load = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/categories`, { 
                headers: { 'Authorization': `Bearer ${localStorage.getItem('MediToken') || ''}` } 
            });
            if (res.ok) {
                const data = await res.json();
                setItems(data);
            } else {
                setItems([]);
            }
        } catch (e) { 
            setItems([]); 
        }
    };

    useEffect(() => { load(); }, []);

    const submit = async (e) => {
        e.preventDefault();
        const url = editId ? `${API_BASE_URL}/api/categories/${editId}` : `${API_BASE_URL}/api/categories`;
        const method = editId ? "POST" : "POST";
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => {
            if (v !== undefined && v !== null) fd.append(k, v);
        });
        if (editId) fd.append('_method', 'PUT');
        setSaving(true);
        const res = await fetch(url, { 
            method, 
            headers: { "Authorization": `Bearer ${localStorage.getItem('MediToken') || ''}` }, 
            body: fd 
        });
        setSaving(false);
        if (res.ok) { 
            setMessage(editId ? 'Category updated successfully' : 'Category created successfully'); 
            setShowToast(true); 
            setForm({ category_name: "" }); 
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
    };

    const remove = async (id) => {
        if (!window.confirm("Delete category?")) return;
        const res = await fetch(`${API_BASE_URL}/api/categories/${id}`, { 
            method: "DELETE", 
            headers: { "Authorization": `Bearer ${localStorage.getItem('MediToken') || ''}` } 
        });
        if (res.ok) {
            setMessage('Category deleted successfully');
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
                <h2 className="m-0 text-primary">Category Management</h2>
                <Button variant="primary" onClick={() => { setEditId(null); setForm({ category_name: "" }); setShow(true); }}>+ Add Category</Button>
            </div>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editId ? 'Update Category' : 'Add Category'}</Modal.Title>
                </Modal.Header>
                <form onSubmit={submit}>
                    <Modal.Body>
                        <div className="mb-2">
                            <input 
                                className="form-control" 
                                placeholder="Category Name" 
                                value={form.category_name} 
                                onChange={e => setForm({ ...form, category_name: e.target.value })} 
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
                            <th>Category Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(i => (
                            <tr key={i.category_id}>
                                <td>{i.category_id}</td>
                                <td>{i.category_name}</td>
                                <td className="d-flex gap-2">
                                    <button 
                                        className="btn btn-sm btn-secondary" 
                                        onClick={() => { 
                                            setEditId(i.category_id); 
                                            setForm({ category_name: i.category_name || "" }); 
                                            setShow(true); 
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        className="btn btn-sm btn-danger" 
                                        onClick={() => remove(i.category_id)}
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

export default AdminCategories;
