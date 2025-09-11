import React, { useEffect, useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { apiService } from "./services/apiService";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000";

function AdminContactMessages() {
    const [items, setItems] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const [toastText, setToastText] = useState("");
    const [toastVariant, setToastVariant] = useState("success");
    // per-row update, no global status state needed

    const load = async () => {
        // Sử dụng apiService để lấy danh sách contact messages
        const data = await apiService.getContactMessages();
        setItems(data);
    };

    useEffect(() => { load(); }, []);

    const updateStatus = async (id, nextStatus) => {
        try {
            // Optimistic update for snappy UI
            setItems(prev => prev.map(x => x.message_id === id ? { ...x, status: nextStatus } : x));
            // Sử dụng apiService để cập nhật status
            const res = await apiService.updateContactMessageStatus(id, nextStatus);
            if (!res.ok) {
                setToastVariant("danger");
                setToastText("Update failed");
                setShowToast(true);
                // revert on failure
                setItems(prev => prev.map(x => x.message_id === id ? { ...x, status: undefined } : x));
                // Auto hide toast after 3 seconds
                setTimeout(() => setShowToast(false), 3000);
                return;
            }
            setToastVariant("success");
            setToastText("Updated successfully");
            setShowToast(true);
            // Auto hide toast after 3 seconds
            setTimeout(() => setShowToast(false), 3000);
        } catch (e) {
            setToastVariant("danger");
            setToastText("Update failed");
            setShowToast(true);
            // revert
            setItems(prev => prev.map(x => x.message_id === id ? { ...x, status: undefined } : x));
            // Auto hide toast after 3 seconds
            setTimeout(() => setShowToast(false), 3000);
        }
    };

    const remove = async (id) => {
        if (!window.confirm("Delete message?")) return;
        // Sử dụng apiService để xóa contact message
        const res = await apiService.deleteContactMessage(id);
        if (res.ok) {
            setToastVariant("success");
            setToastText("Deleted successfully");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            load();
        } else {
            setToastVariant("danger");
            setToastText("Delete failed");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }
    };

    return (
        <div className="container-fluid py-4 px-4" style={{ marginTop: '80px' }}>
            <h2 className="text-primary mb-4">Contact Messages</h2>
            <div className="table-responsive">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Content</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(i => (
                            <tr key={i.message_id}>
                                <td>{i.message_id}</td>
                                <td>{i.name}</td>
                                <td>{i.email}</td>
                                <td>{i.phone}</td>
                                <td>{i.message}</td>
                                <td>
                                    <select className="form-select form-select-sm" value={i.status || "pending"} onChange={e => updateStatus(i.message_id, e.target.value)}>
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="done">Done</option>
                                        <option value="closed">Closed</option>
                                    </select>
                                </td>
                                <td className="d-flex gap-2">
                                    <button className="btn btn-sm btn-danger" onClick={() => remove(i.message_id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <ToastContainer position="bottom-end" className="p-3">
                <Toast bg={toastVariant} onClose={() => setShowToast(false)} show={showToast} delay={2200} autohide>
                    <Toast.Body className="text-white">{toastText}</Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    );
}

export default AdminContactMessages;


