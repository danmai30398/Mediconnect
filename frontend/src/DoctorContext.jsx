import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const DoctorContext = createContext();

export const DoctorProvider = ({ children }) => {
  const [doctor, setDoctor] = useState(null);

  const fetchDoctor = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/doctor/me");
      setDoctor(res.data);
    } catch (err) {
      console.error("Failed to fetch doctor info", err);
    }
  };

  useEffect(() => {
    fetchDoctor();
  }, []);

  return (
    <DoctorContext.Provider value={{ doctor, setDoctor, fetchDoctor }}>
      {children}
    </DoctorContext.Provider>
  );
};

export const useDoctor = () => useContext(DoctorContext);
