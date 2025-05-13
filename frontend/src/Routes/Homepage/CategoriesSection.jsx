"use client"

import { useState, useRef, useEffect } from "react"
import CategoryCard from "./CategoryCard"
import { categories } from "../../data"

function CategoriesSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef(null)

  const scrollPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const scrollNext = () => {
    if (currentIndex < 2) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  useEffect(() => {
    if (containerRef.current) {
      const scrollAmount = (containerRef.current.scrollWidth / 3) * currentIndex
      containerRef.current.scrollTo({
        left: scrollAmount,
        behavior: "smooth",
      })
    }
  }, [currentIndex])

  return (
    <section className="section categories" id="categories">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Event Categories</h2>
          <p className="section-description">Explore events by category and find your perfect tech experience!</p>
        </div>

        <div className="categories-container" ref={containerRef}>
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>

        <div className="controls-container">
          <div className="controls-center">
            <button className="carousel-button prev-button" onClick={scrollPrev} disabled={currentIndex === 0}>
              <i className="fas fa-chevron-left"></i>
            </button>
            <div className="progress-track">
              <div
                className="progress-indicator"
                style={{
                  width: "33.33%",
                  transform: `translateX(${currentIndex * 100}%)`,
                }}
              ></div>
            </div>
            <button className="carousel-button next-button" onClick={scrollNext} disabled={currentIndex >= 2}>
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CategoriesSection
