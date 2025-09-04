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
    <div>
      <header>
        
      </header>

      <main>
        <Routes>
          <Route>
          <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login_phone" element={<LoginByPhone />} />
            <Route path="/login" element={<LoginByEmail />} />
            <Route path="/forgotPass" element={<ForgotPass />} />

          </Route>
          <Route element={<PatientLayout/>}>
            <Route path="/patientPage" element={<PatientHeader />} />
            <Route path="/patientProfile" element={<PatientProfile />} />
            <Route path="/register" element={<Register />} />
            <Route path="/findUDoctor" element={<DocQuickViews />} />
            <Route path="/doctorDetail/:id" element={<DoctorDetails />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;
