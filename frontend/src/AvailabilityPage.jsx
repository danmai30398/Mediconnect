import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import './App.css';

const workingHours = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00'
];

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const DoctorAvailability = () => {
  const { user } = useAuth();
  const doctorId = user?.doctor_id || user?.id || 1;
  const finalDoctorId = doctorId || localStorage.getItem('doctorId') || 1;

  const doctorInfo = {
    name: user?.name || "Dr. John Smith",
    id: finalDoctorId,
    specialty: user?.specialization || "Cardiology",
    clinic: user?.clinic || "MediConnect Group"
  };

  const toDateStr = (d) => d.toLocaleDateString('sv-SE');

  const getWeekDates = (baseDate, offsetWeeks = 0) => {
    const monday = new Date(baseDate);
    const day = monday.getDay();
    monday.setDate(monday.getDate() - (day === 0 ? 6 : day - 1) + offsetWeeks * 7);

    return weekdays.map((_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return toDateStr(d);
    });
  };

  const getWeekRange = (dates) => {
    return `${dates[0]} → ${dates[dates.length - 1]}`;
  };

  // --- state cho tuần ---
  const [weekOffset, setWeekOffset] = useState(0);
  const [weekDates, setWeekDates] = useState(getWeekDates(new Date(), 0));
  const [weekRange, setWeekRange] = useState(getWeekRange(getWeekDates(new Date(), 0)));

  useEffect(() => {
    const dates = getWeekDates(new Date(), weekOffset);
    setWeekDates(dates);
    setWeekRange(getWeekRange(dates));

    const interval = setInterval(() => {
      const newDates = getWeekDates(new Date(), weekOffset);
      setWeekDates(newDates);
      setWeekRange(getWeekRange(newDates));
    }, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [weekOffset]);

  const [availabilities, setAvailabilities] = useState([]);
  const [addForm, setAddForm] = useState({ date: '', slot: '', status: 'available' });
  const [editForm, setEditForm] = useState({ date: '', slot: '', status: 'available' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [compactMode, setCompactMode] = useState(false);

  // Fetch availabilities from API
  useEffect(() => {
    const fetchAvailabilities = async () => {
      if (!finalDoctorId) return;
      try {
        setLoading(true);
        const url = `http://localhost:8000/api/availability?doctor_id=${finalDoctorId}`;
        const response = await axios.get(url, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': 'application/json'
          }
        });
        const availabilitiesData = response.data?.data || response.data || [];
        setAvailabilities(Array.isArray(availabilitiesData) ? availabilitiesData : []);
      } catch (error) {
        console.error('Error fetching availabilities:', error);
        setAvailabilities([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAvailabilities();
  }, [finalDoctorId]);

  useEffect(() => {
    return () => {
      document.body.classList.remove('compact-mode');
    };
  }, []);

  const addOneHour = (time) => {
    if (!time || typeof time !== 'string') return '00:00';
    const [h, m] = time.split(':').map(Number);
    const totalMinutes = h * 60 + m + 60;
    const newHour = Math.floor(totalMinutes / 60);
    const newMinute = totalMinutes % 60;
    return `${String(newHour).padStart(2, '0')}:${String(newMinute).padStart(2, '0')}`;
  };

const normalizeDate = (d) => d ? d.slice(0, 10) : null;

const normalizeTime = (t) => t ? t.slice(0, 5) : null;

const getAvailability = (date, slot) =>
  availabilities.find(a =>
    normalizeDate(a.available_date || a.date) === date &&
    normalizeTime(a.available_time || a.slot) === slot
  );

  // Add
  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/availability', {
        doctor_id: finalDoctorId,
        available_date: addForm.date,
        available_time: addForm.slot,
        status: 'available'
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json'
        }
      });
      const newAvailability = response.data?.data || response.data;
      if (newAvailability) {
        setAvailabilities(prev => [...prev, newAvailability]);
      }
      setAddForm({ date: '', slot: '', status: 'available' });
      setShowAddForm(false);
      alert('Slot added successfully.');
    } catch (error) {
      console.error('Failed to add availability:', error);
      alert('Failed to add slot. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Edit
  const handleEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const availabilityId = availabilities[editingIndex]?.availability_id;
      if (!availabilityId) throw new Error('Availability ID not found');
      await axios.put(`http://localhost:8000/api/availability/${availabilityId}`, {
        available_date: editForm.date,
        available_time: editForm.slot,
        status: editForm.status?.toLowerCase() || 'available'
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json'
        }
      });
      const updated = [...availabilities];
      updated[editingIndex] = {
        ...updated[editingIndex],
        available_date: editForm.date,
        available_time: editForm.slot,
        status: editForm.status?.toLowerCase() || 'available',
        date: editForm.date,
        slot: editForm.slot
      };
      setAvailabilities(updated);
      setEditForm({ date: '', slot: '', status: 'available' });
      setEditingIndex(null);
      setShowEditForm(false);
      alert('Slot updated successfully.');
    } catch (error) {
      console.error('Failed to update availability:', error);
      alert('Failed to update slot. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Delete
  const handleDelete = async (index) => {
    const entry = availabilities[index];
    if (entry.status === 'booked') {
      alert('Cannot delete a booked slot. Cancel appointment first.');
      return;
    }
    if (!window.confirm(`Delete slot on ${entry.available_date || entry.date} at ${entry.available_time || entry.slot}?`)) return;
    setLoading(true);
    try {
      const availabilityId = entry.availability_id;
      if (!availabilityId) throw new Error('Availability ID not found');
      await axios.delete(`http://localhost:8000/api/availability/${availabilityId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json'
        }
      });
      setAvailabilities(availabilities.filter((_, i) => i !== index));
      alert('Slot deleted successfully.');
    } catch (error) {
      console.error('Failed to delete availability:', error);
      alert('Failed to delete slot. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openAddForm = () => {
    setShowAddForm(true);
    setShowEditForm(false);
    setAddForm({ date: '', slot: '', status: 'available' });
  };

  const openEditForm = (index) => {
    const availability = availabilities[index];
    setEditingIndex(index);
    setEditForm({
      date: availability.available_date || availability.date || '',
      slot: availability.available_time || availability.slot || '',
      status: availability.status || 'available'
    });
    setShowAddForm(false);
    setShowEditForm(true);
  };

  const toggleCompactMode = () => {
    setCompactMode(!compactMode);
    document.body.classList.toggle('compact-mode', !compactMode);
  };

  return (
    <div className="availability-container">
      <h2>Doctor's Weekly Availability</h2>

      <div className="doctor-info">
        <p><strong>👤 Name:</strong> {doctorInfo.name}</p>
        <p><strong>🆔 ID:</strong> {doctorInfo.id}</p>
        <p><strong>🏥 Specialty:</strong> {doctorInfo.specialty}</p>
        <p><strong>🗺️ Clinic:</strong> {doctorInfo.clinic}</p>
        <p><strong>📅 Week of:</strong> {weekRange}</p>
      </div>

      <div className="button-group">
        <div className="week-button-group">
          <button className="week-btn" onClick={() => setWeekOffset(weekOffset - 1)}>
            ⬅️ Previous Week
          </button>
          <button className="week-btn" onClick={() => setWeekOffset(0)}>
            📅 Current Week
          </button>
          <button className="week-btn" onClick={() => setWeekOffset(weekOffset + 1)}>
            Next Week ➡️
          </button>
        </div>

        <button
          className="add-button"
          onClick={openAddForm}
          disabled={loading}
        >
          {loading ? 'Loading...' : '+ Add Slot'}
        </button>

        <button
          className={`compact-toggle ${compactMode ? 'active' : ''}`}
          onClick={toggleCompactMode}
        >
          {compactMode ? '🔍 Normal' : '📱 Compact'}
        </button>
      </div>

      {showAddForm && (
        <form className="availability-form" onSubmit={handleAdd}>
          <h3>Add New Slot</h3>
          <select
            value={addForm.date}
            onChange={e => setAddForm({ ...addForm, date: e.target.value })}
            required
          >
            <option value="">-- Select Date --</option>
            {weekDates.map((date, i) => (
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
          <button className="save-button" type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
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
              <button type="submit" className="save-button" disabled={loading}>
                {loading ? 'Updating...' : 'Update'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="table-responsive">
        <table className="availability-table">
          <thead>
            <tr>
              <th>Slot / Day</th>
              {weekDates.map((date, i) => (
                <th key={i}>{weekdays[i]}<br />({date})</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {workingHours.map((hour, i) => (
              <tr key={i}>
                <td>{hour} – {addOneHour(hour)}</td>
                {weekDates.map((date, j) => {
                  const a = getAvailability(date, hour);
                  const status = a?.status?.toLowerCase();
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
      </div>

      <div className="availability-list">
        <h3>Availability List</h3>
        <div className="table-responsive">
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
              {Array.isArray(availabilities) && availabilities.map((a, i) => {
                const statusClass = a.status?.toLowerCase() === 'available' ? 'available-text' : 'booked-text';
                const date = a.available_date || a.date;
                const time = a.available_time || a.slot;
                return (
                  <tr key={a.availability_id || i}>
                    <td>{date}</td>
                    <td>{time} – {addOneHour(time)}</td>
                    <td className={statusClass}>{a.status || 'N/A'}</td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => openEditForm(i)}
                        disabled={loading || a.status === 'booked' || a.has_active_appointment}
                        title={
                          a.status === 'booked' || a.has_active_appointment
                            ? 'Cannot edit slot with active appointments'
                            : 'Edit slot'
                        }
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(i)}
                        disabled={loading || a.status === 'booked' || a.has_active_appointment}
                        title={
                          a.status === 'booked' || a.has_active_appointment
                            ? 'Cannot delete slot with active appointments'
                            : 'Delete slot'
                        }
                      >
                        {loading ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DoctorAvailability;