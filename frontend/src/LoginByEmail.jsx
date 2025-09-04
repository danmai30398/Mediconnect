import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function LoginByEmail() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`${API_BASE_URL}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                cache: "no-store",
            });

            if (!res.ok) {
                setError("Incorrect Email or password!")
                return;
            }
            console.log("data: ", res); //debug status and object response

            const data = await res.json();
            console.log("Login success:", data);
            if (data.status === "success") {
                localStorage.setItem("MediUser", JSON.stringify(data.user)); //luu user
                // navigate to Patient page 
                if(data.user.role === 3){
                    navigate("/patientPage");
                }    
                // navigate to Doctor page 

                // navigate to Adimin page 
            }

            
        } catch (err) {
            console.error("Fetch error:", err); // check if fetch fail 
            alert("Error logging in");
        }
    };

    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className=" d-flex justify-content-center align-items-center">
            <form onSubmit={handleSubmit}>
            <br /><br /><br />
                <div className="container mt-4 registerForm">
                    <h2>Login to your account</h2>
                    <div className="row mb-3">
                        <div className="email_lg email_lg1 col-6"><a href="/login" className="text-center email_edit" >Email</a></div>
                        <div className="phone_lg col-6"><a href="/login_phone" className="text-center phone_edit">Phone</a></div>
                    </div>
                    <div className="col-12 text-center"><span className="text-danger opacity-50">{error}</span></div>
                    <div className="col-12 mb-3">
                        <input
                            className="form-control"
                            type="email"
                            onChange={e => setEmail(e.target.value)}
                            required
                            placeholder="Email"
                        />
                    </div>
                    <div className="col-12 mb-3 position-relative">
                        <input
                            className="form-control "
                            type={showPassword ? "text" : "password"}
                            onChange={e => setPassword(e.target.value)}
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
                        <button type="submit" className="btn btn-primary opacity-50 rounded-0 registerButton" >Login</button>
                    </div>
                    <br />
                    <div className="row">
                        <a className="col-6 text-primary opacity-50" href="/register">Sign up</a>
                        <a className="col-6 text-end text-primary opacity-50" href="/forgotPass">Forgot password?</a>
                    </div >
                </div >
            </form>
        </div>
    );
}

export default LoginByEmail;