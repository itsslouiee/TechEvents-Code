"use client"

import { useState, useRef, useEffect } from "react"
import "./Form.css"
import techeventslogo from "./Images/TechEvents.png"

function Form({ selectedCategory, onBack }) {
  const [selectedWilaya, setSelectedWilaya] = useState("")
  const [isSurprise, setIsSurprise] = useState(false)
  const [timelineErrors, setTimelineErrors] = useState({
    from: "",
    to: "",
  })

  const techFields = [
    "Artificial Intelligence",
    "Cybersecurity",
    "Blockchain",
    "Web Development",
    "Mobile Development",
    "Data Science",
    "Cloud Computing",
    "Software Engineering",
    "Game Development",
    "Embedded Systems",
    "Robotics",
    "Internet of Things",
    "DevOps",
    "Big Data",
    "Quantum Computing",
    "Augmented & Virtual Reality",
    "Bioinformatics",
    "Startup & Entrepreneurship",
    "Other",
  ]

  const [values, setValues] = useState({
    eventName: "",
    description: "",
    startDate: "",
    endDate: "",
    deadline: "",
    maxParticipants: 0,
    location: "",
    locationType: "Online",
    cost: "Free",
    category: selectedCategory === "Startup" ? "Startup & Innovation" : selectedCategory,
    techField: "",
    sponsoredBy: [{ name: "", logo: null }],
    prizes: [""],
    eligibility: "",
    requirements: "",
    logo: null,
    verificationDoc: null,
    organizerId: "",
    additionalInfo: "",
    city: "",
    amount: "",
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [pdfUploaded, setPdfUploaded] = useState(false)
  const [imageUploaded, setImageUploaded] = useState(false)
  const [sponsorLogoUploaded, setSponsorLogoUploaded] = useState([])
  const formRef = useRef(null)
  const formContainerRef = useRef(null)
  const yearRef = useRef()

  const [notification, setNotification] = useState({ show: false, type: "", title: "", message: "" })

  // Initialize sponsorLogoUploaded array when component mounts
  useEffect(() => {
    setSponsorLogoUploaded(new Array(values.sponsoredBy.length).fill(false))
  }, [values.sponsoredBy.length])

  const addSponsor = () => {
    setValues((prev) => ({
      ...prev,
      sponsoredBy: [...prev.sponsoredBy, { name: "", logo: "" }],
    }))
  }

  const addPrize = () => {
    const nextplace = values.prizes.length + 1
    setValues((prev) => ({
      ...prev,
      prizes: [...prev.prizes, ""],
    }))
  }

  const handleChanges = (e, index = null) => {
    const { name, value, files, type } = e.target

    if (name === "verificationDoc" && files?.[0]) {
      setPdfUploaded(true)
      setValues((prev) => ({ ...prev, [name]: files[0] }))
      return
    }

    if (name === "logo" && files?.[0]) {
      setImageUploaded(true)
      setValues((prev) => ({ ...prev, [name]: files[0] }))
      return
    }

    if (name === "sponsorLogo" && index !== null && files?.[0]) {
      const newUploadedState = [...sponsorLogoUploaded]
      newUploadedState[index] = true
      setSponsorLogoUploaded(newUploadedState)

      setValues((prev) => {
        const updatedSponsors = [...prev.sponsoredBy]
        updatedSponsors[index] = {
          ...updatedSponsors[index],
          logo: files[0],
        }
        return { ...prev, sponsoredBy: updatedSponsors }
      })
      return
    }

    if (name.startsWith("prizes") && index !== null) {
      setValues((prev) => {
        const updatedPrizes = [...prev.prizes]
        updatedPrizes[index] = value
        return { ...prev, prizes: updatedPrizes }
      })
    } else if (name.startsWith("sponsorName") && index !== null) {
      setValues((prev) => {
        const updatedSponsors = [...prev.sponsoredBy]
        updatedSponsors[index] = {
          ...updatedSponsors[index],
          name: value,
        }
        return { ...prev, sponsoredBy: updatedSponsors }
      })
    } else {
      setValues((prev) => ({ ...prev, [name]: value }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!values.eventName) newErrors.eventName = "Event name is required"
    if (!values.description) newErrors.description = "Description is required"
    if (!values.category) newErrors.category = "Category is required"
    if (!values.techField) newErrors.techField = "Tech field is required"
    if (!values.startDate) newErrors.startDate = "Start date is required"
    if (!values.endDate) newErrors.endDate = "End date is required"
    if (!values.deadline) newErrors.deadline = "Deadline is required"
    if (!values.cost) newErrors.cost = "Please specify if the event is free or paid"
    if (values.cost === "Paid" && !values.amount) newErrors.amount = "Please specify the amount"
    if (!values.locationType) newErrors.locationType = "Location type is required"
    if (values.locationType === "Onsite" && !values.city) newErrors.city = "City is required for onsite events"
    if (!values.eventLink) newErrors.eventLink = "Event link is required"
    if (!values.verificationDoc) newErrors.verificationDoc = "Verification document is required"

    setErrors(newErrors)

    // Scroll to first error if there are any
    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0]
      const errorElement = formContainerRef.current?.querySelector(`[name="${firstErrorField}"]`)
      if (errorElement) {
        errorElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        })
        errorElement.focus({ preventScroll: true })
      }
    }

    return Object.keys(newErrors).length === 0
  }

  const showNotification = (type, title, message) => {
    setNotification({ show: true, type, title, message })
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }))
    }, 5000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      const firstErrorField = Object.keys(errors)[0]
      if (firstErrorField) {
        const element = document.querySelector(`[name="${firstErrorField}"]`)
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" })
          element.focus()
        }
      }
      return
    }

    setIsSubmitting(true)
    setSubmitError("")

    try {
      console.log("Starting form submission...")
      const formData = new FormData()

      // Log form values for debugging
      console.log("Form values:", values)

      // Required fields
      const requiredFields = {
        eventName: values.eventName,
        description: values.description,
        startDate: values.startDate,
        endDate: values.endDate,
        deadline: values.deadline,
        techField: values.techField,
        locationType: values.locationType,
        cost: values.cost,
        category: values.category || "other",
      }

      // Optional fields with defaults
      const optionalFields = {
        eventLink: values.eventLink || "",
        additionalInfo: values.additionalInfo || "",
        city: values.city || "",
        amount: values.cost === "Paid" ? values.amount : "0",
      }

      // Append required fields
      Object.entries(requiredFields).forEach(([key, value]) => {
        if (value === undefined || value === null) {
          console.error(`Missing required field: ${key}`)
          throw new Error(`Missing required field: ${key}`)
        }
        formData.append(key, value)
        console.log(`Appended required field: ${key} =`, value)
      })

      // Append optional fields
      Object.entries(optionalFields).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          formData.append(key, value)
          console.log(`Appended optional field: ${key} =`, value)
        }
      })

      // Handle file uploads
      if (!values.verificationDoc) {
        console.error("Verification document is required")
        throw new Error("Verification document is required")
      }
      formData.append("verificationDoc", values.verificationDoc)
      console.log("Appended verification document")

      if (values.logo) {
        formData.append("logo", values.logo)
        console.log("Appended logo file")
      }

      // Handle sponsors
      values.sponsoredBy.forEach((sponsor, index) => {
        if (sponsor.name) {
          formData.append(`sponsors[${index}][name]`, sponsor.name)
          console.log(`Appended sponsor ${index + 1} name:`, sponsor.name)

          if (sponsor.logo) {
            formData.append(`sponsors[${index}][logo]`, sponsor.logo)
            console.log(`Appended logo for sponsor ${index + 1}`)
          }
        }
      })

      // Handle prizes
      values.prizes.forEach((prize, index) => {
        if (prize && prize.trim() !== "") {
          formData.append(`prizes[${index}]`, prize.trim())
          console.log(`Appended prize ${index + 1}:`, prize)
        }
      })

      console.log("Sending request to server...")

      // Get the authentication token from localStorage
      const token = localStorage.getItem("authToken")
      if (!token) {
        throw new Error("You need to be logged in to submit an event")
      }

      const response = await fetch("http://localhost:5000/event/submit", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      console.log("Response status:", response.status)

      let responseData
      try {
        const responseText = await response.text()
        console.log("Raw response:", responseText)
        responseData = responseText ? JSON.parse(responseText) : {}
      } catch (parseError) {
        console.error("Error parsing response:", parseError)
        throw new Error("Invalid response from server")
      }

      if (!response.ok) {
        console.error("Server error response:", responseData)
        throw new Error(responseData.error || responseData.message || `Server responded with status ${response.status}`)
      }

      console.log("Success response:", responseData)
      showNotification("success", "Success!", "Your event has been submitted successfully!")

      // Reset form after successful submission
      setValues({
        eventName: "",
        description: "",
        startDate: "",
        endDate: "",
        deadline: "",
        techField: "",
        cost: "Free",
        locationType: "Online",
        eventLink: "",
        sponsoredBy: [{ name: "", logo: null }],
        prizes: [""],
        verificationDoc: null,
        logo: null,
        additionalInfo: "",
        city: "",
        amount: "",
        category: "Other",
      })

      setImageUploaded(false)
      setPdfUploaded(false)
    } catch (error) {
      console.error("Error in form submission:", {
        error: error.toString(),
        message: error.message,
        stack: error.stack,
      })
      const errorMessage = error.message || "Failed to submit event. Please try again."
      showNotification("error", "Error", errorMessage)
      setSubmitError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const removeLastSponsor = () => {
    setValues((prev) => ({
      ...prev,
      sponsoredBy: prev.sponsoredBy.slice(0, -1),
    }))
  }

  const removeLastPrize = () => {
    setValues((prev) => ({
      ...prev,
      prizes: prev.prizes.slice(0, -1),
    }))
  }

  return (
    <div className="form-page">
      <style>
        @import
        url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');
      </style>
      <img src={techeventslogo || "/placeholder.svg"} alt="logo" />
      <div className="White-Container">
        <button
          onClick={onBack}
          style={{
            position: "absolute",
            left: "15px",
            top: "15px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "#615e9f",
            display: "flex",
            alignItems: "center",
            padding: "8px 12px",
            borderRadius: "20px",
            fontSize: "16px",
            fontWeight: "500",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#f5f4ff"
            e.currentTarget.style.color = "#4e4b83"
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(107, 99, 201, 0.2)"
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "transparent"
            e.currentTarget.style.color = "#615e9f"
            e.currentTarget.style.boxShadow = "none"
          }}
        >
          ← Back
        </button>

        <h3>Tech Event Submission Form</h3>
        <h4>Share your Innovation</h4>

        {/* Only show category if it's provided */}
        {selectedCategory && (
          <div className="mb-6 text-[#615e9f]">
            Category:{" "}
            <span className="font-semibold">
              {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
            </span>
          </div>
        )}
        {submitSuccess ? (
          <div className="success-message">
            <div className="success-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h4>Event Submitted Successfully! 🎉</h4>
            <p>
              Your event has been successfully submitted and is now pending admin approval. You'll be notified via email
              once it's approved and published.
            </p>
            <div className="success-actions">
              <button
                className="action-btn primary"
                onClick={() => {
                  window.location.reload()
                }}
              >
                Submit Another Event
              </button>
              <button
                className="action-btn secondary"
                onClick={() => {
                  window.location.href = "/profile"
                }}
              >
                View My Events
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-container" ref={formContainerRef}>
              <label htmlFor="eventName" className="Name-Label">
                Event Name <span className="red">*</span>
              </label>
              <input
                onChange={(e) => handleChanges(e)}
                type="text"
                required
                placeholder="Enter your event's name"
                name="eventName"
                className={`Event-Name ${errors.eventName ? "is-invalid" : ""}`}
              />
              {errors.eventName && <div className="error">{errors.eventName}</div>}
              <label htmlFor="techField" className="form-label">
                Tech Field <span className="red">*</span>
              </label>
              <select
                id="techField"
                required
                name="techField"
                value={values.techField}
                onChange={handleChanges}
                className={`form-select ${errors.techField ? "is-invalid" : ""}`}
                style={{
                  width: "80%",
                  maxWidth: "400px",
                  height: "30px",
                  borderRadius: "9px",
                  border: "1px solid #4e4b83",
                  padding: "0 10px",
                  outline: "none",
                  backgroundColor: "white",
                  marginBottom: "10px",
                  transition: "border 0.3s",
                }}
              >
                <option value="" disabled>
                  Select a tech field
                </option>
                {techFields.map((field) => (
                  <option key={field} value={field}>
                    {field}
                  </option>
                ))}
              </select>
              {errors.techField && <div className="error">{errors.techField}</div>}
              <label htmlFor="startDate" className="form-label">
                {" "}
                Start Date <span className="red">*</span>
              </label>
              <input
                type="date"
                required
                placeholder="Enter your event's start date"
                name="startDate"
                onChange={(e) => handleChanges(e)}
              />
              {errors.startDate && <div className="error">{errors.startDate}</div>}
              <label htmlFor="endDate" className="form-label">
                {" "}
                End Date <span className="red">*</span>
              </label>
              <input
                type="date"
                required
                placeholder="Enter your event's end date"
                name="endDate"
                onChange={(e) => handleChanges(e)}
              />
              {errors.endDate && <div className="error">{errors.endDate}</div>}
              <label htmlFor="deadline" className="form-label">
                {" "}
                Deadline <span className="red">*</span>
              </label>
              <input
                type="date"
                required
                placeholder="Enter your event's deadline"
                name="deadline"
                onChange={(e) => handleChanges(e)}
              />
              {errors.deadline && <div className="error">{errors.deadline}</div>}
              <label className="form-label" htmlFor="description">
                {" "}
                Description <span className="red"> *</span>
              </label>
              <textarea
                onChange={(e) => handleChanges(e)}
                required
                name="description"
                placeholder="Add a description to your event"
                className="Description-textarea"
                id=""
                minLength={20}
              ></textarea>
              {errors.description && <div className="error">{errors.description}</div>}
              <label className="form-label" htmlFor="cost">
                Cost <span className="red">*</span>
              </label>
              <div className="Cost-container">
                <label className="Free-Label">
                  <input
                    onChange={(e) => handleChanges(e)}
                    value="Free"
                    required
                    type="radio"
                    name="cost"
                    className="Free-input"
                  />
                  Free
                </label>
                <label className="Paid-Label">
                  <input
                    onChange={(e) => handleChanges(e)}
                    value="Paid"
                    type="radio"
                    name="cost"
                    className="Paid-input"
                  />
                  Paid
                </label>
              </div>
              {values.cost === "Paid" && (
                <div className="cost-amount">
                  <input
                    type="number"
                    name="amount"
                    value={values.amount}
                    onChange={(e) => handleChanges(e)}
                    placeholder="Enter amount"
                    min="0"
                    step="0.01"
                    required
                  />
                  {errors.amount && <div className="error">{errors.amount}</div>}
                </div>
              )}
              <label htmlFor="locationType" className="form-label">
                Location <span className="red">*</span>
              </label>
              <div className="Location-container">
                <label className="Online-Label">
                  <input
                    onChange={(e) => handleChanges(e)}
                    required
                    type="radio"
                    value="Online"
                    name="locationType"
                    className="Online-input"
                  />
                  Online
                </label>
                <label className="Onsite-Label">
                  <input
                    onChange={(e) => handleChanges(e)}
                    type="radio"
                    value="Onsite"
                    name="locationType"
                    className="Onsite-input"
                  />
                  Onsite
                </label>
              </div>
              {values.locationType === "Onsite" && (
                <div className="wilaya-select" style={{ marginTop: "10px", display: "flex", justifyContent: "center" }}>
                  <select
                    name="city"
                    onChange={(e) => {
                      setSelectedWilaya(e.target.value)
                      setValues((prev) => ({ ...prev, city: e.target.value }))
                    }}
                    value={selectedWilaya}
                    required
                    style={{
                      width: "80%",
                      maxWidth: "400px",
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ddd",
                      marginBottom: "15px",
                      fontSize: "14px",
                    }}
                  >
                    <option value="" disabled selected>
                      Select a wilaya
                    </option>
                    <option value="Adrar">Adrar</option>
                    <option value="Chlef">Chlef</option>
                    <option value="Laghouat">Laghouat</option>
                    <option value="Oum El Bouaghi">Oum El Bouaghi</option>
                    <option value="Batna">Batna</option>
                    <option value="Bejaia">Bejaia</option>
                    <option value="Biskra">Biskra</option>
                    <option value="Bechar">Bechar</option>
                    <option value="Blida">Blida</option>
                    <option value="Bouira">Bouira</option>
                    <option value="Tamanrasset">Tamanrasset</option>
                    <option value="Tebessa">Tebessa</option>
                    <option value="Tlemcen">Tlemcen</option>
                    <option value="Tiaret">Tiaret</option>
                    <option value="Tizi Ouzou">Tizi Ouzou</option>
                    <option value="Algiers">Algiers</option>
                    <option value="Djelfa">Djelfa</option>
                    <option value="Jijel">Jijel</option>
                    <option value="Setif">Setif</option>
                    <option value="Saida">Saida</option>
                    <option value="Skikda">Skikda</option>
                    <option value="Sidi Bel Abbes">Sidi Bel Abbes</option>
                    <option value="Annaba">Annaba</option>
                    <option value="Guelma">Guelma</option>
                    <option value="Constantine">Constantine</option>
                    <option value="Medea">Medea</option>
                    <option value="Mostaganem">Mostaganem</option>
                    <option value="M'Sila">M'Sila</option>
                    <option value="Mascara">Mascara</option>
                    <option value="Ouargla">Ouargla</option>
                    <option value="Oran">Oran</option>
                    <option value="El Bayadh">El Bayadh</option>
                    <option value="Illizi">Illizi</option>
                    <option value="Bordj Bou Arreridj">Bordj Bou Arreridj</option>
                    <option value="Boumerdes">Boumerdes</option>
                    <option value="El Tarf">El Tarf</option>
                    <option value="Tindouf">Tindouf</option>
                    <option value="Tissemsilt">Tissemsilt</option>
                    <option value="El Oued">El Oued</option>
                    <option value="Khenchela">Khenchela</option>
                    <option value="Souk Ahras">Souk Ahras</option>
                    <option value="Tipaza">Tipaza</option>
                    <option value="Mila">Mila</option>
                    <option value="Ain Defla">Ain Defla</option>
                    <option value="Naama">Naama</option>
                    <option value="Ain Temouchent">Ain Temouchent</option>
                    <option value="Ghardaia">Ghardaia</option>
                    <option value="Relizane">Relizane</option>
                    <option value="Timimoun">Timimoun</option>
                    <option value="Bordj Badji Mokhtar">Bordj Badji Mokhtar</option>
                    <option value="Ouled Djellal">Ouled Djellal</option>
                    <option value="Beni Abbes">Beni Abbes</option>
                    <option value="In Salah">In Salah</option>
                    <option value="In Guezzam">In Guezzam</option>
                    <option value="Touggourt">Touggourt</option>
                    <option value="Djanet">Djanet</option>
                    <option value="El M'Ghair">El M'Ghair</option>
                    <option value="El Menia">El Menia</option>
                  </select>
                </div>
              )}
              <label htmlFor="eventLink" className="form-label">
                Link <span className="red">*</span>
              </label>
              <input
                onChange={(e) => handleChanges(e)}
                required
                type="text"
                placeholder="Enter your event's link"
                name="eventLink"
              />
              {errors.eventLink && <div className="error">{errors.eventLink}</div>}
              <label htmlFor="verificationDoc" className="form-label">
                Verification File <span className="red">*</span>
              </label>
              <label className="Verif-label" htmlFor="verificationDoc-input">
                <input
                  onChange={(e) => handleChanges(e)}
                  type="file"
                  name="verificationDoc"
                  id="verificationDoc-input"
                  className="Eventimg-input"
                  accept=".pdf,application/pdf"
                />
                <span className="block-icon">
                  <i className="fa-solid fa-upload"></i>
                </span>
                <p style={{ color: "#4e4b83" }}>Upload your file in PDF format. Max size: 15 MB</p>
              </label>
              {pdfUploaded && (
                <div className="upload-success">
                  <i className="fas fa-check-circle"></i>
                  <span>PDF file added successfully!</span>
                </div>
              )}
              {errors.verificationDoc && <div className="error">{errors.verificationDoc}</div>}
              <label htmlFor="sponsoredBy" className="form-label">
                Sponsors
              </label>
              {values.sponsoredBy.map((_, index) => (
                <div key={index}>
                  <input
                    onChange={(e) => handleChanges(e, index)}
                    type="text"
                    placeholder="Enter the sponsor's name"
                    name="sponsorName"
                    className="Sponsortxt"
                  />
                  <label htmlFor="sponsorLogo" className="Sponsorimg-Label">
                    <i className="fa-solid fa-upload"></i>
                    <input
                      onChange={(e) => handleChanges(e, index)}
                      type="file"
                      className="Sponsorimg-input"
                      id="sponsorLogo"
                      accept="image/*"
                      name="sponsorLogo"
                    />
                    Add the sponsor's logo
                  </label>
                  {sponsorLogoUploaded[index] && (
                    <div className="upload-success">
                      <i className="fas fa-check-circle"></i>
                      <span>Sponsor logo added successfully!</span>
                    </div>
                  )}
                </div>
              ))}
              <button type="button" className="Add-sponsor-btn" onClick={addSponsor}>
                + add sponsor
              </button>
              {values.sponsoredBy.length > 1 && (
                <button onClick={removeLastSponsor} type="button" className="Remove-sponsor-btn">
                  - remove sponsor
                </button>
              )}
              <label htmlFor="logo">Logo</label>
              <label className="Eventimg-Label" htmlFor="logo-input">
                <input
                  onChange={(e) => handleChanges(e)}
                  type="file"
                  name="logo"
                  id="logo-input"
                  className="Eventimg-input"
                  accept="image/*"
                />
                <span className="block-icon">
                  <i className="fa-solid fa-upload"></i>
                </span>
                Add a background image to your event
              </label>
              {imageUploaded && (
                <div className="upload-success">
                  <i className="fas fa-check-circle"></i>
                  <span>Image added successfully!</span>
                </div>
              )}
              <label htmlFor="prizes" className="form-label">
                Prizes
              </label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "80%",
                  maxWidth: "400px",
                  margin: "0 auto",
                  textAlign: "left",
                  gap: "5px",
                  marginTop: "5px",
                }}
              >
                <input
                  type="checkbox"
                  name="Event prizes"
                  className="Surprize-radio"
                  style={{ width: "auto", margin: "0" }}
                  onChange={() => setIsSurprise((prev) => !prev)}
                />
                <span style={{ fontSize: "15px" }}>No prizes</span>
              </div>
              {!isSurprise &&
                values.prizes.map((_, index) => (
                  <div key={index} className="Eventprize-parent">
                    <div className="Eventprize-container">
                      <pre className="place"> Place number {index + 1} prize </pre>
                      <input
                        onChange={(e) => handleChanges(e, index)}
                        className="Eventprize-input"
                        type="text"
                        name="prizes"
                        placeholder={`Place number ${index + 1} prize`}
                      />
                    </div>
                  </div>
                ))}
              {!isSurprise && (
                <button type="button" className="addprize-btn" onClick={addPrize}>
                  + add prize
                </button>
              )}
              {values.prizes.length > 1 && (
                <button type="button" className="removeprize-btn" onClick={removeLastPrize}>
                  - remove prize
                </button>
              )}
              <label htmlFor="additionalInfo" className="form-label">
                Additional Info
              </label>
              <textarea
                onChange={(e) => handleChanges(e)}
                name="additionalInfo"
                placeholder="Add a note to your event"
                className="Addinfo-textarea"
                id=""
              ></textarea>
              <button onClick={(e) => handleSubmit(e)} type="submit">
                submit
              </button>
            </div>
          </form>
        )}
        {isSubmitting && (
          <div className="popup-center">
            <div className="spinner-circle"></div>
            <span>Submitting event</span>
          </div>
        )}
        {submitError && (
          <div className="error-message">
            <div className="error-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h4>Event Submission Error</h4>
            <p>{submitError}</p>
            <button className="action-btn" onClick={() => setSubmitError("")}>
              Try Again
            </button>
          </div>
        )}
        {notification.show && (
          <div className={`notification ${notification.type} ${notification.show ? "show" : ""}`}>
            <div className="notification-icon">
              {notification.type === "success" ? (
                <i className="fas fa-check-circle"></i>
              ) : (
                <i className="fas fa-exclamation-circle"></i>
              )}
            </div>
            <div className="notification-content">
              <div className="notification-title">{notification.title}</div>
              <div className="notification-message">{notification.message}</div>
            </div>
            <button
              onClick={() => setNotification((prev) => ({ ...prev, show: false }))}
              className="notification-close"
              aria-label="Close notification"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Form
