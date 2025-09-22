import React, { useState, useEffect } from "react";
import { FaHome, FaBell, FaCamera } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "./AuthContext";
import {
  Container,
  Row,
  Col,
  Button,
  DropdownButton,
  Spinner
} from "react-bootstrap";

const DashboardLayout = () => {
  const { user, updateUserAvatar } = useAuth();
  const [doctorName, setDoctorName] = useState("Doctor");
  const [avatarUrl, setAvatarUrl] = useState("/default-avatar.jpg");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  // Lấy thông tin user
  useEffect(() => {
    if (user) {
      setDoctorName(user.username);
      const url = user.doctor?.image
        ? `http://localhost:8000${user.doctor.image}`
        : "/default-avatar.jpg";
      setAvatarUrl(url);
    }
  }, [user]);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:8000/api/notifications");
        const notificationsData = res.data?.data || res.data || [];
        setNotifications(Array.isArray(notificationsData) ? notificationsData : []);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  // Upload avatar
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setUploading(true);
      const res = await axios.post("http://localhost:8000/api/doctor/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newAvatar = res.data.avatar || "/default-avatar.jpg";
      const url = `http://localhost:8000${newAvatar}`;
      setAvatarUrl(url);
      updateUserAvatar(newAvatar);
    } catch (err) {
      console.error("Error uploading avatar:", err.response?.data || err.message);
    } finally {
      setUploading(false);
    }
  };

  // Đánh dấu thông báo đã đọc
  const handleNotificationClick = async (notificationId) => {
    try {
      await axios.post(`http://localhost:8000/api/notifications/${notificationId}/read`);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      );
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  // Đánh dấu tất cả đã đọc
  const handleMarkAllAsRead = async () => {
    try {
      await axios.post("http://localhost:8000/api/notifications/read-all");
      setNotifications((prev) => prev.map((notif) => ({ ...notif, is_read: true })));
    } catch (err) {
      console.error("Failed to mark all notifications as read", err);
    }
  };

  return (
    <Container fluid style={{ backgroundColor: "#0069D9" }}>
      <Row className="align-items-center">
        <Col>
          <h1>
            <FaHome /> Welcome back, {doctorName} 👋
          </h1>
        </Col>

        <Col className="text-end">
          {/* Notifications */}
          <DropdownButton
            variant="link"
            id="notifications-dropdown"
            title={<FaBell size={24} style={{ color: "white" }} />}
            onClick={() => setShowNotifications(!showNotifications)}
            style={{ backgroundColor: "transparent", border: "none" }}
          >
            {showNotifications && (
              <div style={{ width: "300px" }}>
                {loading ? (
                  <div className="d-flex justify-content-center">
                    <Spinner animation="border" />
                    <p>Loading notifications...</p>
                  </div>
                ) : notifications.length === 0 ? (
                  <p>No new notifications</p>
                ) : (
                  <>
                    <div className="d-flex justify-content-between">
                      <span>Notifications</span>
                      <Button variant="link" onClick={handleMarkAllAsRead}>
                        Mark all as read
                      </Button>
                    </div>
                    <ul className="list-unstyled">
                      {notifications.map((note, index) => (
                        <li
                          key={note.id || index}
                          onClick={() => handleNotificationClick(note.id)}
                          style={{
                            cursor: "pointer",
                            backgroundColor: note.is_read ? "#f8f9fa" : "#e9ecef",
                            padding: "10px",
                            borderBottom: "1px solid #dee2e6",
                          }}
                        >
                          <div>
                            <span>{note.message}</span>
                            <div>
                              <span>{note.type}</span> - <span>{note.time_ago}</span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}
          </DropdownButton>

          {/* Avatar */}
          <label style={{ position: "relative", display: "inline-block", marginLeft: "15px" }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              disabled={uploading}
              style={{ display: "none" }}
            />
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                overflow: "hidden",
                border: "2px solid #f3f3f6ff",
                cursor: "pointer",
                position: "relative",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              }}
            >
              <img
                src={avatarUrl}
                alt="avatar"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={() => setAvatarUrl("/default-avatar.jpg")}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                }}
                className="avatar-overlay"
              >
                <FaCamera color="#fff" size={16} />
              </div>
            </div>
          </label>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardLayout;
