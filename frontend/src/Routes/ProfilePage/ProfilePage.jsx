"use client"

import { useState, useEffect, useCallback } from "react"
import "./ProfilePage.css"
import {
  Mail,
  MapPin,
  Settings,
  X,
  Pencil,
  Lock,
  LogOut,
  Globe,
  Phone,
  Facebook,
  Instagram,
  Linkedin,
  Eye,
  EyeOff,
  ImageIcon,
  Upload,
} from "lucide-react"
import bytecraftLogo from "./Images/bytecraft-logo.png"
import {
  getOrganizerProfile,
  updateOrganizerProfile,
  updateOrganizerLogo,
  changePassword,
  logout,
  getOrganizerEvents
} from "../../services/organizerService"
import EventsTable from './EventsTable';
import EventCard from './EventCard';

function ProfilePage() {
  const [activeTab, setActiveTab] = useState("about")
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [showEditIntro, setShowEditIntro] = useState(false)
  const [showEditAbout, setShowEditAbout] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswordSuccess, setShowPasswordSuccess] = useState(false);
  const [showChangeProfileImage, setShowChangeProfileImage] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [submittedEvents, setSubmittedEvents] = useState([])
  const [isLoadingEvents, setIsLoadingEvents] = useState(false)
  const [eventsError, setEventsError] = useState(null)

  // Animation states
  const [isSettingsClosing, setIsSettingsClosing] = useState(false)
  const [isModalClosing, setIsModalClosing] = useState(false)
  const [closingModal, setClosingModal] = useState("")

  // Organizer data state
  const [organizer, setOrganizer] = useState({
    organizationName: "",
    email: "",
    location: "",
    logo: "",
    description: "",
    website: "",
    contacts: {
      phone: "",
      email: "",
    },
    socialMedia: {
      facebook: "",
      instagram: "",
      linkedin: "",
    },
  })

  // Form states
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    email: "",
    phone: "",
    website: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    location: "",
  })

  // State for change password
  const [changePasswordData, setChangePasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // State for password visibility
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [passwordError, setPasswordError] = useState('');

  // State for loading
  const [isUploading, setIsUploading] = useState(false);

  // State for success popup
  const [successPopup, setSuccessPopup] = useState({
    show: false,
    message: ''
  });

  // State for form submission loading
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Show success popup for 4 seconds
  const showSuccessMessage = useCallback((message) => {
    setSuccessPopup({
      show: true,
      message: message
    });
    const timer = setTimeout(() => {
      setSuccessPopup({ show: false, message: '' });
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  // Show success message for password change
  const showPasswordSuccessMessage = useCallback(() => {
    setShowPasswordSuccess(true);
    const timer = setTimeout(() => {
      setShowPasswordSuccess(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  // Fetch organizer data on component mount
  useEffect(() => {
    const fetchOrganizerData = async () => {
      try {
        setIsLoading(true)
        const response = await getOrganizerProfile()
        if (response.success) {
          setOrganizer(response.data)
          // Update form states with the fetched data
          setEditFormData({
            name: response.data.organizationName || "",
            description: response.data.description || "",
            email: response.data.email || "",
            phone: response.data.contacts?.phone || "",
            website: response.data.website || "",
            facebook: response.data.socialMedia?.facebook || "",
            instagram: response.data.socialMedia?.instagram || "",
            linkedin: response.data.socialMedia?.linkedin || "",
            location: response.data.location || "",
          })
        }
      } catch (error) {
        console.error("Error fetching organizer data:", error)
        setError("Failed to load organizer data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrganizerData()
  }, [])

  // Fetch submitted events on component mount
  useEffect(() => {
    const fetchSubmittedEvents = async () => {
      try {
        setIsLoadingEvents(true)
        const response = await getOrganizerEvents()
        if (response.success) {
          setSubmittedEvents(response.data)
        }
      } catch (error) {
        console.error("Error fetching submitted events:", error)
        setEventsError("Failed to load submitted events")
      } finally {
        setIsLoadingEvents(false)
      }
    }

    const fetchPosts = async () => {
      try {
        // Replace with your actual API call to fetch posts
        // const response = await getOrganizerPosts();
        // setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error)
      }
    }

    fetchSubmittedEvents()
    fetchPosts()
  }, [])

  // Add this effect to handle body scroll when loading
  useEffect(() => {
    if (isSubmitting) {
      document.body.classList.add('loading-active');
    } else {
      document.body.classList.remove('loading-active');
    }
    
    // Cleanup function to remove the class when component unmounts
    return () => {
      document.body.classList.remove('loading-active');
    };
  }, [isSubmitting]);

  // Handle profile image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }
      
      // Check file type
      if (!file.type.match('image.*')) {
        alert('Please select an image file');
        return;
      }
      
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save profile image
  const saveProfileImage = async () => {
    if (!selectedFile) {
      alert('Please select an image to upload');
      return;
    }

    setIsUploading(true);
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('logo', selectedFile);
      
      const response = await updateOrganizerLogo(formData);
      
      if (response.success) {
        // Update the organizer data with the new logo URL
        setOrganizer(prev => ({
          ...prev,
          logo: response.logoUrl || response.logo
        }));
        
        // Close the modal and reset states
        closeChangeProfileImage();
        showSuccessMessage('Profile image updated successfully!');
      } else {
        throw new Error(response.message || 'Failed to update profile image');
      }
    } catch (error) {
      console.error('Error updating profile image:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update profile image. Please try again.';
      alert(errorMessage);
    } finally {
      setIsUploading(false);
      setIsSubmitting(false);
    }
  };

  // Open/Close Profile Image Modal
  const openChangeProfileImage = () => {
    setShowChangeProfileImage(true);
  };

  const closeChangeProfileImage = () => {
    setIsModalClosing(true);
    setClosingModal("profileImage");
    setTimeout(() => {
      setShowChangeProfileImage(false);
      setIsModalClosing(false);
      setClosingModal("");
      setPreviewImage(null);
      setSelectedFile(null);
    }, 400);
  };

  // Handle saving intro (name, email, location)
  const handleIntroSave = async (e) => {
    e.preventDefault()
    setIsSubmitting(true);
    try {
      const updatedData = {
        organizationName: editFormData.name,
        email: editFormData.email,
        location: editFormData.location,
      }

      const response = await updateOrganizerProfile(updatedData)

      if (response.success) {
        setOrganizer((prev) => ({
          ...prev,
          ...updatedData,
        }))
        closeEditIntro()
        showSuccessMessage('Profile information updated successfully!');
      }
    } catch (error) {
      console.error("Error updating profile intro:", error)
      alert("Failed to update profile. Please try again.")
    } finally {
      setIsSubmitting(false);
    }
  }

  // Handle saving profile description and contact info
  const handleDescriptionSave = async (e) => {
    e.preventDefault()
    setIsSubmitting(true);
    try {
      const updatedData = {
        description: editFormData.description,
        website: editFormData.website,
        contacts: {
          phone: editFormData.phone,
        },
        socialMedia: {
          facebook: editFormData.facebook,
          instagram: editFormData.instagram,
          linkedin: editFormData.linkedin,
        },
      }

      const response = await updateOrganizerProfile(updatedData)

      if (response.success) {
        setOrganizer((prev) => ({
          ...prev,
          description: editFormData.description,
          website: editFormData.website,
          contacts: {
            ...prev.contacts,
            phone: editFormData.phone,
          },
          socialMedia: {
            ...prev.socialMedia,
            facebook: editFormData.facebook,
            instagram: editFormData.instagram,
            linkedin: editFormData.linkedin,
          },
        }))
        closeEditAbout()
        showSuccessMessage('About information updated successfully!');
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Failed to update profile. Please try again.")
    } finally {
      setIsSubmitting(false);
    }
  }

  // Handle change password input change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setChangePasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user types
    if (passwordError) setPasswordError('');
  };

  // Handle change password form submission
  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    // Check if save button was clicked
    const isSaveClicked = e.nativeEvent.submitter?.classList.contains('save-button');
    
    // Only proceed if save button was clicked
    if (!isSaveClicked) return;
    
    // Validate passwords match
    if (changePasswordData.newPassword !== changePasswordData.confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }
    
    // Validate password length
    if (changePasswordData.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }
    
    // Validate current password is not empty
    if (!changePasswordData.currentPassword) {
      setPasswordError("Please enter your current password");
      return;
    }
    
    setIsChangingPassword(true);
    setPasswordError('');
    
    try {
      const response = await changePassword(
        changePasswordData.currentPassword,
        changePasswordData.newPassword
      );
      
      if (response.success) {
        // Clear the form
        setChangePasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        // Close the change password modal
        closeChangePassword();
        
        // Show success message
        showPasswordSuccessMessage();
      }
    } catch (error) {
      console.error('Error changing password:', error);
      const errorMessage = error.response?.data?.message || 'Failed to change password. Please try again.';
      setPasswordError(errorMessage);
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Add logout handler
  const handleLogout = async () => {
    try {
      // Store the current path to redirect back after login if needed
      localStorage.setItem('redirectAfterLogin', window.location.pathname);
      
      // Clear any sensitive data from localStorage
      localStorage.removeItem('organizerData');
      
      // Try to call the logout API, but don't wait for it
      // This is a fire-and-forget approach to avoid the error message
      logout().catch(console.error);
      
      // Clear the token and redirect immediately
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    } catch (error) {
      console.error('Error during logout:', error);
      // Ensure we still redirect even if there's an error
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
  };

  // Modal close handlers with smooth animations
  const closeSettings = () => {
    setIsSettingsClosing(true)
    setTimeout(() => {
      setShowSettings(false)
      setIsSettingsClosing(false)
    }, 400)
  }

  const closeChangePassword = () => {
    setIsModalClosing(true)
    setClosingModal("password")
    setTimeout(() => {
      setShowChangePassword(false)
      setIsModalClosing(false)
      setClosingModal("")
    }, 400)
  }

  const closeEditIntro = () => {
    setIsModalClosing(true)
    setClosingModal("intro")
    setTimeout(() => {
      setShowEditIntro(false)
      setIsModalClosing(false)
      setClosingModal("")
    }, 400)
  }

  const closeEditAbout = () => {
    setIsModalClosing(true)
    setClosingModal("about")
    setTimeout(() => {
      setShowEditAbout(false)
      setIsModalClosing(false)
      setClosingModal("")
    }, 400)
  }

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleEditEvent = (eventId) => {
    // Navigate to edit page or open edit modal
    // For now, we'll just log it
    console.log('Edit event:', eventId);
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  // Filter approved events
  const approvedEvents = submittedEvents.filter(event => event.status === 'approved');

  return (
    <div className="profile-page-container">
      {/* Floating Loading Popup */}
      {isSubmitting && (
        <div className="fullscreen-loading-overlay">
          <div className="fullscreen-loading-spinner"></div>
          <div className="fullscreen-loading-text">Submitting...</div>
        </div>
      )}
      
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-logo" onClick={openChangeProfileImage}>
          {organizer.logo ? (
            <img src={organizer.logo || "/placeholder.svg"} alt="Profile" />
          ) : (
            <div className="logo-text">
              <span>{organizer.organizationName?.charAt(0) || "O"}</span>
            </div>
          )}
        </div>

        <div className="profile-info">
          <div className="profile-name">
            <h1>{organizer.organizationName || "Organization Name"}</h1>
            <button className="edit-button" onClick={() => setShowEditIntro(true)} title="Edit Profile" type="button">
              <Pencil size={16} />
            </button>
          </div>

          <div className="profile-details">
            <div className="profile-detail">
              <Mail size={16} />
              <span>{organizer.email || "No email provided"}</span>
            </div>
            {organizer.location && (
              <div className="profile-detail">
                <MapPin size={16} />
                <span>{organizer.location}</span>
              </div>
            )}
          </div>

          <div className="settings-button">
            <button className="settings-toggle" onClick={() => setShowSettings(!showSettings)}>
              <Settings size={18} />
              <span>Settings</span>
            </button>

            {showSettings && (
              <div className={`settings-popup ${isSettingsClosing ? "closing" : ""}`}>
                <div className="settings-popup-header">
                  <h2>Settings</h2>
                  <button onClick={closeSettings} className="close-button">
                    <X size={16} />
                  </button>
                </div>
                <div className="settings-options">
                  <button
                    className="settings-option change-password"
                    onClick={() => {
                      setShowChangePassword(true)
                      closeSettings()
                    }}
                  >
                    <Lock size={16} />
                    <span>Change Password</span>
                  </button>
                  <button className="settings-option logout" onClick={handleLogout}>
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div> {/* Close profile-header div */}

      {/* Profile Content */}
      <div className="profile-content">
        <div className="profile-tabs">
          <button
            className={`tab ${activeTab === "submitted" ? "active" : ""}`}
            onClick={() => setActiveTab("submitted")}
          >
            Submitted Events
          </button>
          <button className={`tab ${activeTab === "posts" ? "active" : ""}`} onClick={() => setActiveTab("posts")}>
            Posts
          </button>
          <button className={`tab ${activeTab === "about" ? "active" : ""}`} onClick={() => setActiveTab("about")}>
            About
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "about" && (
            <div className="about-tab">
              <div className="section">
                <div className="section-header">
                  <h2>Description</h2>
                  <button
                    className="edit-button"
                    onClick={() => setShowEditAbout(true)}
                    title="Edit description"
                    type="button"
                  >
                    <Pencil size={16} />
                  </button>
                </div>
                <hr />
                <p>{organizer.description || "No description available"}</p>
              </div>

              <div className="section">
                <h2>Contact Information</h2>
                <hr />
                <div className="contact-info">
                  <div className="contact-item">
                    <Mail className="icon" size={20} />
                    <span>{organizer.email || "Email not specified"}</span>
                  </div>
                  <div className="contact-item">
                    <Phone className="icon" size={20} />
                    <span>{organizer.contacts?.phone || "Phone not specified"}</span>
                  </div>
                  <div className="contact-item">
                    <Globe className="icon" size={20} />
                    <a
                      href={organizer.website?.startsWith("http") ? organizer.website : `https://${organizer.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="website-link"
                    >
                      {organizer.website || "Website not specified"}
                    </a>
                  </div>
                </div>
              </div>

              <div className="section">
                <h2>Social Media</h2>
                <hr />
                <div className="social-links">
                  {organizer.socialMedia?.facebook && (
                    <a
                      href={
                        organizer.socialMedia.facebook.startsWith("http")
                          ? organizer.socialMedia.facebook
                          : `https://${organizer.socialMedia.facebook}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                    >
                      <Facebook size={20} />
                    </a>
                  )}
                  {organizer.socialMedia?.instagram && (
                    <a
                      href={
                        organizer.socialMedia.instagram.startsWith("http")
                          ? organizer.socialMedia.instagram
                          : `https://${organizer.socialMedia.instagram}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                    >
                      <Instagram size={20} />
                    </a>
                  )}
                  {organizer.socialMedia?.linkedin && (
                    <a
                      href={
                        organizer.socialMedia.linkedin.startsWith("http")
                          ? organizer.socialMedia.linkedin
                          : `https://${organizer.socialMedia.linkedin}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                    >
                      <Linkedin size={20} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "posts" && (
            <div className="posts-tab">
              {submittedEvents.filter(event => event.status === 'approved').length > 0 ? (
                <div className="events-grid">
                  {submittedEvents
                    .filter(event => event.status === 'approved')
                    .map((event) => (
                      <EventCard key={event._id} event={event} />
                  ))}
                </div>
              ) : (
                <div className="no-events">
                  <p>No approved events found.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "submitted" && (
            <div className="submitted-events-tab">
              <div className="events-list">
                <EventsTable 
                  events={submittedEvents} 
                  isLoading={isLoadingEvents} 
                  error={eventsError}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Intro Modal - Only name, email, location */}
      {showEditIntro && (
        <div className={`modal-overlay ${isModalClosing && closingModal === "intro" ? "closing" : ""}`}>
          <div className={`modal ${isModalClosing && closingModal === "intro" ? "closing" : ""}`}>
            <div className="modal-header">
              <h2>Edit Profile</h2>
              <button onClick={closeEditIntro} className="close-button">
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleIntroSave}>
                <div className="form-group">
                  <label>Organization Name</label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Organization name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Email address"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={editFormData.location}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Location"
                  />
                </div>
                <div className="form-actions">
                  <button type="button" className="cancel-button" onClick={closeEditIntro}>
                    Cancel
                  </button>
                  <button type="submit" className="save-button">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit About Modal - For description, contact info, and social media */}
      {showEditAbout && (
        <div
          className={`modal-overlay ${isModalClosing && closingModal === "about" ? "closing" : ""}`}
          onClick={(e) => e.target.className.includes("modal-overlay") && !isModalClosing && closeEditAbout()}
        >
          <div className={`modal edit-about-modal ${isModalClosing && closingModal === "about" ? "closing" : ""}`}>
            <div className="modal-header">
              <h2>Edit About</h2>
              <button onClick={closeEditAbout} className="close-button">
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleDescriptionSave}>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={editFormData.description}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Tell us about your organization..."
                    rows={5}
                  />
                </div>
                <div className="form-group">
                  <label>Contact Information</label>
                  <div className="form-row">
                    <Phone size={20} />
                    <input
                      type="tel"
                      value={editFormData.phone}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Phone number"
                    />
                  </div>
                  <div className="form-row">
                    <Globe size={20} />
                    <input
                      type="url"
                      value={editFormData.website}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, website: e.target.value }))}
                      placeholder="Website URL"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Social Media</label>
                  <div className="form-row">
                    <Facebook size={20} />
                    <input
                      type="url"
                      value={editFormData.facebook}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, facebook: e.target.value }))}
                      placeholder="Facebook URL"
                    />
                  </div>
                  <div className="form-row">
                    <Instagram size={20} />
                    <input
                      type="url"
                      value={editFormData.instagram}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, instagram: e.target.value }))}
                      placeholder="Instagram URL"
                    />
                  </div>
                  <div className="form-row">
                    <Linkedin size={20} />
                    <input
                      type="url"
                      value={editFormData.linkedin}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                      placeholder="LinkedIn URL"
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="button" className="cancel-button" onClick={closeEditAbout}>
                    Cancel
                  </button>
                  <button type="submit" className="save-button">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePassword && (
        <div
          className={`modal-overlay ${isModalClosing && closingModal === "password" ? "closing" : ""}`}
          onClick={(e) => e.target.className.includes("modal-overlay") && !isModalClosing && closeChangePassword()}
        >
          <div className={`modal ${isModalClosing && closingModal === "password" ? "closing" : ""}`}>
            <div className="modal-header">
              <h2>Change Password</h2>
              <button onClick={closeChangePassword} className="close-button">
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleChangePassword}>
                <div className="form-group">
                  <label>Current Password</label>
                  <div className="password-input">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      value={changePasswordData.currentPassword}
                      onChange={handlePasswordChange}
                      name="currentPassword"
                      placeholder="Enter current password"
                      autoComplete="off"
                      data-lpignore="true"
                      data-form-type=""
                      className="password-input"
                      required
                    />
                    <button type="button" className="password-toggle" onClick={() => togglePasswordVisibility("current")}>
                      {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <div className="password-input">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      value={changePasswordData.newPassword}
                      onChange={handlePasswordChange}
                      name="newPassword"
                      placeholder="Enter new password"
                      autoComplete="new-password"
                      className="password-input"
                      required
                    />
                    <button type="button" className="password-toggle" onClick={() => togglePasswordVisibility("new")}>
                      {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <div className="password-input">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      value={changePasswordData.confirmPassword}
                      onChange={handlePasswordChange}
                      name="confirmPassword"
                      placeholder="Confirm new password"
                      autoComplete="new-password"
                      className="password-input"
                      required
                    />
                    <button type="button" className="password-toggle" onClick={() => togglePasswordVisibility("confirm")}>
                      {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {passwordError && (
                    <div className="password-error">
                      <span>{passwordError}</span>
                    </div>
                  )}
                </div>
                <div className="form-actions">
                  <button type="button" className="cancel-button" onClick={closeChangePassword}>
                    Cancel
                  </button>
                  <button type="submit" className="save-button" disabled={isChangingPassword}>
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Change Profile Image Modal */}
      {showChangeProfileImage && (
        <div 
          className={`modal-overlay ${isModalClosing && closingModal === "profileImage" ? "closing" : ""}`}
          onClick={(e) => e.target.className.includes("modal-overlay") && !isModalClosing && closeChangeProfileImage()}
        >
          <div className={`modal ${isModalClosing && closingModal === "profileImage" ? "closing" : ""}`}>
            <div className="modal-header">
              <h2>Change Profile Image</h2>
              <button onClick={closeChangeProfileImage} className="close-button">
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="image-upload-container">
                {previewImage ? (
                  <div className="image-preview">
                    <img src={previewImage} alt="Preview" />
                  </div>
                ) : (
                  <label 
                    htmlFor="profile-image" 
                    className="upload-placeholder"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files[0];
                      if (file) {
                        handleImageChange({ target: { files: [file] } });
                      }
                    }}
                  >
                    <Upload size={48} className="upload-icon" />
                    <p>Drag & drop an image here, or click to select</p>
                  </label>
                )}
                <input
                  type="file"
                  id="profile-image"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                {previewImage && (
                  <div style={{ marginTop: '1rem' }}>
                    <button 
                      type="button" 
                      className="file-input-label"
                      onClick={() => document.getElementById('profile-image').click()}
                    >
                      Change Image
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button 
                type="button"
                className="cancel-button"
                onClick={closeChangeProfileImage}
                disabled={isUploading}
              >
                Cancel
              </button>
              <button 
                type="button"
                className="save-button"
                onClick={saveProfileImage}
                disabled={!selectedFile || isUploading}
              >
                {isUploading ? 'Uploading...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {successPopup.show && (
        <div className="success-popup">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <span>{successPopup.message}</span>
        </div>
      )}

      {/* Password Change Success Popup */}
      {showPasswordSuccess && (
        <div className="success-popup">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <span>Password changed successfully!</span>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
