"use client"

import { useState } from "react"

const Sidebar = ({ filters, onFilterChange, id }) => {
  const [showAllTechFields, setShowAllTechFields] = useState(false)
  const [showAllCategories, setShowAllCategories] = useState(false)

  const dateOptions = ["This Week", "This Month", "Other"]
  const categoryOptions = [
    "Hackathon",
    "CTF",
    "Datathon",
    "Conference",
    "Bootcamp",
    "Startup & Innovation",
    "Coding Competition",
    "Other"
  ]
  const techFieldOptions = [
    "Artificial Intelligence",
    "Cybersecurity",
    "Web Development",
    "Mobile Development",
    "Data Science",
    "Game Development",
    "Other"
  ]

  const handleCheckboxChange = (filterType, value) => {
    onFilterChange(filterType, value)
  }

  return (
    <aside className="sidebar" id={id}>
      <h2>Filters</h2>

      <section className="filter-section">
        <h3>Date</h3>
        {dateOptions.map((option) => (
          <label key={option} className="checkbox-label">
            <input
              type="checkbox"
              checked={filters.date.includes(option)}
              onChange={() => handleCheckboxChange("date", option)}
            />
            {option}
          </label>
        ))}
      </section>

      <div className="divider"></div>

      <section className="filter-section">
        <h3>Category</h3>
        {categoryOptions.map((option, index) => (
          <label
            key={option}
            className="checkbox-label"
            style={{ display: !showAllCategories && index >= 4 ? "none" : "flex" }}
          >
            <input
              type="checkbox"
              checked={filters.category.includes(option)}
              onChange={() => handleCheckboxChange("category", option)}
            />
            {option}
          </label>
        ))}
        {categoryOptions.length > 4 && (
          <button className="show-more-button" onClick={() => setShowAllCategories(!showAllCategories)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={showAllCategories ? "rotate-arrow" : ""}
            >
              <polyline points={showAllCategories ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline>
            </svg>
          </button>
        )}
      </section>

      <div className="divider"></div>

      <section className="filter-section">
        <h3>TechFields</h3>
        {techFieldOptions.map((option, index) => (
          <label
            key={option}
            className="checkbox-label"
            style={{ display: !showAllTechFields && index >= 4 ? "none" : "flex" }}
          >
            <input
              type="checkbox"
              checked={filters.techFields.includes(option)}
              onChange={() => handleCheckboxChange("techFields", option)}
            />
            {option}
          </label>
        ))}
        {techFieldOptions.length > 4 && (
          <button className="show-more-button" onClick={() => setShowAllTechFields(!showAllTechFields)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={showAllTechFields ? "rotate-arrow" : ""}
            >
              <polyline points={showAllTechFields ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline>
            </svg>
          </button>
        )}
      </section>
    </aside>
  )
}

export default Sidebar
