import { Outlet } from 'react-router-dom';
import PatientHeader from './PatientHeader';

const PatientLayout = () => {
  return (
    <>
      <PatientHeader />
      <main style={{ padding: '1rem' }}>
        <Outlet />
      </main>
    </>
  );
};

export default PatientLayout;
