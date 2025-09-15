import React, { useState } from "react";
import "./App.css";
import { FaCheckCircle, FaEllipsisH } from "react-icons/fa";

const initialAppointments = [
  {
    appointment_id: 1,
    patient_id: 12,
    patient_name: "Rony Brawa",
    availability_id: 101,
    date: "2025-09-01",
    slot: "18:00",
    status: "confirmed",
  },
  {
    appointment_id: 2,
    patient_id: 13,
    patient_name: "Grill Merhew",
    availability_id: 102,
    date: "2025-09-01",
    slot: "19:00",
    status: "completed",
  },
  {
    appointment_id: 3,
    patient_id: 14,
    patient_name: "Yashka Mintas",
    availability_id: 103,
    date: "2025-09-01",
    slot: "20:00",
    status: "cancelled_by_patient",
  },
  {
    appointment_id: 4,
    patient_id: 15,
    patient_name: "Glory Gill",
    availability_id: 104,
    date: "2025-09-01",
    slot: "09:00",
    status: "pending",
  },
];

const AppointmentList = () => {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const handleAction = (id, newStatus) => {
    const updated = appointments.map((a) =>
      a.appointment_id === id ? { ...a, status: newStatus } : a
    );
    setAppointments(updated);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <FaCheckCircle color="#3b82f6" />;
      case "completed":
        return <FaCheckCircle color="green" />;
      case "cancelled_by_patient":
        return <span style={{ color: "red" }}>Patient ❌</span>;
      case "cancelled_by_doctor":
        return <span style={{ color: "red" }}>Doctor ❌</span>;
      case "no_show":
        return <span style={{ color: "#f43f5e" }}>🚫</span>;
      case "rescheduled":
        return <span style={{ color: "#eab308" }}>🔁</span>;
      case "pending":
      default:
        return <FaEllipsisH color="#f97316" />;
    }
  };

  const addOneHour = (time) => {
    const [h, m] = time.split(":").map(Number);
    const total = h * 60 + m + 60;
    const hour = String(Math.floor(total / 60)).padStart(2, "0");
    const min = String(total % 60).padStart(2, "0");
    return `${hour}:${min}`;
  };

  const filteredAppointments = appointments.filter((a) => {
    const matchName = a.patient_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "" || a.status === statusFilter;
    return matchName && matchStatus;
  });

  return (
    <div className="app-container">
      <h2>Appointments</h2>

      <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
        <input
          type="text"
          placeholder="Search by patient name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="rescheduled">Rescheduled</option>
          <option value="cancelled_by_patient">Cancelled by Patient</option>
          <option value="cancelled_by_doctor">Cancelled by Doctor</option>
          <option value="no_show">No Show</option>
        </select>
      </div>

      <div className="grid-header2">
        <div>ID</div>
        <div>Patient</div>
        <div>Date</div>
        <div>Slot</div>
        <div>Status</div>
        <div>Actions</div>
      </div>

      {filteredAppointments.map((a) => (
        <div key={a.appointment_id} className="grid-row">
          <div>{a.appointment_id}</div>
          <div>{a.patient_name}</div>
          <div>{a.date}</div>
          <div>{a.slot} – {addOneHour(a.slot)}</div>
          <div className="status-icon">{getStatusIcon(a.status)}</div>
          <div className="action-buttons">
            {a.status === "pending" && (
              <button
                className="btn-confirm"
                onClick={() => handleAction(a.appointment_id, "confirmed")}
              >
                Confirm
              </button>
            )}
            {a.status === "confirmed" && (
              <>
                <button
                  className="btn-complete"
                  onClick={() => handleAction(a.appointment_id, "completed")}
                >
                  Complete
                </button>
                <button
                  className="btn-cancel"
                  onClick={() => handleAction(a.appointment_id, "cancelled_by_doctor")}
                >
                  Cancel
                </button>
                <button
                  className="btn-noshow"
                  onClick={() => handleAction(a.appointment_id, "no_show")}
                >
                  No Show
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AppointmentList;
