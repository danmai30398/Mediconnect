import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import { useDoctor } from "./DoctorContext";

import {
  FaUser, FaEnvelope, FaGraduationCap, FaBriefcase, FaPhone,
  FaStethoscope, FaCity, FaVenusMars, FaBirthdayCake, FaIdCard,
} from "react-icons/fa";

const DoctorProfile = () => {
  const { doctor, fetchDoctor } = useDoctor();
  const [localDoctor, setLocalDoctor] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (doctor) setLocalDoctor(doctor);
  }, [doctor]);

  const handleChange = (e) => {
    setLocalDoctor({ ...localDoctor, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const validateDoctorForm = () => {
    const { name, email, phone, gender, dob } = localDoctor;
    const newErrors = {};

    if (!name || name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format.";
    }

    if (phone && !/^\d{8,15}$/.test(phone)) {
      newErrors.phone = "Phone must be 8–15 digits.";
    }

    if (!gender) {
      newErrors.gender = "Please select a gender.";
    }

    if (!dob) {
      newErrors.dob = "Date of birth is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateDoctorForm()) return;

    const formData = new FormData();
    Object.entries(localDoctor).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    if (selectedFile) formData.append("image", selectedFile);

    try {
      await axios.post("http://localhost:8000/api/doctor/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await fetchDoctor();
      setIsEditing(false);
      setErrors({});
      alert("Profile updated.");
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  return (
    <div className="doctor-profile-container">
      <div className="left-panel">
        <img
          src={preview || localDoctor.image || "/default-avatar.jpg"}
          alt="Avatar"
          className="profile-avatar"
        />
        {isEditing && (
          <input type="file" accept="image/*" onChange={handleFileChange} />
        )}
        <h2>{localDoctor.name}</h2>
        <p>{localDoctor.specialization}</p>
      </div>

      <div className="right-panel">
        <h3>Doctor Information</h3>

        {/* ID - Read only */}
        <div className="info-row">
          <label><FaIdCard /> ID:</label>
          <span>{localDoctor.id}</span>
        </div>

        {/* Name */}
        <div className="info-row">
          <label><FaUser /> Name:</label>
          {isEditing ? (
            <>
              <input name="name" value={localDoctor.name || ""} onChange={handleChange} />
              {errors.name && <div className="error">{errors.name}</div>}
            </>
          ) : (
            <span>{localDoctor.name}</span>
          )}
        </div>

        {/* Email */}
        <div className="info-row">
          <label><FaEnvelope /> Email:</label>
          {isEditing ? (
            <>
              <input name="email" value={localDoctor.email || ""} onChange={handleChange} />
              {errors.email && <div className="error">{errors.email}</div>}
            </>
          ) : (
            <span>{localDoctor.email}</span>
          )}
        </div>

        {/* Qualification */}
        <div className="info-row">
          <label><FaGraduationCap /> Qualification:</label>
          {isEditing ? (
            <input name="qualification" value={localDoctor.qualification || ""} onChange={handleChange} />
          ) : (
            <span>{localDoctor.qualification}</span>
          )}
        </div>

        {/* Experience */}
        <div className="info-row">
          <label><FaBriefcase /> Experience:</label>
          {isEditing ? (
            <input name="experience" value={localDoctor.experience || ""} onChange={handleChange} />
          ) : (
            <span>{localDoctor.experience}</span>
          )}
        </div>

        {/* Phone */}
        <div className="info-row">
          <label><FaPhone /> Phone:</label>
          {isEditing ? (
            <>
              <input name="phone" value={localDoctor.phone || ""} onChange={handleChange} />
              {errors.phone && <div className="error">{errors.phone}</div>}
            </>
          ) : (
            <span>{localDoctor.phone}</span>
          )}
        </div>

        {/* Specialization */}
        <div className="info-row">
          <label><FaStethoscope /> Specialization:</label>
          {isEditing ? (
            <input name="specialization" value={localDoctor.specialization || ""} onChange={handleChange} />
          ) : (
            <span>{localDoctor.specialization}</span>
          )}
        </div>

        {/* City */}
        <div className="info-row">
          <label><FaCity /> City:</label>
          {isEditing ? (
            <input name="city" value={localDoctor.city || ""} onChange={handleChange} />
          ) : (
            <span>{localDoctor.city}</span>
          )}
        </div>

        {/* Gender */}
        <div className="info-row">
          <label><FaVenusMars /> Gender:</label>
          {isEditing ? (
            <>
              <select name="gender" value={localDoctor.gender || ""} onChange={handleChange}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {errors.gender && <div className="error">{errors.gender}</div>}
            </>
          ) : (
            <span>{localDoctor.gender}</span>
          )}
        </div>

        {/* Date of Birth */}
        <div className="info-row">
          <label><FaBirthdayCake /> Date of Birth:</label>
          {isEditing ? (
            <>
              <input name="dob" type="date" value={localDoctor.dob || ""} onChange={handleChange} />
              {errors.dob && <div className="error">{errors.dob}</div>}
            </>
          ) : (
            <span>{localDoctor.dob}</span>
          )}
        </div>

        {/* Save / Edit button */}
        <button className="edit-btn" onClick={() => (isEditing ? handleSave() : setIsEditing(true))}>
          {isEditing ? "Save" : "Edit"}
        </button>
      </div>
    </div>
  );
};

export default DoctorProfile;
