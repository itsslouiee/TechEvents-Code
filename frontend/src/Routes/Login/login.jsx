import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/organizer/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Important for cookies
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }
      // If login successful
      console.log("Login successful:", data);
      // Store token in localStorage (simple approach)
      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }
      // Redirect to dashboard or home page
      navigate("/Example");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-page-card">
        <h1 className="login-page-title">Welcome Back</h1>
        <p className="login-page-des">Sign in to access your account</p>
        <form onSubmit={handleSubmit} className="login-page-form" noValidate>
          <div className="login-page-form-group">
            <label htmlFor="email">email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="login-page-form-group" id="login-page-group1">
            <label htmlFor="password">Password</label>
            <div className="login-page-password-input-container">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="login-page-password-toggle"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <div className="login-page-errorpart">
            {error && <p className="login-page-error-message">{error}</p>}
            <div className="login-page-forgot-password">
              <a href="/forgotpassword" className="login-page-forgot-link">
                forget your password ?
              </a>
            </div>
          </div>
          <button type="submit" className="login-page-button">
            Log In
          </button>
        </form>
        <p className="login-page-signup-text">
          Don't have an account? &nbsp;
          <a href="/signup" className="login-page-signup-link">
            Sign up now
          </a>
        </p>
      </div>
    </div>
  );
}
