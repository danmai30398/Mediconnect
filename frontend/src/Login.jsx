import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    // demo: set token
    localStorage.setItem("token", "demo");
    navigate("/");
  };

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={onSubmit}>
        <h2>Sign in</h2>
        <p className="desc">Access your account to continue.</p>
        <div className="line" />
        <input type="email" placeholder="Email" required value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" placeholder="Password" required value={pwd} onChange={e=>setPwd(e.target.value)} />
        <div className="auth-actions">
          <Link className="btn-ghost" to="/forgot-password">Forgot password?</Link>
          <button className="btn-primary-wide" type="submit">Login</button>
        </div>
        <p style={{marginTop:10}}>No account? <Link to="/register">Create one</Link></p>
      </form>
    </div>
  );
}

export default Login;