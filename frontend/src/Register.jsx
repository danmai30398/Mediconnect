import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function Register() {
    const [formField, setFormField] = useState({
        username: '',
        password: '',
        profile: {
            name: '',
            phone: '',
            email: '',
            address: ''
        }
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith('profile.')) {
            const key = name.split('.')[1];
            setFormField(prev => ({
                ...prev,
                profile: {
                    ...prev.profile,
                    [key]: value
                }
            }));
        } else {
            setFormField(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        // console.log('Dữ liệu gửi đi:', formField);
        try {
            await fetch(`${API_BASE_URL}/api/user`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formField),
            });

            navigate('/dashboard');
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const [showPassword, setShowPassword] = useState(false);


    return (
        <div className=" d-flex justify-content-center align-items-center">
            <form onSubmit={handleSubmit}>
            <br /><br /><br />
                <div className="container mt-4 registerForm">
                    <h2>Create an account</h2>
                    <div className="row">
                        <div className="col-12 col-md-6 mb-3">
                            <input
                                className="form-control"
                                type="text"
                                name="username"
                                value={formField.username}
                                onChange={handleChange}
                                required
                                placeholder="Nickname - unique"
                            />
                        </div>
                        <div className="col-12 col-md-6 mb-3">
                            <input
                                className="form-control"
                                type="text"
                                name="profile.name"
                                value={formField.profile.name}
                                onChange={handleChange}
                                required
                                placeholder="Your name"
                            />
                        </div>
                    </div>
                    <div className="col-12 mb-3">
                        <input
                            className="form-control"
                            type="text"
                            name="profile.address"
                            value={formField.profile.address}
                            onChange={handleChange}
                            required
                            placeholder="e.g., 123 Hau Giang, Tan Binh, Ho Chi Minh"
                        />
                    </div>
                    <div className="col-12 mb-3">
                        <input
                            className="form-control"
                            type="number"
                            name="profile.phone"
                            value={formField.profile.phone}
                            onChange={handleChange}
                            required
                            placeholder="Phone number"
                        />
                    </div>
                    <div className="col-12 mb-3">
                        <input
                            className="form-control"
                            type="email"
                            name="profile.email"
                            value={formField.profile.email}
                            onChange={handleChange}
                            required
                            placeholder="Email"
                        />
                    </div>
                    <div className="col-12 mb-3 position-relative">
                        <input
                            className="form-control "
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formField.password}
                            onChange={handleChange}
                            required
                            placeholder="Password"
                        />
                        <span
                            className="position-absolute top-50 end-0 translate-middle-y me-2"
                            style={{ cursor: "pointer" }}
                            onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
                        </span>

                    </div>

                    <div className="text-center">
                        <button type="submit" className="btn btn-primary opacity-50 rounded-0 registerButton">Sign up</button>
                    </div>
                    <br />
                    <div className="col-12 text-center">Already have an account? <a href="/login">Login</a> </div >

                </div >

            </form>

        </div>

    );
}

export default Register;