import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import PatientHeader from './PatientHeader';
import PatientWelcomePage from './PatientWelcomePage';

function PatientLayout () {
  // const [showWelcome, setShowWelcome] = useState();
  const [showWelcome, setShowWelcome] = useState(() => {
    const saved = localStorage.getItem('showWelcome');
    return saved === 'false' ? false : true;
  });
  
  const handleNavClick = () => {
    setShowWelcome(false);
    localStorage.setItem('showWelcome', 'false');
  };
  console.log('showWelcome: ', showWelcome);
  return (
    <>
      <PatientHeader onNavClick={handleNavClick} />
      <main style={{ padding: '1rem' }}>
        {showWelcome && <PatientWelcomePage /> }
        <Outlet />
      </main>
    </>
  );
};

export default PatientLayout;
