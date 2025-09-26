// src/components/ScrollToTop.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }); // Scrolls to top with smooth animation
  }, [location]); // Re-run effect whenever the location changes

  return <>{children}</>;
};

export default ScrollToTop;