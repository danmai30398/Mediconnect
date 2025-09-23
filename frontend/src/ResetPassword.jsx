import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { apiService } from "./services/apiService";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    password_confirmation: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (formData.password !== formData.password_confirmation) {
      setError("Confirm password does not match");
      setLoading(false);
      return;
    }

    try {
      const response = await apiService.resetPassword({
        token: token,
        password: formData.password,
        password_confirmation: formData.password_confirmation
      });
      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(data.message || "An error occurred");
      }
    } catch (err) {
      setError("Can't connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={onSubmit}>
        <h2>Reset password</h2>
        <p className="desc">Enter your new password.</p>
        <div className="line" />
        
        {message && (
          <div className="alert alert-success" style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb', borderRadius: '4px' }}>
            {message}
          </div>
        )}
        
        {error && (
          <div className="alert alert-danger" style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb', borderRadius: '4px' }}>
            {error}
          </div>
        )}

        <input 
          type="password" 
          name="password"
          placeholder="New password" 
          required 
          value={formData.password} 
          onChange={handleChange}
          disabled={loading}
          minLength="6"
        />
        
        <input 
          type="password" 
          name="password_confirmation"
          placeholder="Confirm new password" 
          required 
          value={formData.password_confirmation} 
          onChange={handleChange}
          disabled={loading}
          minLength="6"
        />
        
        <div className="auth-actions">
          <Link className="btn-ghost" to="/login">Cancel</Link>
          <button 
            className="btn-primary-wide" 
            type="submit" 
            disabled={loading}
          >
            {loading ? "Processing..." : "Reset password"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ResetPassword;
