"use client"

import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import Sidebar from "./SideBar"
import EventList from "./EventList"
import SearchBar from "./SearchBar"
import { getAllEvents } from "../../api/eventApi"
import "../../styles.css"

const EventsPage = () => {
  const location = useLocation();
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [filters, setFilters] = useState({
    search: "",
    wilaya: "All",
    date: [],
    category: [],
    techFields: [],
  })
  const [sortBy, setSortBy] = useState("views")

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getAllEvents(sortBy)
        console.log('Fetched events:', data)
        setEvents(data)
        setFilteredEvents(data)
      } catch (err) {
        console.error('Error fetching events:', err)
      }
    }

    fetchEvents()
  }, [sortBy])

  useEffect(() => {
    // If there is a search or category param in the URL, set it as the initial filter
    const params = new URLSearchParams(location.search);
    const searchParam = params.get("search") || "";
    const categoryParam = params.get("category") || "";
    setFilters((prev) => ({
      ...prev,
      search: searchParam,
      category: categoryParam ? [categoryParam] : [],
    }));
  }, [location.search]);

  useEffect(() => {
    applyFilters()
  }, [filters, events])

  useEffect(() => {
    if (window.location.hash === "#filters") {
      setTimeout(() => {
        const el = document.getElementById("events-top");
        if (el) {
          el.scrollIntoView({ behavior: "auto", block: "start" });
          window.scrollBy(0, -70); // adjust offset as needed
        }
      }, 100);
    }
  }, []);

  const applyFilters = () => {
    let result = [...events]

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      result = result.filter((event) => event.name.toLowerCase().includes(searchTerm))
    }

    // Apply wilaya filter
    if (filters.wilaya && filters.wilaya !== "All") {
      const mainWilayas = ["Algiers", "Oran", "Bejaia", "Constantine", "Annaba", "Setif", "Batna"]
      if (filters.wilaya === "Other") {
        result = result.filter((event) => {
          const eventWilaya = event.location.split(",")[0].trim()
          return !mainWilayas.some(wilaya => event.location.includes(wilaya))
        })
      } else {
        result = result.filter((event) => event.location.includes(filters.wilaya))
      }
    }

    // Apply category filters
    if (filters.category.length > 0) {
      const predefinedCategories = [
        "Hackathon",
        "CTF",
        "Datathon",
        "Conference",
        "Bootcamp",
        "Startup & Innovation",
        "Coding Competition"
      ];

      result = result.filter((event) => {
        if (filters.category.includes("Other")) {
          // For "Other", show events that don't have any predefined categories
          if (Array.isArray(event.category)) {
            return !event.category.some(cat => predefinedCategories.includes(cat));
          }
          return !predefinedCategories.includes(event.category);
        } else {
          // For regular categories, show events that match the selected categories
          if (Array.isArray(event.category)) {
            return event.category.some(cat => filters.category.includes(cat));
          }
          return filters.category.includes(event.category);
        }
      });
    }

    // Apply tech fields filters
    if (filters.techFields.length > 0) {
      const predefinedTechFields = [
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
        "Startup & Entrepreneurship"
      ];

      result = result.filter((event) => {
        if (filters.techFields.includes("Other")) {
          // For "Other", show events that don't have any predefined tech fields
          if (!event.techField || !Array.isArray(event.techField)) return true;
          return !event.techField.some(tech => predefinedTechFields.includes(tech));
        } else {
          // For regular tech fields, show events that match the selected tech fields
          if (!event.techField || !Array.isArray(event.techField)) return false;
          return event.techField.some(tech => filters.techFields.includes(tech));
        }
      });
    }

    // Apply date filters
    if (filters.date.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to start of day

      const thisWeekEnd = new Date(today);
      thisWeekEnd.setDate(today.getDate() + (7 - today.getDay()));
      thisWeekEnd.setHours(23, 59, 59, 999); // Set to end of day

      const thisMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      thisMonthEnd.setHours(23, 59, 59, 999); // Set to end of day

      result = result.filter((event) => {
        try {
          if (!event.deadline) return false;
          
          const eventDeadline = new Date(event.deadline);
          if (isNaN(eventDeadline.getTime())) return false;

        return filters.date.some((dateFilter) => {
            switch (dateFilter) {
              case "This Week":
                return eventDeadline >= today && eventDeadline <= thisWeekEnd;
              case "This Month":
                return eventDeadline >= today && eventDeadline <= thisMonthEnd;
              case "Other":
                // Show events with deadlines after this month
                return eventDeadline > thisMonthEnd || eventDeadline < today;
              default:
                return false;
            }
          });
        } catch (error) {
          console.error('Error processing deadline:', error);
          return false;
        }
      });
    }

    setFilteredEvents(result)
  }

  const handleSearchChange = (search, wilaya) => {
    setFilters({
      ...filters,
      search,
      wilaya,
    })
  }

  const handleFilterChange = (filterType, value) => {
    let updatedFilter

    if (filters[filterType].includes(value)) {
      updatedFilter = filters[filterType].filter((item) => item !== value)
    } else {
      updatedFilter = [...filters[filterType], value]
    }

    setFilters({
      ...filters,
      [filterType]: updatedFilter,
    })
  }

  const handleSortChange = (value) => {
    setSortBy(value)
  }

  return (
    <div className="events-page">
      <header className="header-page">
        <div className="header-page-content">
          <h1>Explore a world of events. Find what excites you!</h1>
          <div className="search-page">
            <SearchBar onSearchChange={handleSearchChange} initialWilaya={filters.wilaya} />
          </div>
        </div>
      </header>
      <div className="content-container" id="events-top">
        <Sidebar filters={filters} onFilterChange={handleFilterChange} id="filters" />
        <main className="main-content">
          <div className="sort-container">
            <span>Sort by:</span>
            <select value={sortBy} onChange={(e) => handleSortChange(e.target.value)} className="sort-dropdown">
              <option value="views">relevance</option>
              <option value="deadline">date</option>
            </select>
          </div>
          <EventList events={filteredEvents} />
        </main>
      </div>
    </div>
  )
}

export default EventsPage
