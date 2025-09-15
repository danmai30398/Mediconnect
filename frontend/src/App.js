
import './App.css';
import React from "react";
import { Routes, Route } from "react-router-dom";

import TopBar from "./TopBar";
import HeaderNav from "./HeaderNav";
import Footer from "./Footer";
import BackToTop from "./BackToTop";

import HomePage from "./HomePage";
import Login from "./Login";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import Category from "./Category";
import Post from "./Post";
import SearchResult from "./SearchResult";
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
import ForgotPass from './FogotPass';

function App() {
  return (
    <>
      <TopBar />
      <HeaderNav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />

       
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/category/:id" element={<Category />} />
        <Route path="/post/:id" element={<Post />} />
        <Route path="/search" element={<SearchResult />} />
      </Routes>

      <Footer />
      <BackToTop />
    </>
  );
}

export default App;
