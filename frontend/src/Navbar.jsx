import React, { useState, useEffect } from "react";
import { FaHome, FaBell } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { Container, Row, Col, Button, Dropdown, DropdownButton, Spinner } from "react-bootstrap";

const DashboardLayout = () => {
  const { user, updateUserAvatar } = useAuth();
  const [doctorName, setDoctorName] = useState("Doctor");
  const [avatar, setAvatar] = useState("/default-avatar.jpg");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setDoctorName(user.username);
      setAvatar(user.image ? `http://localhost:8000${user.doctor.image}` : "/default-avatar.jpg");
    }
  }, [user]);

  // Update avatar when doctor context changes
  useEffect(() => {
    if (user?.doctor.image) {
      setAvatar(`http://localhost:8000${user.image}`);
    }
  }, [user?.doctor.image]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:8000/api/notifications");
        console.log('Navbar Notifications API Response:', res.data); // Debug log

        // Ensure we always have an array
        const notificationsData = res.data?.data || res.data || [];
        if (Array.isArray(notificationsData)) {
          console.log(notificationsData)
          setNotifications(notificationsData);
        } else {
          console.error('Invalid notifications data:', notificationsData);
          setNotifications([]);
        }
      } catch (err) {
        console.error("Failed to fetch notifications", err);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

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
      setAvatar(`http://localhost:8000${newAvatar}`);
      console.log("Avatar updated successfully:", newAvatar);

      // Update user context with new avatar
      updateUserAvatar(newAvatar);
    } catch (err) {
      console.error("Error uploading avatar:", err.response?.data || err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleNotificationClick = async (notificationId) => {
    try {
      await axios.post(`http://localhost:8000/api/notifications/${notificationId}/read`);
      // Update local state to mark as read
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId
            ? { ...notif, is_read: true }
            : notif
        )
      );
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await axios.post("http://localhost:8000/api/notifications/read-all");
      // Update local state to mark all as read
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, is_read: true }))
      );
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
          <DropdownButton
            variant="link"
            id="notifications-dropdown"
            title={<FaBell size={24} style={{ color: 'white' }} />}
            onClick={() => setShowNotifications(!showNotifications)}
            style={{ backgroundColor: 'transparent', border: 'none' }}
          >
            {showNotifications && (
              <div style={{ width: '300px' }}>
                {loading ? (
                  <div className="d-flex justify-content-center">
                    <Spinner animation="border" />
                    <p>Loading notifications...</p>
                  </div>
                ) : !Array.isArray(notifications) || notifications.length === 0 ? (
                  <p>No new notifications</p>
                ) : (
                  <>
                    <div className="d-flex justify-content-between">
                      <span>Notifications</span>
                      <Button
                        variant="link"
                        onClick={handleMarkAllAsRead}
                      >
                        Mark all as read
                      </Button>
                    </div>
                    <ul className="list-unstyled">
                      {notifications.map((note, index) => (
                        <li
                          key={note.id || index}
                          onClick={() => handleNotificationClick(note.id)}
                          style={{
                            cursor: 'pointer',
                            backgroundColor: note.is_read ? '#f8f9fa' : '#e9ecef',
                            padding: '10px',
                            borderBottom: '1px solid #dee2e6' 
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


          <label>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              disabled={uploading}
              style={{ display: 'none' }}
            />
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                overflow: 'hidden',
                backgroundImage: `url(${avatar})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                cursor: 'pointer',
              }}
            />
          </label>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardLayout;
