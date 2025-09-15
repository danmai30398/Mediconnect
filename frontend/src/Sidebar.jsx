import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaTachometerAlt, FaCalendarAlt, FaUsers, FaEnvelope, FaSignOutAlt } from "react-icons/fa";
import { useDoctor } from "./DoctorContext"; 

const Sidebar = () => {
  const location = useLocation();
  const { doctor } = useDoctor(); 

  const linkClass = (path) =>
    location.pathname === path ? "active-link" : "inactive-link";

  return (
    <div className="sidebar">
      <div className="logo-container">
        <img
          src="/doctor-images/logo.png"
          alt="MediConnect Logo"
          className="sidebar-logo"
        />
      </div>

      <div className="profile-section">
        <div className="avatar-wrapper">
          <img
            src={doctor?.avatar || "/default-avatar.jpg"}
            alt="Doctor"
            className="avatar"
          />
        </div>
        <h3 className="name">{doctor?.name || "Doctor"}</h3>
        <p className="role">{doctor?.role || "Specialist"}</p>
      </div>

      <ul className="nav-links">
        <li>
          <Link to="/dashboard" className={linkClass("/dashboard")}>
            <FaTachometerAlt /> Dashboard
          </Link>
        </li>
        <li>
          <Link to="/doctorprofile" className={linkClass("/doctorprofile")}>
            <FaCalendarAlt /> Doctor Profile
          </Link>
        </li>
        <li>
          <Link to="/AvailabilityPage" className={linkClass("/AvailabilityPage")}>
            <FaUsers /> Availability Scheduling
          </Link>
        </li>
        <li>
          <Link to="/docappointment" className={linkClass("/docappointment")}>
            <FaEnvelope /> Appointment Viewing
          </Link>
        </li>
      </ul>

      <div className="logout">
        <Link to="/logout" className="inactive-link">
          <FaSignOutAlt /> Logout
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
