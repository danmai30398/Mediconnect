import './App.css';
import Dashboard from './Dashboard';
import DocQuickViews from './DocQuickViews';
import DoctorDetails from './DoctorDetails';
import LoginByEmail from './LoginByEmail';
import PatientHeader from './PatientHeader';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
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
import DoctorDashboard from './DoctorDashboard';
import DoctorLayout from './DoctorLayout';
import DoctorHeader from './DoctorHeader';
import DoctorProfile from './DoctorProfile';
import PatientDashboard from './PatientDashboard';
import PatientAppointments from './PatientAppointments';

import React from "react";

import TopBar from "./TopBar";
import HeaderNav from "./HeaderNav";
import Footer from "./Footer";
import BackToTop from "./BackToTop";

import HomePage from "./HomePage";
import Login from "./Login";
import ForgotPassword from "./ForgotPassword";
import Category from "./Category";
import Post from "./Post";
import SearchResult from "./SearchResult";
import './App.css';
import PatientBooking from './PatientBooking';
import PatientAppointmentManage from './PatientAppointmentManage';
import PatientEdit from './PatientEdit';
import PatientWelcomePage from './PatientWelcomePage';
import HomePageLayout from './HomePageLayout';

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
          {/* <Route path="/" element={<HomePageLayout />} /> */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route element={<HomePageLayout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<LoginByEmail />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/category/:id" element={<Category />} />
            <Route path="/post/:id" element={<Post />} />
            <Route path="/search" element={<SearchResult />} />
          </Route>
          {/* Toan homepage - end */}

          <Route>
            {/* <Route path="/" element={<HomePage />} /> */}
            {/* <Route path="/dashboard" element={<Dashboard />} /> */}
            {/* <Route path="/register" element={<Register />} /> */}
            {/* <Route path="/login_phone" element={<LoginByPhone />} /> */}
            {/* <Route path="/login" element={<LoginByEmail />} /> */}
            {/* <Route path="/forgotPass" element={<ForgotPass />} /> */}
          </Route>

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


          {/* Public routes */}
          {/* <Route>
            <Route path="/" element={<Navigate to={getRedirectPath()} replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login_phone" element={<LoginByPhone />} />
            <Route path="/login" element={<LoginByEmail />} />
            <Route path="/forgotPass" element={<ForgotPass />} />
            <Route path="/register" element={<Register />} />
            <Route path="/findUDoctor" element={<DocQuickViews />} />
            <Route path="/doctorDetail/:id" element={<DoctorDetails />} />
          </Route> */}


          {/* Admin routes */}
          {/* <Route path="/admin" element={<AdminLayout />}>
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
          </Route> */}

          {/* Doctor routes */}
          {/* <Route path="/doctor" element={<DoctorLayout />}>
            <Route path="dashboard" element={<DoctorDashboard />} />
            <Route path="profile" element={<DoctorProfile />} />
          </Route> */}

          {/* Patient routes */}
          {/* <Route path="/patient" element={<PatientLayout />}>
            <Route path="dashboard" element={<PatientDashboard />} />
            <Route path="profile" element={<PatientProfile />} />
            <Route path="appointments" element={<PatientAppointments />} />
          </Route> */}
        </Routes>

      </main>
    </div>
  );
}

export default App;