import React, { useState } from "react";
import "./forgotpassword.css";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email is required");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/auth/sendotp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }
      navigate("/otpverify", { state: { email } });
    }
     catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <h1>Forgot Password</h1>
        <p>Enter your email address</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group1">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {error && (
            <div className="errorpart">
              <div className="error-message">
                <p>{error}</p>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="submit-button1"
          >
           Reset Password
          </button>
        </form>

        <div className="back-link">
          <a href="/login">Back to Login</a>
        </div>
      </div>
    </div>
  );
}
