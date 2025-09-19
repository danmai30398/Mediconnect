import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDoctor } from "./DoctorContext";
import { useAuth } from "./AuthContext";
import { Button, Form, Spinner, Alert, Row, Col } from "react-bootstrap";
import {
  FaUser, FaEnvelope, FaGraduationCap, FaBriefcase, FaPhone,
  FaStethoscope, FaCity, FaVenusMars, FaBirthdayCake, FaIdCard,
} from "react-icons/fa";

const DoctorProfile = () => {
  const { doctor, updateDoctor } = useDoctor();
  const { user, updateUser } = useAuth();
  const [localDoctor, setLocalDoctor] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch cities on component mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/cities');
        setCities(response.data);
      } catch (error) {
        console.error('Failed to fetch cities:', error);
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    if (doctor) {
      setLocalDoctor({
        ...doctor,
        city_id: doctor.city_id || doctor.city?.city_id || "",
      });
    }
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

    setLoading(true);
    const formData = new FormData();
    Object.entries(localDoctor).forEach(([key, value]) => {
      if (key === "city_id") {
        const cityId = parseInt(value);
        if (!isNaN(cityId)) {
          formData.append("city_id", cityId);
        }
      } else if (value !== null && value !== undefined && value !== "") {
        formData.append(key, value);
      }
    });

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    try {
      const response = await axios.post("http://localhost:8000/api/doctor/update", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      updateDoctor(response.data);
      updateUser(response.data);

      setPreview(null);
      setSelectedFile(null);
      setIsEditing(false);
      setErrors({});
      setSuccessMsg("Profile updated successfully.");
      window.location.reload();
    } catch (err) {
      console.error("Update failed", err.response?.data || err);
      setErrors(err.response?.data?.errors || {});
      setSuccessMsg("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="doctor_profile_container">
      <Row className="mb-4">
        <div className="doctor_profile_left-panel">
          <img
            src={preview || (doctor?.image ? `http://localhost:8000${doctor.image}` : "/default-avatar.jpg")}
            alt="Avatar"
            className="doctor_profile_profile-avatar"
            onClick={isEditing ? () => document.getElementById('avatar-upload').click() : null}
          />
          {isEditing && (
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              id="avatar-upload"
              style={{ display: 'none' }} // Ẩn input file
            />
          )}
          <h2>{localDoctor.name}</h2>
          <p>{localDoctor.specialization}</p>
        </div>

      </Row>

      <div className="doctor_profile_right_panel">
        <h3>Doctor Information</h3>
        {successMsg && <Alert variant="success">{successMsg}</Alert>}

        <Form>
          {/* Form Group for each field */}
          <Form.Group className="doctor_profile_info-row">
            <Form.Label><FaIdCard /> ID:</Form.Label>
            <Form.Control plaintext readOnly value={localDoctor.doctor_id} />
          </Form.Group>

          <Form.Group className="doctor_profile_info-row">
            <Form.Label><FaUser /> Name:</Form.Label>
            {isEditing ? (
              <>
                <Form.Control
                  name="name"
                  value={localDoctor.name || ""}
                  onChange={handleChange}
                  isInvalid={!!errors.name}
                />
                <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
              </>
            ) : (
              <Form.Control plaintext readOnly value={localDoctor.name} />
            )}
          </Form.Group>

          <Form.Group className="doctor_profile_info-row">
            <Form.Label><FaEnvelope /> Email:</Form.Label>
            {isEditing ? (
              <>
                <Form.Control
                  name="email"
                  value={localDoctor.email || ""}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
              </>
            ) : (
              <Form.Control plaintext readOnly value={localDoctor.email} />
            )}
          </Form.Group>

          <Form.Group className="doctor_profile_info-row">
            <Form.Label><FaGraduationCap /> Qualification:</Form.Label>
            {isEditing ? (
              <Form.Control
                name="qualification"
                value={localDoctor.qualification || ""}
                onChange={handleChange}
              />
            ) : (
              <Form.Control plaintext readOnly value={localDoctor.qualification} />
            )}
          </Form.Group>

          <Form.Group className="doctor_profile_info-row">
            <Form.Label><FaBriefcase /> Experience:</Form.Label>
            {isEditing ? (
              <Form.Control
                name="experience"
                value={localDoctor.experience || ""}
                onChange={handleChange}
              />
            ) : (
              <Form.Control plaintext readOnly value={localDoctor.experience} />
            )}
          </Form.Group>

          <Form.Group className="doctor_profile_info-row">
            <Form.Label><FaPhone /> Phone:</Form.Label>
            {isEditing ? (
              <>
                <Form.Control
                  name="phone"
                  value={localDoctor.phone || ""}
                  onChange={handleChange}
                  isInvalid={!!errors.phone}
                />
                <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
              </>
            ) : (
              <Form.Control plaintext readOnly value={localDoctor.phone} />
            )}
          </Form.Group>

          <Form.Group className="doctor_profile_info-row">
            <Form.Label><FaStethoscope /> Specialization:</Form.Label>
            {isEditing ? (
              <Form.Control
                name="specialization"
                value={localDoctor.specialization || ""}
                onChange={handleChange}
              />
            ) : (
              <Form.Control plaintext readOnly value={localDoctor.specialization} />
            )}
          </Form.Group>

          <Form.Group className="doctor_profile_info-row">
            <Form.Label><FaCity /> City:</Form.Label>
            {isEditing ? (
              <Form.Control
                as="select"
                name="city_id"
                value={localDoctor.city_id || ""}
                onChange={handleChange}
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city.city_id} value={city.city_id}>
                    {city.city_name}
                  </option>
                ))}
              </Form.Control>
            ) : (
              <Form.Control plaintext readOnly value={localDoctor.city?.city_name || "N/A"} />
            )}
          </Form.Group>

          <Form.Group className="doctor_profile_info-row">
            <Form.Label><FaVenusMars /> Gender:</Form.Label>
            {isEditing ? (
              <>
                <Form.Control
                  as="select"
                  name="gender"
                  value={localDoctor.gender || ""}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </Form.Control>
                {errors.gender && <div className="error">{errors.gender}</div>}
              </>
            ) : (
              <Form.Control plaintext readOnly value={localDoctor.gender} />
            )}
          </Form.Group>

          <Form.Group className="doctor_profile_info-row">
            <Form.Label><FaBirthdayCake /> Date of Birth:</Form.Label>
            {isEditing ? (
              <>
                <Form.Control
                  name="dob"
                  type="date"
                  value={localDoctor.dob || ""}
                  onChange={handleChange}
                  isInvalid={!!errors.dob}
                />
                <Form.Control.Feedback type="invalid">{errors.dob}</Form.Control.Feedback>
              </>
            ) : (
              <Form.Control plaintext readOnly value={localDoctor.dob} />
            )}
          </Form.Group>

          <Form.Group className="doctor_profile_info-row">
            <Form.Label><FaIdCard /> Description:</Form.Label>
            {isEditing ? (
              <Form.Control
                as="textarea"
                name="description"
                value={localDoctor.description || ""}
                onChange={handleChange}
                rows={3}
              />
            ) : (
              <Form.Control plaintext readOnly value={localDoctor.description} />
            )}
          </Form.Group>

          <Button
            variant="primary"
            type="button"
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" /> Saving...
              </>
            ) : (
              isEditing ? "Save" : "Edit"
            )}
          </Button>

          {isEditing && (
            <Button
              variant="secondary"
              type="button"
              onClick={() => {
                setIsEditing(false);
                setPreview(null);
                setSelectedFile(null);
                setErrors({});
                setLocalDoctor({
                  ...doctor,
                  city_id: doctor.city_id || doctor.city?.city_id || "",
                });
              }}
              disabled={loading}
              className="ml-2"
            >
              Cancel
            </Button>
          )}
        </Form>
      </div>
    </div>
  );
};

export default DoctorProfile;
