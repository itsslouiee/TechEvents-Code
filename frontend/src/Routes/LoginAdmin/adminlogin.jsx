import React, { useState } from "react";
import "./adminlogin.css";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const textResponse = await response.text();
        console.error("Non-JSON response:", textResponse);
        throw new Error("Server returned an invalid response");
      }

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      console.log("Login successful:", data);
      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }

      navigate("/example");
    } catch (error) {
      setError(error.message || "An error occurred during login");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card3">
        <h1 className="login-title3">Welcome Administrator</h1>
        <p className="login-des">Your access to control panel</p>

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <div className="form-group3">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group" id="group1">
            <label htmlFor="password">Password</label>
            <div className="password-input-container">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="password-toggle1"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>{" "}
          <div className="errorpart">
            {error && (
              <div className="error-message1">
                <p>{error}</p>
              </div>
            )}
            <div className="forgot-password3">
              <a href="/forgotpassword" className="forgot-link">
                Forgot your password?
              </a>
            </div>
          </div>
          <button type="submit" className="login-button3">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
