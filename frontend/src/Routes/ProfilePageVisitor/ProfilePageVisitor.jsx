"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import "./ProfilePageVisitor.css"
import { 
  Mail, 
  MapPin, 
  Globe, 
  Phone, 
  Facebook, 
  Instagram, 
  Linkedin,
  ExternalLink,
  X,
  Calendar,
  Clock,
  MapPin as LocationIcon
} from "lucide-react"
import { getPublicOrganizerProfile, getPublicOrganizerEvents } from "../../services/organizerService"

function ProfilePageVisitor() {
  const { organizerId } = useParams()
  const [activeTab, setActiveTab] = useState("about")
  const [organizer, setOrganizer] = useState(null)
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showFullImage, setShowFullImage] = useState(false)
  const [fullImageSrc, setFullImageSrc] = useState("")

  // Fetch organizer data
  useEffect(() => {
    const fetchData = async () => {
      if (!organizerId) {
        setError("No organizer ID provided");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch organizer profile and events in parallel
        const [profileResponse, eventsResponse] = await Promise.all([
          getPublicOrganizerProfile(organizerId),
          getPublicOrganizerEvents(organizerId)
        ]);

        if (profileResponse?.success) {
          setOrganizer(profileResponse.data.organizerInfo);
        } else {
          throw new Error(profileResponse?.error || 'Failed to load organizer profile');
        }

        if (eventsResponse?.success) {
          setEvents(eventsResponse.data || []);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Error loading profile data. The profile may be private or not found.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [organizerId]);

  const openFullImage = (src) => {
    if (!src) return;
    setFullImageSrc(src);
    setShowFullImage(true);
  }

  if (isLoading) {
    return (
      <div className="profile-page-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading organizer profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="profile-page-container">
        <div className="error-message">
          <p>{error}</p>
          <p>Please check the URL or try again later.</p>
        </div>
      </div>
    )
  }

  if (!organizer) {
    return (
      <div className="profile-page-container">
        <div className="not-found">
          <p>Organizer not found.</p>
          <p>The requested profile doesn't exist or isn't publicly available.</p>
        </div>
      </div>
    )
  }

  // Format events data to match the expected structure
  const formattedEvents = events.map(event => ({
    _id: event._id,
    title: event.name || event.eventName || 'Event',
    date: event.dates || (event.startDate ? new Date(event.startDate).toLocaleDateString() : 'Date not specified'),
    time: event.time || 'Time not specified',
    location: event.location || 'Location not specified',
    description: event.description || 'No description available',
    imageUrl: event.image || event.thumbnail || 'https://via.placeholder.com/800x400?text=Event+Image'
  }));

  return (
    <div className="profile-page-container">
      {/* Profile Header */}
      <div className="profile-header">
        <div 
          className="profile-logo" 
          onClick={() => openFullImage(organizer.logo)}
          style={{ cursor: organizer.logo ? 'pointer' : 'default' }}
        >
          {organizer.logo ? (
            <img src={organizer.logo} alt={`${organizer.organizationName || 'Organizer'} Logo`} />
          ) : (
            <div className="logo-placeholder">
              {organizer.organizationName?.charAt(0) || 'O'}
            </div>
          )}
        </div>
        <div className="profile-info">
          <div
className="profile-name">
            <h1>{organizer.organizationName || "Organization"}</h1>
          </div>
          <div className="profile-details">
            {organizer.location && (
              <div className="profile-detail">
                <MapPin size={14} />
                <span>{organizer.location}</span>
              </div>
            )}
            {organizer.email && (
              <div className="profile-detail">
                <Mail size={14} />
                <span>{organizer.email}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <div className="tabs">
          <button
            className={`tab ${activeTab === "events" ? "active" : ""}`}
            onClick={() => setActiveTab("events")}
          >
            Events
          </button>
          <button
            className={`tab ${activeTab === "about" ? "active" : ""}`}
            onClick={() => setActiveTab("about")}
          >
            About
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {/* About Tab */}
          {activeTab === "about" && (
            <div className="about-container">
              <div className="about-section">
                <h2>Description</h2>
                <div className="about-content">
                  <p>{organizer.description || "No description available."}</p>
                </div>
              </div>

              <div className="about-section">
                <h2>Contact Information</h2>
                <div className="contact-info">
                  {organizer.email && (
                    <div className="contact-item">
                      <Mail size={20} className="contact-icon" />
                      <span>{organizer.email}</span>
                    </div>
                  )}
                  {organizer.phone && (
                    <div className="contact-item">
                      <Phone size={20} className="contact-icon" />
                      <span>{organizer.phone}</span>
                    </div>
                  )}
                  {organizer.website && (
                    <div className="contact-item">
                      <Globe size={20} className="contact-icon" />
                      <a 
                        href={organizer.website.startsWith('http') ? organizer.website : `https://${organizer.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="website-link"
                      >
                        {organizer.website}
                      </a>
                    </div>
                  )}
                </div>

                {(organizer.socialMedia?.facebook || organizer.socialMedia?.instagram || organizer.socialMedia?.linkedin) && (
                  <div className="social-links">
                    {organizer.socialMedia.facebook && (
                      <a 
                        href={organizer.socialMedia.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                        aria-label="Facebook"
                      >
                        <Facebook size={24} />
                      </a>
                    )}
                    {organizer.socialMedia.instagram && (
                      <a 
                        href={organizer.socialMedia.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                        aria-label="Instagram"
                      >
                        <Instagram size={24} />
                      </a>
                    )}
                    {organizer.socialMedia.linkedin && (
                      <a 
                        href={organizer.socialMedia.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                        aria-label="LinkedIn"
                      >
                        <Linkedin size={24} />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Events Tab */}
          {activeTab === "events" && (
            <div className="events-container">
              {formattedEvents.length > 0 ? (
                <div className="events-grid">
                  {formattedEvents.map((event, index) => (
                    <div key={event._id || index} className="event-card">
                      <div 
                        className="event-image"
                        onClick={() => openFullImage(event.imageUrl)}
                        style={{
                          backgroundImage: `url(${event.imageUrl})`,
                          cursor: 'pointer'
                        }}
                      />
                      <div className="event-details">
                        <h3>{event.title}</h3>
                        <div className="event-meta">
                          <span><Calendar size={16} /> {event.date}</span>
                          <span><Clock size={16} /> {event.time}</span>
                          {event.location && (
                            <span><LocationIcon size={16} /> {event.location}</span>
                          )}
                        </div>
                        <p className="event-description">
                          {event.description}
                        </p>
                        <a 
                          href={`/event/${event._id}`} 
                          className="event-link"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Event <ExternalLink size={16} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-events">
                  <p>No upcoming events found for this organizer.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Full Image Modal */}
      {showFullImage && (
        <div className="image-modal-overlay" onClick={() => setShowFullImage(false)}>
          <div className="image-modal" onClick={(e) => e.stopPropagation()}>
            <button 
              className="close-modal" 
              onClick={() => setShowFullImage(false)}
              aria-label="Close image"
            >
              <X size={24} />
            </button>
            <img 
              src={fullImageSrc} 
              alt="Full size" 
              className="modal-image"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfilePageVisitor