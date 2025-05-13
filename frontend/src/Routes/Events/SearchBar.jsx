"use client"

import { useState } from "react"

const SearchBar = ({ onSearchChange, initialWilaya }) => {
  const [search, setSearch] = useState("")
  const [wilaya, setWilaya] = useState(initialWilaya || "All")

  const wilayas = [
    "All",
    "Online",
    "Algiers",
    "Oran",
    "Bejaia",
    "Constantine",
    "Annaba",
    "Setif",
    "Batna",
    "Other"
  ]

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
    onSearchChange(e.target.value, wilaya)
  }

  const handleWilayaChange = (e) => {
    setWilaya(e.target.value)
    onSearchChange(search, e.target.value)
  }

  return (
    <div className="search-page-container">
      <div className="search-page-bar">
        <input
          type="text"
          placeholder="Search . . ."
          value={search}
          onChange={handleSearchChange}
          className="search-page-input"
        />
        <button className="search-page-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </div>
      <div className="search-page-location">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        <select value={wilaya} onChange={handleWilayaChange} className="search-page-wilaya">
          {wilayas.map((w) => (
            <option key={w} value={w}>
              {w}
            </option>
          ))}
        </select>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="search-page-chevron"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
    </div>
  )
}

export default SearchBar
