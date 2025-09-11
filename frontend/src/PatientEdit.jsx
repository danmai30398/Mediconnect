import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function PatientEdit() {
    const { id } = useParams();
    const [formField, setFormField] = useState({
        username: '',
        password: '',
        profile: {
            name: '',
            phone: '',
            email: '',
            address: '',
            dob: '',
            gender: ''
            // image: ''
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

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/user/${id}`)
            .then(res => res.json())
            .then(data => setFormField(data))
            .catch(err => console.error("Fetch error:", err));

    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await fetch(`${API_BASE_URL}/api/user/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formField),
            });
            navigate('/patientProfile');
        } catch (error) {
            console.error("Update error:", error);
        }
    };

    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);


    return (
        <div>
            <br /><br /><br />
            <form onSubmit={handleUpdate}>
                <div className="container mt-0">
                    <h5 className="text-center">Edit your profile</h5>
                    <hr />
                    <div className="row">
                        <div className="col-12 col-md-6 mb-3">
                            <input
                                className="form-control"
                                type="text"
                                name="username"
                                value={formField?.username}
                                onChange={handleChange}
                                readOnly
                                placeholder="Nickname - unique"
                            />
                        </div>
                        <div className="col-12 col-md-6 mb-3">
                            <input
                                className="form-control"
                                type="text"
                                name="profile.name"
                                value={formField?.profile?.name}
                                onChange={handleChange}
                                required
                                placeholder="Your name"
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <input
                            className="form-control"
                            type="text"
                            name="profile.address"
                            value={formField?.profile?.address}
                            onChange={handleChange}
                            required
                            placeholder="e.g., 123 Hau Giang, Tan Binh, Ho Chi Minh"
                        />
                    </div>

                    <div className="mb-3">
                        <input
                            className="form-control"
                            type="number"
                            name="profile.phone"
                            value={formField?.profile?.phone}
                            onChange={handleChange}
                            required
                            placeholder="Phone number"
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            className="form-control"
                            type="number"
                            name="profile.phone"
                            value={formField?.profile?.gender}
                            onChange={handleChange}
                            required
                            placeholder="Gender"
                        />
                    </div>

                    <div className="row">
                        <div className="col-12 col-md-6 mb-3">
                            <input
                                className="form-control"
                                type="email"
                                name="profile.email"
                                value={formField?.profile?.email}
                                onChange={handleChange}
                                required
                                placeholder="Email"
                            />
                        </div>
                        <div className="col-12 col-md-6 mb-3">
                            <input
                                className="form-control"
                                type="date"
                                name="profile.dob"
                                value={formField?.profile?.dob}
                                onChange={handleChange}
                                readOnly
                                placeholder="Date of birth"
                            />
                        </div>
                    </div>

                    {/* <div className="row mb-3">
                        <div className="col-12 col-md-auto mb-2 mb-md-0">
                            <label htmlFor="country" className="form-label me-2">Country</label>
                            <select id="country" className="form-select d-inline-block w-auto rounded-0" required>
                                <option value="" disabled hidden>Country</option>
                                <option value="VietNam">VietNam</option>
                                <option value="India">India</option>
                                <option value="Japan">Japan</option>
                                <option value="England">England</option>
                            </select>
                        </div>
                        <div className="col-12 col-md-auto">
                            <label className="form-label me-2">Gender</label>
                            <div className="d-inline-block">
                                <input type="radio" value="Male" name="gender" className="form-check-input me-1" /> Male
                                <input type="radio" value="Female" name="gender" className="form-check-input ms-3 me-1" /> Female
                            </div>
                        </div>
                    </div> */}


                    {/* <div className="mb-3 position-relative">
                        <input
                            className="form-control "
                            type={showPassword ? "text" : "password"}
                            value={profile.password}
                            onChange={e => setProfile({ ...profile, password: e.target.value })}
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
                    <button class="btn btn-danger rounded-0" type="submit">Save changes</button>

                    <br /> <br />
                    <h5>Password Reset</h5>


                    <div className="mb-3 position-relative">
                        <input
                            className="form-control "
                            type={showNewPassword ? "text" : "password"}
                            value={profile.new_password}
                            onChange={e => setProfile({ ...profile, new_password: e.target.value })}
                            required
                            placeholder="New password"
                        />
                        <span
                            className="position-absolute top-50 end-0 translate-middle-y me-2"
                            style={{ cursor: "pointer" }}
                            onClick={() => setShowNewPassword(!showNewPassword)}>
                            {showNewPassword ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
                        </span>
                    </div>

                    <div className="mb-3 position-relative">
                        <input
                            className="form-control "
                            type={showConfirmNewPassword ? "text" : "password"}
                            value={profile.confirm_new_password}
                            onChange={e => setProfile({ ...profile, confirm_new_password: e.target.value })}
                            required
                            placeholder="Confirm new password"
                        />
                        <span
                            className="position-absolute top-50 end-0 translate-middle-y me-2"
                            style={{ cursor: "pointer" }}
                            onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}>
                            {showConfirmNewPassword ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
                        </span>
                    </div> */}

                    <button class="btn btn-danger rounded-0" type="submit">Reset Password</button>
                </div>
            </form>


        </div>
    );
}

export default PatientEdit;