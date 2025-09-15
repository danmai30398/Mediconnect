import React, { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import { Badge } from 'react-bootstrap';
import { apiService } from "./services/apiService";

function AdminAppointments() {
    const [items, setItems] = useState([]);
    const [show, setShow] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [message, setMessage] = useState("");
    const [showToast, setShowToast] = useState(false);

    const load = async () => {
        try {
            const data = await apiService.getAppointments();
            setItems(data);
        } catch (e) { 
            setItems([]); 
        }
    };

    useEffect(() => { load(); }, []);

    const updateStatus = async (id, newStatus) => {
        try {
            const res = await apiService.updateAppointment(id, { status: newStatus });
            
            if (res.ok) {
                setMessage('Appointment status updated successfully');
                setShowToast(true);
                load();
            } else {
                setMessage('Update failed');
                setShowToast(true);
            }
        } catch (error) {
            setMessage('Update failed');
            setShowToast(true);
        }
    };

    const remove = async (id) => {
        if (!window.confirm("Delete appointment?")) return;
        const res = await apiService.deleteAppointment(id);
        if (res.ok) {
            setMessage('Appointment deleted successfully');
            setShowToast(true);
            load();
        } else {
            setMessage('Delete failed');
            setShowToast(true);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'pending': { variant: 'warning', text: 'Pending' },
            'confirmed': { variant: 'success', text: 'Confirmed' },
            'completed': { variant: 'primary', text: 'Completed' },
            'cancelled_by_patient': { variant: 'danger', text: 'Cancelled by Patient' },
            'cancelled_by_doctor': { variant: 'danger', text: 'Cancelled by Doctor' },
            'no_show': { variant: 'secondary', text: 'No Show' },
            'rescheduled': { variant: 'info', text: 'Rescheduled' }
        };
        
        const config = statusConfig[status] || { variant: 'secondary', text: status };
        return <Badge bg={config.variant}>{config.text}</Badge>;
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="container-fluid py-4 px-4" style={{ marginTop: '80px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="m-0 text-primary">Appointment Management</h2>
            </div>
            
            <div className="table-responsive">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Patient</th>
                            <th>Doctor</th>
                            <th>Date & Time</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(appointment => (
                            <tr key={appointment.appointment_id}>
                                <td>{appointment.appointment_id}</td>
                                <td>
                                    {appointment.patient ? (
                                        <div>
                                            <div className="fw-bold">{appointment.patient.name}</div>
                                            <small className="text-muted">{appointment.patient.email}</small>
                                        </div>
                                    ) : 'N/A'}
                                </td>
                                <td>
                                    {appointment.availability?.doctor ? (
                                        <div>
                                            <div className="fw-bold">{appointment.availability.doctor.name}</div>
                                            <small className="text-muted">{appointment.availability.doctor.specialization}</small>
                                        </div>
                                    ) : 'N/A'}
                                </td>
                                <td>
                                    {appointment.availability ? (
                                        <div>
                                            <div>{appointment.availability.available_date}</div>
                                            <small className="text-muted">{appointment.availability.available_time}</small>
                                        </div>
                                    ) : 'N/A'}
                                </td>
                                <td>{getStatusBadge(appointment.status)}</td>
                                <td className="d-flex gap-2">
                                    <select 
                                        className="form-select form-select-sm" 
                                        value={appointment.status} 
                                        onChange={e => updateStatus(appointment.appointment_id, e.target.value)}
                                        style={{ width: '150px' }}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled_by_patient">Cancelled by Patient</option>
                                        <option value="cancelled_by_doctor">Cancelled by Doctor</option>
                                        <option value="no_show">No Show</option>
                                        <option value="rescheduled">Rescheduled</option>
                                    </select>
                                    <button 
                                        className="btn btn-sm btn-danger" 
                                        onClick={() => remove(appointment.appointment_id)}
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

export default AdminAppointments;
