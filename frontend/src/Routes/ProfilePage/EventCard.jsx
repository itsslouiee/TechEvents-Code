"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { MapPin, Calendar, Clock, ExternalLink, ArrowRight } from "lucide-react"

const EventCard = ({ event }) => {
  const navigate = useNavigate()
  const [imageError, setImageError] = useState(false);
  const [imageStatus, setImageStatus] = useState('loading');

  useEffect(() => {
    if (event?.logo) {
      const img = new Image();
      img.onload = () => setImageStatus('loaded');
      img.onerror = () => {
        setImageStatus('error');
        setImageError(true);
      };
      img.src = event.logo;
    }
  }, [event?.logo]);

  if (!event) return null

  const formattedDate = event.startDate
    ? new Date(event.startDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Date not specified"

  const handleViewEvent = (e) => {
    e.stopPropagation()
    // navigate(`/event/${event._id}`)
  }

  return (
    <div className="event-card" onClick={handleViewEvent}>
      {/* Event Image */}
      <div className="event-image-container">
        {imageStatus === 'loaded' ? (
          <img
            src={event.logo}
            alt={event.eventName || "Event"}
            className="event-image"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block'
            }}
          />
        ) : imageStatus === 'error' ? (
          <div className="simple-no-image">
            No image available
          </div>
        ) : (
          <div className="image-loading">
            Loading...
          </div>
        )}
      </div>

      {/* Event Content */}
      <div className="event-card-content">
        <div className="event-card-header">
          <h3 className="event-title">{event.eventName || "Untitled Event"}</h3>
          <span className={`event-status ${event.status || "pending"}`}>
            {event.status ? event.status.charAt(0).toUpperCase() + event.status.slice(1) : "Pending"}
          </span>
        </div>

        <div className="event-details">
          <div className="event-detail">
            <Calendar size={18} className="detail-icon" />
            <span className="detail-text">{formattedDate}</span>
          </div>

          {event.startTime && (
            <div className="event-detail">
              <Clock size={18} className="detail-icon" />
              <span className="detail-text">{event.startTime}</span>
            </div>
          )}

          <div className="event-detail">
            <MapPin size={18} className="detail-icon" />
            <span className="detail-text">
              {event.locationType === "Online" ? "Online Event" : event.city || "Location not specified"}
            </span>
          </div>

          {event.description && <p className="event-description">{event.description}</p>}
        </div>

        <div className="event-actions">
          {event.registrationLink && (
            <a
              href={event.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="event-link"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={16} />
              Register
            </a>
          )}
          <button className="view-event-btn-new" onClick={handleViewEvent}>
            View Event
            <ArrowRight size={16} className="button-icon-right" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default EventCard
