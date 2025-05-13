import { useState } from "react";
import "./signup.css";
import DownloadLogo from "../../assets/Download-logo.png";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [location, setLocation] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const algerianWilayas = [
    "Adrar",
    "Chlef",
    "Laghouat",
    "Oum El Bouaghi",
    "Batna",
    "Béjaïa",
    "Biskra",
    "Béchar",
    "Blida",
    "Bouira",
    "Tamanrasset",
    "Tébessa",
    "Tlemcen",
    "Tiaret",
    "Tizi Ouzou",
    "Algiers",
    "Djelfa",
    "Jijel",
    "Sétif",
    "Saïda",
    "Skikda",
    "Sidi Bel Abbès",
    "Annaba",
    "Guelma",
    "Constantine",
    "Médéa",
    "Mostaganem",
    "M'Sila",
    "Mascara",
    "Ouargla",
    "Oran",
    "El Bayadh",
    "Illizi",
    "Bordj Bou Arréridj",
    "Boumerdès",
    "El Tarf",
    "Tindouf",
    "Tissemsilt",
    "El Oued",
    "Khenchela",
    "Souk Ahras",
    "Tipaza",
    "Mila",
    "Aïn Defla",
    "Naâma",
    "Aïn Témouchent",
    "Ghardaïa",
    "Relizane",
    "Timimoun",
    "Bordj Badji Mokhtar",
    "Ouled Djellal",
    "Béni Abbès",
    "In Salah",
    "In Guezzam",
    "Touggourt",
    "Djanet",
    "El M'Ghair",
    "El Meniaa",
  ];

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    if (
      !email ||
      !password ||
      !confirmPassword ||
      !organizationName ||
      !location
    ) {
      setError("All fields are required");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("email", email);
      formDataToSend.append("password", password);
      formDataToSend.append("confirmPassword", confirmPassword);
      formDataToSend.append("organizationName", organizationName);
      formDataToSend.append("location", location);

      if (file) {
        formDataToSend.append("verificationDoc", file);
      }

      const response = await fetch("http://localhost:5000/organizer/signup", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }

      // If signup successful
      console.log("Signup successful:", data);
      // navigate("/example");

      // Clear form
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setOrganizationName("");
      setLocation("");
      setFile(null);

      navigate("/verifyemail");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="signup-page-container">
      <div className="signup-page-card">
        <h1 className="signup-page-title">Welcome Organizer</h1>
        <p className="signup-page-subtitle">
          Sign up & take your events to the next level!
        </p>
        <form onSubmit={handleSubmit} noValidate>
          <div className="signup-page-form-input">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="signup-page-form-input">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="signup-page-form-input">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="signup-page-form-input">
            <label htmlFor="organizationName">Organization's Name</label>
            <input
              id="organizationName"
              name="organizationName"
              type="text"
              placeholder="Enter your Organization's name"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
            />
          </div>

          <div className="signup-page-form-input">
            <label htmlFor="location">Location</label>
            <select
              id="location"
              name="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="" className="signup-page-location-text">
                Enter your location
              </option>
              {algerianWilayas.map((wilaya) => (
                <option key={wilaya} value={wilaya}>
                  {wilaya}
                </option>
              ))}
            </select>
          </div>

          <div className="signup-page-form-group">
            <label htmlFor="verificationFile">Verification file</label>
            <div className="signup-page-form-file">
              <img src={DownloadLogo} alt="Download icon" />
              <p className="signup-page-file-info">
                Upload your file in PDF, PNG, or SVG format. Max size: 5 MB
              </p>
              <input
                type="file"
                id="verificationFile"
                name="verificationFile"
                accept=".pdf,.png,.svg"
                className="signup-page-hidden-file-input"
                onChange={handleFileChange}
              />
              <label
                htmlFor="verificationFile"
                className="signup-page-browse-button"
              >
                Browse File
              </label>
              {file && (
                <p className="signup-page-selected-file">
                  Selected: {file.name}
                </p>
              )}
            </div>
          </div>

          <div className="signup-page-errorpart">
            {error && <p className="signup-page-error-message">{error}</p>}
          </div>

          <button type="submit" className="signup-page-submit-button">
            Sign up
          </button>
        </form>
        <p className="signup-page-text">
          If you have an account? &nbsp;
          <a href="/login" className="signup-page-link">
            Sign in now
          </a>
        </p>
      </div>
    </div>
  );
}
