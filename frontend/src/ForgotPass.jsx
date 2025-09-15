import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { apiService } from "./services/apiService";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


function ForgotPass() {
    const [formField, setFormField] = useState({
        email: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormField(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        
        try {
            // Sử dụng apiService để gửi yêu cầu reset password
            const response = await apiService.forgotPassword({ email: formField.email });
            
            if (response.ok) {
                setMessage('Password reset code sent to your email!');
            } else {
                setMessage('Error sending reset code. Please try again.');
            }
        } catch (error) {
            console.error("Error:", error);
            setMessage('Error sending reset code. Please try again.');
        } finally {
            setLoading(false);
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

                    {message && (
                        <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'}`}>
                            {message}
                        </div>
                    )}

                    <div className="col-12 mb-3">
                        <input
                            className="form-control"
                            type="email"
                            name="email"
                            value={formField.email}
                            onChange={handleInputChange}
                            required
                            placeholder="Email"
                        />
                    </div>
                    <br />
                    <div className="row">
                        <Link className="col-6 text-primary opacity-50" to="/login">Cancel</Link>
                        <button 
                            type="submit" 
                            className="col-6 text-end text-primary opacity-50 btn btn-link p-0"
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Send a code'}
                        </button>
                    </div >

                </div >

            </form>

        </div>
    );
}

export default ForgotPass;
