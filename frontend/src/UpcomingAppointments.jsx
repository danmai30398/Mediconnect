// UpcomingAppointments.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const generateNext7Days = () => {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() + i);
    return {
      date,
      iso: date.toISOString().split("T")[0],
    };
  });
};

const UpcomingAppointments = () => {
  const days = generateNext7Days();
  const [selectedDate, setSelectedDate] = useState(days[0].iso);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get(`http://localhost:8000/api/appointments?from=${days[0].iso}&to=${days[6].iso}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAppointments(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu lịch hẹn:", err);
      }
    };

    fetchAppointments();
  }, []);

  const grouped = {};
  appointments.forEach((item) => {
    const dateKey = item.date;
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(item);
  });

  const currentAppointments = grouped[selectedDate] || [];

  return (
    <div className="appointments-container">
      <h3>Upcoming Appointments</h3>

      {/* Timeline ngày */}
      <div className="timeline">
        {days.map((day) => (
          <button
            key={day.iso}
            className={`timeline-day ${day.iso === selectedDate ? "active" : ""}`}
            onClick={() => setSelectedDate(day.iso)}
          >
            <div>{day.date.toLocaleDateString("en-US", { weekday: "short" })}</div>
            <div>
              {day.date.getDate()} {day.date.toLocaleDateString("en-US", { month: "short" })}
            </div>
          </button>
        ))}
      </div>

      {/* Danh sách lịch hẹn */}
      <div className="appointments-list">
        {currentAppointments.length === 0 ? (
          <p>No appointments for this day.</p>
        ) : (
          currentAppointments.map((appt, index) => (
            <div key={index} className="appointment-card">
              <img src={appt.avatar || "/default-avatar.jpg"} alt="avatar" className="appt-avatar" />
              <div className="info">
                <strong>{appt.patient_name}</strong>
              </div>
              <div className="time-price">
                <span>{appt.time}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UpcomingAppointments;
