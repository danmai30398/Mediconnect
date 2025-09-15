import React, { useState, useEffect } from 'react';
import './App.css';

const workingHours = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00'
];

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const DoctorAvailability = () => {
  const doctorId = 1;

  const doctorInfo = {
    name: "Dr. John Smith",
    id: doctorId,
    specialty: "Cardiology",
    clinic: "Central Clinic, 123 Main Street"
  };

  const toDateStr = (d) => d.toLocaleDateString('sv-SE');

  const getCurrentWeekRange = () => {
    const now = new Date();
    const day = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);
    return `${toDateStr(monday)} → ${toDateStr(friday)}`;
  };

  const getThisWeekDates = () => {
    const now = new Date();
    const day = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
    return weekdays.map((_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return toDateStr(d);
    });
  };

  const [availabilities, setAvailabilities] = useState([]);
  const [addForm, setAddForm] = useState({ date: '', slot: '', status: 'available' });
  const [editForm, setEditForm] = useState({ date: '', slot: '', status: 'available' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    const mockData = [
      { doctor_id: 1, date: '2025-09-02', slot: '08:00', status: 'available' },
      { doctor_id: 1, date: '2025-09-03', slot: '14:00', status: 'booked' }
    ];
    setAvailabilities(mockData);
  }, []);

  const addOneHour = (time) => {
    const [h, m] = time.split(':').map(Number);
    const totalMinutes = h * 60 + m + 60;
    const newHour = Math.floor(totalMinutes / 60);
    const newMinute = totalMinutes % 60;
    return `${String(newHour).padStart(2, '0')}:${String(newMinute).padStart(2, '0')}`;
  };

  const getAvailability = (date, slot) =>
    availabilities.find(a => a.date === date && a.slot === slot);

  const handleAdd = (e) => {
    e.preventDefault();
    const newEntry = {
      doctor_id: doctorId,
      date: addForm.date,
      slot: addForm.slot,
      status: addForm.status.toLowerCase()
    };
    setAvailabilities(prev => [...prev, newEntry]);
    setAddForm({ date: '', slot: '', status: 'available' });
    setShowAddForm(false);
    alert('Slot added successfully.');
  };

  const handleEdit = (e) => {
    e.preventDefault();
    const updated = [...availabilities];
    updated[editingIndex] = {
      doctor_id: doctorId,
      date: editForm.date,
      slot: editForm.slot,
      status: editForm.status.toLowerCase()
    };
    setAvailabilities(updated);
    setEditForm({ date: '', slot: '', status: 'available' });
    setEditingIndex(null);
    setShowEditForm(false);
    alert('Slot updated successfully.');
  };

  const handleDelete = (index) => {
    const entry = availabilities[index];
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the slot on ${entry.date} at ${entry.slot}?`
    );
    if (!confirmDelete) return;
    const updated = availabilities.filter((_, i) => i !== index);
    setAvailabilities(updated);
    alert('Slot deleted successfully.');
  };

  const openAddForm = () => {
    setShowAddForm(true);
    setShowEditForm(false);
    setAddForm({ date: '', slot: '', status: 'available' });
  };

  const openEditForm = (index) => {
    setEditingIndex(index);
    setEditForm(availabilities[index]);
    setShowAddForm(false);
    setShowEditForm(true);
  };

  return (
    <div className="availability-container">
      <h2>Doctor's Weekly Availability</h2>

      <div className="doctor-info">
        <p><strong>👤 Name:</strong> {doctorInfo.name}</p>
        <p><strong>🆔 ID:</strong> {doctorInfo.id}</p>
        <p><strong>🏥 Specialty:</strong> {doctorInfo.specialty}</p>
        <p><strong>🗺️ Clinic:</strong> {doctorInfo.clinic}</p>
        <p><strong>📅 Week of:</strong> {getCurrentWeekRange()}</p>
      </div>

      <button className="add-button" onClick={openAddForm}>+ Add Slot</button>

      {showAddForm && (
        <form className="availability-form" onSubmit={handleAdd}>
          <h3>Add New Slot</h3>
          <select
  value={addForm.date}
  onChange={e => setAddForm({ ...addForm, date: e.target.value })}
  required
>
  <option value="">-- Select Date --</option>
  {getThisWeekDates().map((date, i) => (
    <option key={i} value={date}>
      {weekdays[i]} ({date})
    </option>
  ))}
</select>
          <select
            value={addForm.slot}
            onChange={e => setAddForm({ ...addForm, slot: e.target.value })}
            required
          >
            <option value="">-- Select Slot --</option>
            {workingHours.map(time => (
              <option key={time} value={time}>
                {time} – {addOneHour(time)}
              </option>
            ))}
          </select>
          <select
            value={addForm.status}
            onChange={e => setAddForm({ ...addForm, status: e.target.value })}
            required
          >
            <option value="available">Available</option>
            <option value="booked">Booked</option>
          </select>
          <button className="save-button" type="submit">Save</button>
        </form>
      )}

      {showEditForm && (
        <div className="popup-overlay" onClick={() => setShowEditForm(false)}>
          <div className="popup-content" onClick={e => e.stopPropagation()}>
            <h3>Edit Slot</h3>
            <form onSubmit={handleEdit}>
              <input
                type="date"
                value={editForm.date}
                onChange={e => setEditForm({ ...editForm, date: e.target.value })}
                required
              />
              <select
                value={editForm.slot}
                onChange={e => setEditForm({ ...editForm, slot: e.target.value })}
                required
              >
                <option value="">-- Select Slot --</option>
                {workingHours.map(time => (
                  <option key={time} value={time}>
                    {time} – {addOneHour(time)}
                  </option>
                ))}
              </select>
              <select
                value={editForm.status}
                onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                required
              >
                <option value="available">Available</option>
                <option value="booked">Booked</option>
              </select>
              <div style={{ marginTop: '12px', textAlign: 'right' }}>
                <button type="submit" className="save-button">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <table className="availability-table">
        <thead>
          <tr>
            <th>Slot / Day</th>
            {getThisWeekDates().map((date, i) => (
              <th key={i}>{weekdays[i]}<br />({date})</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {workingHours.map((hour, i) => (
            <tr key={i}>
              <td>{hour} – {addOneHour(hour)}</td>
              {getThisWeekDates().map((date, j) => {
                const a = getAvailability(date, hour);
                const status = a?.status.toLowerCase();
                return (
                  <td key={j} className={status || 'empty'}>
                    {status === 'available' && '🟢 Available'}
                    {status === 'booked' && '🔴 Booked'}
                    {!status && '⬜'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="availability-list">
        <h3>Availability List</h3>
        <table className="detail-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {availabilities.map((a, i) => {
              const statusClass = a.status.toLowerCase() === 'available' ? 'available-text' : 'booked-text';
              return (
                <tr key={i}>
                  <td>{a.date}</td>
                  <td>{a.slot} – {addOneHour(a.slot)}</td>
                  <td className={statusClass}>{a.status}</td>
                  <td>
                    <button className="edit-btn" onClick={() => openEditForm(i)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(i)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorAvailability;
