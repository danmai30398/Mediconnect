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
import PatientBooking from './PatientBooking';
import PatientAppointmentManage from './PatientAppointmentManage';
import ForgotPass from './ForgotPass';
import PatientEdit from './PatientEdit';

function App() {
  return (
    <div>
      <header>
        
      </header>

      <main>
        <Routes>
          <Route>
          <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login_phone" element={<LoginByPhone />} />
            <Route path="/login" element={<LoginByEmail />} />
            <Route path="/forgotPass" element={<ForgotPass />} />
          </Route>

          <Route element={<PatientLayout/>}>
            <Route path="/patientPage" element={<PatientHeader />} />
            <Route path="/patientProfile" element={<PatientProfile />} />
            <Route path="/patientEdit/:id" element={<PatientEdit />} />
            <Route path="/findUDoctor" element={<DocQuickViews />} />
            <Route path="/doctorDetail/:id" element={<DoctorDetails />} />
            <Route path="/patientBooking/:id" element={<PatientBooking />} />
            <Route path="/appointmentMg" element={<PatientAppointmentManage />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;
