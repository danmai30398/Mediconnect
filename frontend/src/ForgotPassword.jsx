import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiService } from "./services/apiService";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [resetToken, setResetToken] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await apiService.forgotPassword({ email });
      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        // Lưu token để sử dụng cho button
        if (data.token) {
          setResetToken(data.token);
          // Tự động redirect sang trang reset password với token
          setTimeout(() => {
            navigate(`/reset-password/${data.token}`);
          }, 2000); // Chờ 2 giây để user đọc thông báo
        }
      } else {
        setError(data.message || "Có lỗi xảy ra");
      }
    } catch (err) {
      setError("Không thể kết nối đến server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={onSubmit}>
        <h2>Quên mật khẩu?</h2>
        <p className="desc">Nhập email của bạn, chúng tôi sẽ gửi mã reset mật khẩu.</p>
        <div className="line" />
        
        {message && (
          <div className="alert alert-success" style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb', borderRadius: '4px' }}>
            <div>{message}</div>
            <div style={{ marginTop: '10px', fontSize: '14px', fontStyle: 'italic' }}>
              Đang chuyển hướng đến trang đặt lại mật khẩu...
            </div>
            {resetToken && (
              <div style={{ marginTop: '10px' }}>
                <button 
                  type="button"
                  onClick={() => navigate(`/reset-password/${resetToken}`)}
                  style={{ 
                    padding: '8px 16px', 
                    backgroundColor: '#28a745', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px', 
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Chuyển ngay đến trang đặt lại mật khẩu
                </button>
              </div>
            )}
          </div>
        )}
        
        {error && (
          <div className="alert alert-danger" style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb', borderRadius: '4px' }}>
            {error}
          </div>
        )}

        <input 
          type="email" 
          placeholder="Email" 
          required 
          value={email} 
          onChange={e => setEmail(e.target.value)}
          disabled={loading}
        />
        <div className="auth-actions">
          <Link className="btn-ghost" to="/login">Hủy</Link>
          <button 
            className="btn-primary-wide" 
            type="submit" 
            disabled={loading}
          >
            {loading ? "Đang gửi..." : "Gửi mã reset"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;