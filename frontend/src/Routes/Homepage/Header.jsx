"use client"

import { useState } from "react"

function Header({ isLoggedIn = true }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      let headerOffset = 80; // Height of your fixed header
      if (sectionId === 'categories') headerOffset -= 70; // Scroll a bit further for categories
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });

      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }
  }

  const handlePostEvent = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      window.location.href = '/login';
    }
  }

  return (
    <>
      <header className="header">
        <div className="logo">
          <a href="/">
            <img
              src="/images/Logo.png"
              alt="TechEvents Logo"
              className="logo-image"
            />
          </a>
        </div>

        <nav className="main-nav">
          <a href="/events" className="nav-link">
            Events
          </a>
          <a href="#categories" onClick={(e) => { e.preventDefault(); scrollToSection('categories'); }} className="nav-link">
            Categories
          </a>
          <a href="#footer" onClick={(e) => { e.preventDefault(); scrollToSection('footer'); }} className="nav-link">
            About
          </a>
        </nav>

        <div className="header-right">
          <div className="cta-button">
            <a href={isLoggedIn ? "/VerifyEmail" : "/login"} className="button primary-button" onClick={handlePostEvent}>
              Post An Event
            </a>
          </div>
          
          {isLoggedIn && (
            <a href="/profile" className="user-profile">
              <img
                src="/images/avatar.png"
                alt="User Profile"
                className="profile-image"
              />
            </a>
          )}
        </div>

        <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <i className="fas fa-bars"></i>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? "active" : ""}`}>
        <a href="/events" className="mobile-nav-link">
          Events
        </a>
        <a href="#categories" onClick={(e) => { e.preventDefault(); scrollToSection('categories'); }} className="mobile-nav-link">
          Categories
        </a>
        <a href="#footer" onClick={(e) => { e.preventDefault(); scrollToSection('footer'); }} className="mobile-nav-link">
          About
        </a>
        <a href={isLoggedIn ? "/post-event" : "/login"} className="mobile-nav-link cta" onClick={handlePostEvent}>
          Post An Event
        </a>
      </div>
    </>
  )
}

export default Header
