import React, { useState } from "react";
import "./otpVerify.css";
import { useNavigate } from "react-router-dom";

export default function OtpVerify() {
  const [otp1, setOtp1] = useState("");
  const [otp2, setOtp2] = useState("");
  const [otp3, setOtp3] = useState("");
  const [otp4, setOtp4] = useState("");
  const [otp5, setOtp5] = useState("");
  const [otp6, setOtp6] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e, setter, nextField) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setter(value);
      if (value && nextField) {
        nextField.focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otp = otp1 + otp2 + otp3 + otp4 + otp5 + otp6;

    if (otp.length !== 6) {
      setError("Please enter 6-digit code");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/auth/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ otp }),
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Verification failed");

      navigate("/newpassword");
    } catch (error) {
      setError(error.message);
    }
  };
  

  const handleResend = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/auth/resendotp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend OTP");
      }

      // Clear existing OTP inputs
      setOtp1("");
      setOtp2("");
      setOtp3("");
      setOtp4("");
      setOtp5("");
      setOtp6("");

      // Focus first input field
      document.getElementById("otp1").focus();

      // Show success message
      setError("New OTP has been sent successfully");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="verify-otp-container">
      <div className="verify-otp-card">
        <h1>Verify Your OTP</h1>
        <p>Enter the 6-digit code sent to your email</p>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="otp-input-group">
            <input
              id="otp1"
              type="text"
              maxLength="1"
              className="otp-input"
              value={otp1}
              onChange={(e) =>
                handleChange(e, setOtp1, document.getElementById("otp2"))
              }
              onFocus={(e) => e.target.select()}
            />
            <input
              id="otp2"
              type="text"
              maxLength="1"
              className="otp-input"
              value={otp2}
              onChange={(e) =>
                handleChange(e, setOtp2, document.getElementById("otp3"))
              }
              onFocus={(e) => e.target.select()}
            />
            <input
              id="otp3"
              type="text"
              maxLength="1"
              className="otp-input"
              value={otp3}
              onChange={(e) =>
                handleChange(e, setOtp3, document.getElementById("otp4"))
              }
              onFocus={(e) => e.target.select()}
            />
            <input
              id="otp4"
              type="text"
              maxLength="1"
              className="otp-input"
              value={otp4}
              onChange={(e) =>
                handleChange(e, setOtp4, document.getElementById("otp5"))
              }
              onFocus={(e) => e.target.select()}
            />
            <input
              id="otp5"
              type="text"
              maxLength="1"
              className="otp-input"
              value={otp5}
              onChange={(e) =>
                handleChange(e, setOtp5, document.getElementById("otp6"))
              }
              onFocus={(e) => e.target.select()}
            />
            <input
              id="otp6"
              type="text"
              maxLength="1"
              className="otp-input"
              value={otp6}
              onChange={(e) => handleChange(e, setOtp6)}
              onFocus={(e) => e.target.select()}
            />
          </div>
          <button type="submit" className="verify-button">
            Verify
          </button>
        </form>

        <div className="resend-text">
          Didn't receive the code?{" "}
          <button
            className="resend-link"
            onClick={(e) => {
              e.preventDefault();
              handleResend();
            }}
          >
            Resend
          </button>
        </div>
      </div>
    </div>
  );
}
