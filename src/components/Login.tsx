// src/components/Login.tsx
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { login,logout } from "../features/authSlice";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const { loading, error, token } = useAppSelector((state) => state.auth);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ username, password }));
  };
 const handleLogout=()=>{
  dispatch(logout());
 }
  return (
    <div>
      <h2>Login</h2>
      {token && <p>✅ Logged in with token</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
        {token && <button onClick={handleLogout}>Logout</button>} 
    </div>
  
  );
};

export default Login;
