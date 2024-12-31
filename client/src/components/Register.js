import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    try {
      const res = await axios.post("/register", form);
      if (res.status === 200) {
        navigate(-1);
      }
    } catch (error) {
      if (error.response && error.response.data.error) {
        setError(error.response.data.error);
      }
    }
  };

  return (
    <div className="home">
      <div id="register">
        <div id="register-details">
          <div>
            <h1>Welcome to AspireAlly!</h1>
            <h3>Enter your personal details and start your journey with us.</h3>
          </div>
          <form id="login-details" onSubmit={handleSubmit}>
            <input
              name="username"
              onChange={handleChange}
              placeholder="Username"
              required
            />
            <input
              name="email"
              onChange={handleChange}
              placeholder="Email"
              required
            />
            <div style={{ position: "relative" }}>
              <input
                type={isPasswordVisible ? "text" : "password"}
                onChange={handleChange}
                name="password"
                placeholder="Password"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                style={{
                  position: "absolute",
                  right: "8%",
                  top: "-60%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <img
                  style={{ height: "0.8rem" }}
                  src={
                    isPasswordVisible
                      ? "https://uxwing.com/wp-content/themes/uxwing/download/health-sickness-organs/hide-private-hidden-icon.svg"
                      : "https://uxwing.com/wp-content/themes/uxwing/download/health-sickness-organs/eye-look-icon.svg"
                  }
                  alt=""
                />
              </button>
            </div>
            <select name="role" onChange={handleChange} required>
              <option value="">Select Role</option>
              <option value="mentor">Mentor</option>
              <option value="mentee">Mentee</option>
            </select>
            <button type="submit" id="sign-up-btn">
              Register
            </button>
          </form>
          <p id="error">{error ? error : ""}</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
