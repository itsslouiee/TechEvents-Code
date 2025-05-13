"use client"

import { useState } from "react"
import techeventslogo from "./Images/TechEvents.png"

function CategorySelection({ onCategorySelect }) {
  const [selectedCategory, setSelectedCategory] = useState("hackathon")

  const handleNext = () => {
    if (onCategorySelect) {
      // Convert category to title case before passing it up
      const formattedCategory = selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);
      onCategorySelect(formattedCategory);
    }
  }

  // Style for category options with cursor pointer - BIGGER SIZE
  const categoryOptionStyle = {
    marginBottom: '20px',  // Increased margin
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    padding: '10px 15px',  // Added padding
    borderRadius: '8px',   // Added rounded corners
    transition: 'background-color 0.2s ease',
  }

  // Style for radio inputs with cursor pointer - BIGGER SIZE
  const radioInputStyle = {
    width: '24px',         // Increased size
    height: '24px',        // Increased size
    marginRight: '15px',   // Increased margin
    accentColor: '#615e9f',
    cursor: 'pointer'
  }

  // Style for labels with cursor pointer - BIGGER SIZE
  const labelStyle = {
    display: 'inline', 
    margin: '0', 
    cursor: 'pointer',
    fontSize: '18px',      // Increased font size
    fontWeight: '500',     // Added medium weight
    color: '#170e4b'
  }

  // Style for the next button with hover effect
  const [nextButtonHover, setNextButtonHover] = useState(false)
  const nextButtonStyle = {
    display: 'block',
    width: '80%',
    maxWidth: '300px',
    margin: '50px auto',
    border: 'none',
    borderRadius: '35px',
    padding: '15px',
    color: '#fff',
    background: nextButtonHover ? 'rgb(174, 0, 255)' : '#6f62c3',
    fontSize: 'clamp(18px, 4vw, 23px)',
    textTransform: 'capitalize',
    fontWeight: '350',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
  }

  // Hover effect for category options
  const [hoveredCategory, setHoveredCategory] = useState(null)

  return (
    <div className="form-page">
      <style>
        @import
        url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');
      </style>
      <img src={techeventslogo} alt="logo" />
      <div className="White-Container">
        <h3>Choose the category of your event</h3>
        <h4>First step</h4>

        <div className="category-container" style={{ width: '85%', maxWidth: '450px', margin: '0 auto', textAlign: 'left' }}>
          {/* Hackathon */}
          <div 
            className="category-option" 
            style={{
              ...categoryOptionStyle,
              backgroundColor: hoveredCategory === "hackathon" ? '#f5f4ff' : 'transparent',
            }} 
            onClick={() => setSelectedCategory("hackathon")}
            onMouseEnter={() => setHoveredCategory("hackathon")}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <input 
              type="radio" 
              id="hackathon" 
              name="category" 
              value="Hackathon"
              checked={selectedCategory === "hackathon"}
              onChange={() => setSelectedCategory("hackathon")}
              style={radioInputStyle}
            />
            <label htmlFor="hackathon" style={labelStyle}>Hackathon</label>
          </div>
          
          {/* Datathon */}
          <div 
            className="category-option" 
            style={{
              ...categoryOptionStyle,
              backgroundColor: hoveredCategory === "datathon" ? '#f5f4ff' : 'transparent',
            }} 
            onClick={() => setSelectedCategory("datathon")}
            onMouseEnter={() => setHoveredCategory("datathon")}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <input 
              type="radio" 
              id="datathon" 
              name="category" 
              value="Datathon"
              checked={selectedCategory === "datathon"}
              onChange={() => setSelectedCategory("datathon")}
              style={radioInputStyle}
            />
            <label htmlFor="datathon" style={labelStyle}>Datathon</label>
          </div>
          
          {/* CTF */}
          <div 
            className="category-option" 
            style={{
              ...categoryOptionStyle,
              backgroundColor: hoveredCategory === "ctf" ? '#f5f4ff' : 'transparent',
            }} 
            onClick={() => setSelectedCategory("ctf")}
            onMouseEnter={() => setHoveredCategory("ctf")}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <input 
              type="radio" 
              id="ctf" 
              name="category" 
              value="CTF"
              checked={selectedCategory === "ctf"}
              onChange={() => setSelectedCategory("ctf")}
              style={radioInputStyle}
            />
            <label htmlFor="ctf" style={labelStyle}>CTF</label>
          </div>
          
          {/* Bootcamp */}
          <div 
            className="category-option" 
            style={{
              ...categoryOptionStyle,
              backgroundColor: hoveredCategory === "bootcamp" ? '#f5f4ff' : 'transparent',
            }} 
            onClick={() => setSelectedCategory("bootcamp")}
            onMouseEnter={() => setHoveredCategory("bootcamp")}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <input 
              type="radio" 
              id="bootcamp" 
              name="category" 
              value="Bootcamp"
              checked={selectedCategory === "bootcamp"}
              onChange={() => setSelectedCategory("bootcamp")}
              style={radioInputStyle}
            />
            <label htmlFor="bootcamp" style={labelStyle}>Bootcamp</label>
          </div>
          
          {/* Conference */}
          <div 
            className="category-option" 
            style={{
              ...categoryOptionStyle,
              backgroundColor: hoveredCategory === "conference" ? '#f5f4ff' : 'transparent',
            }} 
            onClick={() => setSelectedCategory("conference")}
            onMouseEnter={() => setHoveredCategory("conference")}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <input 
              type="radio" 
              id="conference" 
              name="category" 
              value="Conference"
              checked={selectedCategory === "conference"}
              onChange={() => setSelectedCategory("conference")}
              style={radioInputStyle}
            />
            <label htmlFor="conference" style={labelStyle}>Conference</label>
          </div>
          
          {/* Startup and Innovation */}
          <div 
            className="category-option" 
            style={{
              ...categoryOptionStyle,
              backgroundColor: hoveredCategory === "startup" ? '#f5f4ff' : 'transparent',
            }} 
            onClick={() => setSelectedCategory("startup")}
            onMouseEnter={() => setHoveredCategory("startup")}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <input 
              type="radio" 
              id="startup" 
              name="category" 
              value="Startup and Innovation"
              checked={selectedCategory === "startup"}
              onChange={() => setSelectedCategory("startup")}
              style={radioInputStyle}
            />
            <label htmlFor="startup" style={labelStyle}>Startup and Innovation</label>
          </div>
          
          {/* Coding Competition */}
          <div 
            className="category-option" 
            style={{
              ...categoryOptionStyle,
              backgroundColor: hoveredCategory === "coding" ? '#f5f4ff' : 'transparent',
            }} 
            onClick={() => setSelectedCategory("coding")}
            onMouseEnter={() => setHoveredCategory("coding")}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <input 
              type="radio" 
              id="coding" 
              name="category" 
              value="Coding Competition"
              checked={selectedCategory === "coding"}
              onChange={() => setSelectedCategory("coding")}
              style={radioInputStyle}
            />
            <label htmlFor="coding" style={labelStyle}>Coding Competition</label>
          </div>
          
          {/* Other */}
          <div 
            className="category-option" 
            style={{
              ...categoryOptionStyle,
              backgroundColor: hoveredCategory === "other" ? '#f5f4ff' : 'transparent',
            }} 
            onClick={() => setSelectedCategory("other")}
            onMouseEnter={() => setHoveredCategory("other")}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <input 
              type="radio" 
              id="other" 
              name="category" 
              value="Other"
              checked={selectedCategory === "other"}
              onChange={() => setSelectedCategory("other")}
              style={radioInputStyle}
            />
            <label htmlFor="other" style={labelStyle}>Other</label>
          </div>
        </div>

        <button 
          onClick={handleNext}
          type="button"
          style={nextButtonStyle}
          onMouseEnter={() => setNextButtonHover(true)}
          onMouseLeave={() => setNextButtonHover(false)}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default CategorySelection