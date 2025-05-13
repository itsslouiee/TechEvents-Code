"use client"

import React, { useState } from "react"
import { Calendar, MapPin } from "react-feather"

const Tabs = ({ defaultValue, className, children, onValueChange, ...props }) => {
  const [activeTab, setActiveTab] = useState(defaultValue)

  const handleValueChange = (value) => {
    setActiveTab(value)
    if (onValueChange) {
      onValueChange(value)
    }
  }

  // Clone children with additional props
  const enhancedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child

    return React.cloneElement(child, {
      activeTab,
      onValueChange: handleValueChange,
    })
  })

  return (
    <div className={className} {...props}>
      {enhancedChildren}
    </div>
  )
}

const TabsList = React.forwardRef(({ className, children, activeTab, onValueChange, ...props }, ref) => {
  // Clone children with additional props
  const enhancedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child

    return React.cloneElement(child, {
      activeTab,
      onValueChange,
    })
  })

  return (
    <div ref={ref} className={className} {...props}>
      {enhancedChildren}
    </div>
  )
})
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef(({ className, value, children, activeTab, onValueChange, ...props }, ref) => {
  const isActive = activeTab === value

  return (
    <button
      ref={ref}
      className={className}
      onClick={() => onValueChange(value)}
      data-state={isActive ? "active" : "inactive"}
      {...props}
    >
      {children}
    </button>
  )
})
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef(({ className, value, children, activeTab, ...props }, ref) => {
  const isActive = activeTab === value

  if (!isActive) return null

  return (
    <div ref={ref} className={className} data-state={isActive ? "active" : "inactive"} {...props}>
      {children}
    </div>
  )
})
TabsContent.displayName = "TabsContent"

const SubmittedEventsTab = ({ events, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="submitted-events-loading">
        <div className="loading-spinner"></div>
        <p>Loading your submitted events...</p>
      </div>
    )
  }

  if (error) {
    return <div className="error-message">{error}</div>
  }

  if (!events || events.length === 0) {
    return (
      <div className="no-events-message">
        <p>No events submitted yet.</p>
      </div>
    )
  }

  return (
    <div className="submitted-events">
      <h3>Your Submitted Events</h3>
      <div className="events-grid">
        {events.map((event) => (
          <div key={event._id} className="event-card">
            <div className="event-image">
              {event.image ? (
                <img src={event.image} alt={event.title} />
              ) : (
                <div className="event-image-placeholder">
                  <Calendar size={48} />
                </div>
              )}
            </div>
            <div className="event-details">
              <h4>{event.title}</h4>
              <p className="event-date">
                <Calendar size={16} /> {new Date(event.date).toLocaleDateString()}
              </p>
              <p className="event-location">
                <MapPin size={16} /> {event.location}
              </p>
              <div className="event-status">
                <span className={`status-badge ${event.status}`}>
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </span>
              </div>
              <p className="event-description">
                {event.description.length > 100
                  ? `${event.description.substring(0, 100)}...`
                  : event.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, SubmittedEventsTab }
