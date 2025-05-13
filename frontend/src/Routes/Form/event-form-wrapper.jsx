"use client"

import { useState, useEffect } from "react"
import CategorySelection from "./category-selection"
import Form from "./Form" // Import your existing Form component

function EventFormWrapper() {
  // Start with step 1 (category selection) by default
  const [step, setStep] = useState(1)
  const [category, setCategory] = useState("")

  // Remove the auto-skip to form if category exists in localStorage
  // This ensures the user always sees the category page first
  
  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory)
    localStorage.setItem("eventCategory", selectedCategory)
    setStep(2) // Move to form after category selection
  }

  const handleBackToCategories = () => {
    setStep(1)
  }

  return (
    <>
      {step === 1 ? (
        <CategorySelection onCategorySelect={handleCategorySelect} />
      ) : (
        <Form selectedCategory={category} onBack={handleBackToCategories} />
      )}
    </>
  )
}

export default EventFormWrapper