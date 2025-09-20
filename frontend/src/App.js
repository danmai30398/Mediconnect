import './App.css';
import DocQuickViews from './DocQuickViews';
import DoctorDetails from './DoctorDetails';
import LoginByEmail from './LoginByEmail';
import { Link, Navigate, Route, Routes, Router, Outlet } from 'react-router-dom';
import Register from './Register';
import PatientProfile from './PatientProfile';
import PatientLayout from './PatientLayout';
import LoginByPhone from './LoginByPhone';
import ForgotPass from './ForgotPass';
import AdminLayout from './AdminLayout';
import AdminDashboard from './AdminDashboard';
import AdminContents from './AdminContents';
import AdminContactMessages from './AdminContactMessages';
import AdminDoctors from './AdminDoctors';
import AdminPatients from './AdminPatients';
import AdminDoctorDetail from './AdminDoctorDetail';
import AdminUsers from './AdminUsers';
import AdminCities from './AdminCities';
import AdminCategories from './AdminCategories';
import AdminAppointments from './AdminAppointments';

import PatientDashboard from './PatientDashboard';
import PatientAppointments from './PatientAppointments';

import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import DashboardLayout from "./Navbar";
import DoctorProfile from "./DoctorProfile.jsx";
import { DoctorProvider } from "./DoctorContext";
import { AuthProvider } from "./AuthContext";
import DoctorAvailability from "./AvailabilityPage.jsx";
import AppointmentList from "./Appointment.jsx";
import AppointmentManagement from "./AppointmentManagement.jsx";
import ErrorBoundary from "./ErrorBoundary.jsx";
import React from "react";
import HomePage from "./HomePage";
import ForgotPassword from "./ForgotPassword";
import Category from "./Category";
import Post from "./Post";
import SearchResult from "./SearchResult";
import PatientBooking from './PatientBooking';
import PatientAppointmentManage from './PatientAppointmentManage';
import PatientEdit from './PatientEdit';
import HomePageLayout from './HomePageLayout';

function ProtectedLayout() {
  // Layout này bọc các route cần auth
  return <Outlet />;
}

function App() {
  const getUserRole = () => {
    try {
      const raw = localStorage.getItem('MediUser');
      if (!raw) return null;
      const user = JSON.parse(raw);
      return Number(user.role_id);
    } catch { return null; }
  };

  const userRole = getUserRole();
  const isAdmin = userRole === 1;
  const isDoctor = userRole === 2;
  const isPatient = userRole === 3;
  const isLoggedIn = userRole !== null;

  const getRedirectPath = () => {
    if (!isLoggedIn) return '/login';

    const role = getUserRole();
    switch (role) {
      case 1: return '/admin/dashboard'; // Admin
      case 2: return '/doctor/dashboard'; // Doctor
      case 3: return '/patient/dashboard'; // Patient
      default: return '/login';
    }
  };
  return (
    <div>
      <header>

      </header>


      <main>
        <Routes>
          {/* Toan homepage - start */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route element={<HomePageLayout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<LoginByEmail />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/category/:id" element={<Category />} />
            <Route path="/post/:id" element={<Post />} />
            <Route path="/search-doctor" element={<DocQuickViews />} />
            <Route path="/search" element={<SearchResult />} />
          </Route>
          {/* Toan homepage - end */}

          {/* Phan route cua Duyen - start */}
          <Route path="/patientLayout" element={<PatientLayout />} />
          <Route element={<PatientLayout />}>
            <Route path="/patientProfile" element={<PatientProfile />} />
            <Route path="/patientEdit/:id" element={<PatientEdit />} />
            <Route path="/findUDoctor" element={<DocQuickViews />} />
            <Route path="/doctorDetail/:id" element={<DoctorDetails />} />
            <Route path="/patientBooking/:id" element={<PatientBooking />} />
            <Route path="/appointmentMg" element={<PatientAppointmentManage />} />
          </Route>
          {/* Phan route cua Duyen - end */}

          {/* ===== PHẦN MỚI THÊM TỪ THUAN - START ===== */}
          {/* Admin routes - Kích hoạt từ Thuan */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="contents" element={<AdminContents />} />
            <Route path="contact-messages" element={<AdminContactMessages />} />
            <Route path="doctors" element={<AdminDoctors />} />
            <Route path="doctors/:id" element={<AdminDoctorDetail />} />
            <Route path="patients" element={<AdminPatients />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="cities" element={<AdminCities />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="appointments" element={<AdminAppointments />} />
          </Route>

          {/* Patient routes - Kích hoạt từ Thuan */}
          <Route path="/patient" element={<PatientLayout />}>
            <Route path="dashboard" element={<PatientDashboard />} />
            <Route path="profile" element={<PatientProfile />} />
            <Route path="appointments" element={<PatientAppointments />} />
          </Route>
          {/* ===== PHẦN MỚI THÊM TỪ THUAN - END ===== */}

          <Route
            element={
              <AuthProvider>
                <DoctorProvider>
                  <ProtectedLayout />
                </DoctorProvider>
              </AuthProvider>
            }
          >
            <Route path="/dashboard" element={
              <div style={{ display: 'flex', minHeight: '100vh' }}>
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <div style={{ flex: 1, overflow: 'auto' }}>
                  <DashboardLayout />
                  <div className="content-area" style={{ margin: 20 }}>
                    <Dashboard />
                  </div>
                </div>
              </div>
            } />

            <Route path="/doctorprofile" element={
              <div style={{ display: 'flex', minHeight: '100vh' }}>
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <div style={{ flex: 1, overflow: 'auto' }}>
                  <DashboardLayout />
                  <div className="content-area" style={{ margin: 20 }}>
                    <DoctorProfile />
                  </div>
                </div>
              </div>
            } />

            <Route path="/AvailabilityPage" element={
              <div style={{ display: 'flex', minHeight: '100vh' }}>
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <div style={{ flex: 1, overflow: 'auto' }}>
                  <DashboardLayout />
                  <div className="content-area" style={{ margin: 20 }}>
                    <DoctorAvailability />
                  </div>
                </div>
              </div>
            } />

            <Route path="/docappointment" element={
              <div style={{ display: 'flex', minHeight: '100vh' }}>
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <div style={{ flex: 1, overflow: 'auto' }}>
                  <DashboardLayout />
                  <div className="content-area" style={{ margin: 20 }}>
                    <AppointmentList />
                  </div>
                </div>
              </div>
            } />

            <Route path="/appointment-management" element={
              <ErrorBoundary>
                <div style={{ display: 'flex', minHeight: '100vh' }}>
                  {/* Sidebar */}
                  <Sidebar />

                  {/* Main Content */}
                  <div style={{ flex: 1, overflow: 'auto' }}>
                    <DashboardLayout />
                    <div className="content-area" style={{ margin: 20 }}>
                      <AppointmentManagement />
                    </div>
                  </div>
                </div>
              </ErrorBoundary>
            } />
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;
