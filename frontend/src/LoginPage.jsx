// LoginPage.jsx
import { useState } from "react";
import axios from "axios";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:8000/api/login", {
        username,
        password,
      });
      localStorage.setItem("authToken", res.data.token);
      alert("Đăng nhập thành công!");
    } catch (err) {
      alert("Sai tài khoản hoặc mật khẩu");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginPage;
