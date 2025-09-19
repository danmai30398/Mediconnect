import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { Row, Col, Button, Card, Form, Modal, Table, Spinner } from 'react-bootstrap';
import './App.css';

const workingHours = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00'
];

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const DoctorAvailability = () => {
  const { user } = useAuth();
  const doctorId = user?.doctor.doctor_id || user?.id || 1;
  const finalDoctorId = doctorId || localStorage.getItem('doctorId') || 1;

  const doctorInfo = {
    name: user?.doctor.name || "Dr. John Smith",
    id: finalDoctorId,
    specialty: user?.doctor.specialization || "Cardiology",
    clinic: user?.doctor.clinic || "MediConnect Group"
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
        const url = `http://localhost:8000/api/doctor/availability?doctor_id=${finalDoctorId}`;
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
      const response = await axios.post('http://localhost:8000/api/doctor/availability', {
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
      const response = await axios.put(`http://localhost:8000/api/doctor/availability/${availabilityId}`, {
        available_date: editForm.date,
        available_time: editForm.slot,
        status: editForm.status?.toLowerCase() || 'available'
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json'
        }
      });
      console.log('Response:', response);
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
      await axios.delete(`http://localhost:8000/api/doctor/availability/${availabilityId}`, {
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
  };

  return (
    <div className="availability-container">
      <h2>Doctor's Weekly Availability</h2>

      <Card>
        <Card.Body>
          <Row>
            <Col md={6}>
              <p><strong>👤 Name:</strong> {doctorInfo.name}</p>
              <p><strong>🆔 ID:</strong> {doctorInfo.id}</p>
              <p><strong>🏥 Specialty:</strong> {doctorInfo.specialty}</p>
              <p><strong>🗺️ Clinic:</strong> {doctorInfo.clinic}</p>
              <p><strong>📅 Week of:</strong> {weekRange}</p>
            </Col>
            <Col md={6} className="text-end">
              <Button variant="outline-primary" onClick={() => setWeekOffset(weekOffset - 1)}>
                ⬅️ Previous Week
              </Button>
              <Button variant="outline-secondary" onClick={() => setWeekOffset(0)}>
                📅 Current Week
              </Button>
              <Button variant="outline-primary" onClick={() => setWeekOffset(weekOffset + 1)}>
                Next Week ➡️
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Row className="my-3">
        <Col>
          <Button
            variant="primary"
            onClick={openAddForm}
            disabled={loading}
          >
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              '+ Add Slot'
            )}
          </Button>
        </Col>
        <Col className="text-end">
          <Button
            variant="outline-secondary"
            onClick={toggleCompactMode}
          >
            {compactMode ? '🔍 Normal' : '📱 Compact'}
          </Button>
        </Col>
      </Row>

      {/* Add Slot Modal */}
      {showAddForm && (
        <Modal show={showAddForm} onHide={() => setShowAddForm(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Slot</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleAdd}>
              <Form.Group className="mb-3">
                <Form.Label>Select Date</Form.Label>
                <Form.Control
                  as="select"
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
                </Form.Control>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Select Slot</Form.Label>
                <Form.Control
                  as="select"
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
                </Form.Control>
              </Form.Group>

              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      )}

      {/* Edit Slot Modal */}
      {showEditForm && (
        <Modal show={showEditForm} onHide={() => setShowEditForm(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Slot</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleEdit}>
              <Form.Group className="mb-3">
                <Form.Label>Select Date</Form.Label>
                <Form.Control
                  as="select"
                  value={editForm.date}
                  onChange={e => setEditForm({ ...editForm, date: e.target.value })}
                  required
                >
                  <option value="">-- Select Date --</option>
                  {weekDates.map((date, i) => (
                    <option key={i} value={date}>
                      {weekdays[i]} ({date})
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Select Slot</Form.Label>
                <Form.Control
                  as="select"
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
                </Form.Control>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  as="select"
                  value={editForm.status}
                  onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                >
                  <option value="available">Available</option>
                  <option value="booked">Booked</option>
                  <option value="unavailable">Unavailable</option>
                </Form.Control>
              </Form.Group>

              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      )}

      {/* Availability Slots Table */}
      <Table responsive="sm" striped bordered hover className="my-3">
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
      </Table>

      <Row className="my-3">
        <Col>
          <h3>Availability List</h3>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
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
            const statusClass = a.status?.toLowerCase() === 'available' ? 'text-success' : 'text-danger';
            const date = a.available_date || a.date;
            const time = a.available_time || a.slot;
            return (
              <tr key={a.availability_id || i}>
                <td>{date}</td>
                <td>{time} – {addOneHour(time)}</td>
                <td className={statusClass}>{a.status || 'N/A'}</td>
                <td>
                  <Button
                    variant="warning"
                    onClick={() => openEditForm(i)}
                    disabled={a.status === 'booked'}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    className="ml-2"
                    onClick={() => handleDelete(i)}
                    disabled={a.status === 'booked'}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default DoctorAvailability;

