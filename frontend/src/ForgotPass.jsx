import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


function ForgotPass() {
    const [formField, setFormField] = useState({
        last_name: '', first_name: '',
        phone_number: '', email: '', password: ''
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await fetch(`${API_BASE_URL}/api/user_profiles`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formField),
            });
            navigate('/api/user_profiles');
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className=" d-flex justify-content-center align-items-center p-5">
            <form onSubmit={handleSubmit}>
                <br /><br /><br />
                <div className="container mt-4 registerForm p-3">
                    <h2>Forgot your password?</h2>
                    <div>Enter your email, and we will send you a code to reset the password.</div>
                    <hr />

                    <div className="col-12 mb-3">
                        <input
                            className="form-control"
                            type="email"
                            required
                            placeholder="Email"
                        />
                    </div>
                    <br />
                    <div className="row">
                        <a className="col-6 text-primary opacity-50" href="/login">Cancel</a>
                        <a className="col-6 text-end text-primary opacity-50" href="">Send a code</a>
                    </div >

                </div >

            </form>

        </div>
    );
}

export default ForgotPass;