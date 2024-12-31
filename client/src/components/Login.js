import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    setError("");
    e.preventDefault();
    try {
      const res = await axios.post("/login", form);
      if (res.status === 200) {
        const token = res.data.token;
        localStorage.setItem("token", token);
        navigate("/profile");
      }
    } catch (error) {
      if (error.response && error.response.data.error) {
        setError(error.response.data.error);
      }
    }
  };

  function signUp() {
    navigate("/register");
  }

  return (
    <div>
      <h1>Welcome back!</h1>
      <h3>Enter your Credentials to access your account</h3>
      <form onSubmit={handleSubmit} id="login-details">
        <p>Email address:</p>
        <input
          name="email"
          onChange={handleChange}
          placeholder="poppy@example.com"
          required
        />
        <p>Username:</p>
        <input
          name="password"
          onChange={handleChange}
          placeholder="12345678"
          type="password"
          required
        />
        <button id="login-btn" type="submit">
          Sign in
        </button>
      </form>
      <p id="error">{error ? error : ""}</p>
      <p id="reg">
        Don’t have an account?{" "}
        <button id="reg-btn" onClick={signUp}>
          Sign Up
        </button>
      </p>
    </div>
  );
};

export default Login;
