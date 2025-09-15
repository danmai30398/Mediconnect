import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function PatientEdit() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('MediUser'));
    const id = user?.id;

    //fetch current profile
    const [formField, setFormField] = useState();
    useEffect(() => {
        fetch(`${API_BASE_URL}/api/user/${id}`)
            .then(res => res.json())
            .then(data => setFormField(data))
            .catch(err => console.error("Fetch error:", err));

    }, [id]);

    const [newPass, setNewPass] = useState({
        new_pass: '',
        confirm_new_pass: ''
    });

    const fileInputRef = useRef(null);
    const [previewImage, setPreviewImage] = useState();
    const [avatar, setAvatar] = useState();

    const handleUpload = (e) => {
        const file = e.target.files[0];
        setAvatar(file);
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewImage(url);
            console.log('previewImage: ', URL.createObjectURL(file));
            console.log('previewImage2: ', url);
        }

        formField.patient.image = file;
        console.log('Hinh up len: ', file);

    }

    //validate username
    const [usernameData, setUsernameData] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [isChecking, setIsChecking] = useState(false);


    const checkUsername = async () => {
        console.log('formField.user.username: ', formField.user.username);
        console.log('Id: ', user?.id);
        try {
            const res = await fetch(`${API_BASE_URL}/api/check-username?username=${formField.username}&userId=${id}`);
            console.log('res: ', res);

            const data = await res.json();
            setUsernameData(data);
            console.log('data: ', data);

        }
        catch (err) {
            setUsernameError('Error checking username');
        } finally {
            setIsChecking(false);
        }
    };

    useEffect(() => {
        if (usernameData?.exists === true) {
            setUsernameError('Username is already taken');
        } else {
            setUsernameError('');
        }
    }, [usernameData]);


    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith('patient.')) {
            const key = name.split('.')[1];
            setFormField(prev => ({
                ...prev,
                patient: {
                    ...prev.patient,
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

    const handleChange2 = (e) => {
        const { name, value } = e.target;

        setNewPass(prev => ({
            ...prev,
            [name]: value,
        }));

        //cap nhat new password
        if (name === 'new_pass') {
            setFormField(prev => ({
                ...prev,
                password: value,
            }));
        }
    };


    const handleUpdate = async (e) => {
        e.preventDefault();
        if (newPass.new_pass !== newPass.confirm_new_pass) {
            alert("Passwords do not match.");
            return;
        }
        if (usernameError) {
            alert("Username is already taken.");
            return;
        }
        if (!formField.username.trim()) {
            alert("Please fill in the username.");
            return;
        }
        if (!formField.patient.name.trim()) {
            alert("Please fill in your name.");
            return;
        }
        if (!formField.patient.address.trim()) {
            alert("Please fill in the address.");
            return;
        }
        const formData = new FormData();
        formData.append('username', formField.username);
        formData.append('password', formField.password);
        formData.append('patient[name]', formField.patient.name);
        formData.append('patient[dob]', formField.patient.dob);
        formData.append('patient[address]', formField.patient.address);
        formData.append('patient[gender]', formField.patient.gender);
        if (avatar) {
            formData.append('patient[image]', avatar);
        }
        // console.log('image: ', avatar);

        formData.append('_method', 'PUT');
        try {
            const res = await fetch(`${API_BASE_URL}/api/user/${id}`, {
                method: 'POST',
                headers: { 'Accept': 'application/json', },
                body: formData,
            });
            const data = await res.json();
            console.log('data sau khi sua: ', data);
            navigate('/patientProfile');

        } catch (error) {
            console.error("Update error:", error);
        }
    };

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);


    return (
        <div>
            <br /><br /><br />
            <form onSubmit={handleUpdate}>
                <div className="container mt-0">
                    <h5 className="text-center">Edit your profile</h5>
                    <hr />
                    <div className="text-center mb-3">
                        <input
                            type="file"
                            name='image'
                            accept="image/*"
                            onChange={handleUpload}
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                        />
                        {previewImage ?
                            (<img src={previewImage} alt="Existing" width="200"
                                style={{ width: "150px", height: "auto" }}
                                className="rounded-circle btn"
                                onClick={() => fileInputRef.current.click()}
                            />) :
                            (<img
                                src={formField?.patient?.image ? `${API_BASE_URL}/storage/avatars/${formField.patient.image}` : `${process.env.PUBLIC_URL}/Images/Unknown_person.jpg`}
                                className="rounded-circle btn"
                                alt=""
                                style={{ width: "150px", height: "auto" }}
                                onClick={() => fileInputRef.current.click()}
                            />)}
                    </div>
                    <div className="row">
                        <div className="col-12 col-md-6 mb-3">
                            <input
                                className="form-control"
                                type="text"
                                name="username"
                                value={formField?.username}
                                onChange={handleChange}
                                placeholder="Nickname - unique"
                                required
                                onBlur={checkUsername}
                            />
                            {usernameError ? <div className="text-danger">{usernameError}</div> : ''}
                            {isChecking && <div className="form-text text-muted">Checking...</div>}
                        </div>
                        <div className="col-12 col-md-6 mb-3">
                            <input
                                className="form-control"
                                type="text"
                                name="patient.name"
                                value={formField?.patient?.name}
                                onChange={handleChange}
                                required
                                placeholder="Name"
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <input
                            className="form-control"
                            type="text"
                            name="patient.address"
                            value={formField?.patient?.address}
                            onChange={handleChange}
                            required
                            placeholder="e.g., 123 Hau Giang, Tan Binh, Ho Chi Minh"
                        />
                    </div>

                    <div className="mb-3">
                        <input
                            className="form-control"
                            type="number"
                            name="patient.phone"
                            value={formField?.patient?.phone}
                            onChange={handleChange}
                            readOnly
                            placeholder="Phone number"
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            className="form-control"
                            type="email"
                            name="patient.email"
                            value={formField?.patient?.email}
                            onChange={handleChange}
                            readOnly
                            placeholder="Email"
                        />
                    </div>

                    <div className="row align-items-center">
                        <div className="col-12 col-md-6 mb-3">
                            <span className="me-4">Gender:</span>
                            <label>
                                Male
                                <input
                                    className=" ms-2 me-4"
                                    type="radio"
                                    name="patient.gender"
                                    value='Male'
                                    checked={formField?.patient?.gender === 'Male'}
                                    onChange={handleChange}
                                />
                            </label>
                            <label>
                                Female
                                <input
                                    className=" ms-2 me-4"
                                    type="radio"
                                    name="patient.gender"
                                    value='Female'
                                    checked={formField?.patient?.gender === 'Female'}
                                    onChange={handleChange}
                                />
                            </label>
                            <label>
                                Other
                                <input
                                    className=" ms-2 me-4"
                                    type="radio"
                                    name="patient.gender"
                                    value='Other'
                                    checked={formField?.patient?.gender === 'Other'}
                                    onChange={handleChange}
                                />
                            </label>
                        </div>

                        <label className="col-7 col-md-3 mb-3 text-end">Date of birth:</label>
                        <div className="col-4 col-md-3 mb-3">
                            <input
                                className="form-control"
                                type="date"
                                name="patient.dob"
                                value={formField?.patient?.dob}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <br />
                    <h5>Want to change password?</h5>
                    {newPass.confirm_new_pass &&
                        newPass.confirm_new_pass !== newPass.new_pass && (
                            <div className="text-danger mt-1">Passwords do not match</div>
                        )}
                    <div className="mb-3 position-relative">
                        <input
                            className="form-control "
                            type={showNewPassword ? "text" : "password"}
                            name="new_pass"
                            value={newPass.new_pass}
                            onChange={handleChange2}
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
                            name="confirm_new_pass"
                            value={newPass.confirm_new_pass}
                            onChange={handleChange2}
                            placeholder="Confirm new password"
                        />
                        <span
                            className="position-absolute top-50 end-0 translate-middle-y me-2"
                            style={{ cursor: "pointer" }}
                            onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}>
                            {showConfirmNewPassword ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
                        </span>
                    </div>

                    <div className="text-end ">
                        <button className="btn btn-light rounded" type="submit">Save changes</button>
                        <button className="btn btn-light rounded" type="submit" onClick={() => { navigate(`/patientProfile`) }}>Cancel</button>
                    </div>

                </div>
            </form>
        </div>
    );
}

export default PatientEdit;