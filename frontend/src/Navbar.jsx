import React, { useState, useEffect } from "react";
import { FaHome, FaBell } from "react-icons/fa";
import axios from "axios";
import "./App.css";

const DashboardLayout = () => {
  const [doctorName, setDoctorName] = useState("Doctor");
  const [avatar, setAvatar] = useState("/default-avatar.jpg");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    };

    const fetchDoctorInfo = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/doctor/me", {
          headers,
        });
        const { name, avatar } = res.data;
        setDoctorName(name);
        setAvatar(avatar);
      } catch (err) {
        console.error("Failed to fetch doctor info", err);
      }
    };

    const fetchNotifications = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/notifications", {
          headers,
        });
        setNotifications(res.data);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };

    fetchDoctorInfo();
    fetchNotifications();
  }, []);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    const token = localStorage.getItem("authToken");
    if (!token) return;

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    };

    try {
      setUploading(true);
      const res = await axios.post(
        "http://localhost:8000/api/doctor/avatar",
        formData,
        {
          headers,
        }
      );

      setAvatar(res.data.avatar);
      console.log("Avatar updated successfully:", res.data.avatar);
    } catch (err) {
      console.error("Error uploading avatar:", err.response?.data || err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Topbar */}
      <div className="topbar">
        <div className="logo-section">
          <span className="brand-name">
            <FaHome /> Welcome back, {doctorName} 👋
          </span>
        </div>

        <div className="right-section">
          <FaBell
            className="icon"
            onClick={() => setShowNotifications(!showNotifications)}
          />
          {showNotifications && (
            <div className="notification-popup">
              {notifications.length === 0 ? (
                <p>No new notifications</p>
              ) : (
                <ul>
                  {notifications.map((note, index) => (
                    <li key={index}>{note.message}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <label className="avatar-wrapper">
            {uploading ? (
              <div className="s-avatar loading-spinner"></div>
            ) : (
              <img src={avatar} alt="User" className="s-avatar" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="avatar-input"
              disabled={uploading}
            />
          </label>
          <span className="username">{doctorName} ▾</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
