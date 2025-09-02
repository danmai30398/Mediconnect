// DoctorContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const DoctorContext = createContext();

export const DoctorProvider = ({ children }) => {
  const [doctor, setDoctor] = useState(null);

  const fetchDoctor = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const res = await axios.get("http://localhost:8000/api/doctor/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctor(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy thông tin bác sĩ", err);
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
