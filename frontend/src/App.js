import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import DashboardLayout from "./Navbar";
import "./App.css";
import DoctorProfile from "./DoctorProfile.jsx";
import { DoctorProvider } from "./DoctorContext";
import DoctorAvailability from "./AvailabilityPage.jsx";
import AppointmentList from "./Appointment.jsx";
// import LoginPage from "./LoginPage.jsx";

function App() {
  return (
    <DoctorProvider> {/* Bao toàn bộ Router */}
      <Router>
        <div className="container">
          <Sidebar />
          <div className="main-content">
            <DashboardLayout />
            <div className="content-area">
              <Routes>
                {/* <Route path="/Login" element={<LoginPage />} /> */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/doctorprofile" element={<DoctorProfile />} />
                <Route path="/AvailabilityPage" element={<DoctorAvailability />} />
                <Route path="/docappointment" element={<AppointmentList />} />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </DoctorProvider>
  );
}

export default App;
