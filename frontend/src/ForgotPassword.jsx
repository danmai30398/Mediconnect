import React, { useState } from "react";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    alert(`A reset code has been sent to ${email} (demo).`);
  };

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={onSubmit}>
        <h2>Forgot your password?</h2>
        <p className="desc">Enter your email, and we will send you a code to reset the password.</p>
        <div className="line" />
        <input type="email" placeholder="Email" required value={email} onChange={e=>setEmail(e.target.value)} />
        <div className="auth-actions">
          <Link className="btn-ghost" to="/login">Cancel</Link>
          <button className="btn-primary-wide" type="submit">Send a code</button>
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;