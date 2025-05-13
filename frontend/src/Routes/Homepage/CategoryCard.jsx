import { useNavigate } from "react-router-dom";

function CategoryCard({ category }) {
  const navigate = useNavigate();

  // Map plural category names to their singular forms
  const getSingularCategory = (pluralCategory) => {
    const categoryMap = {
      "Hackathons": "Hackathon",
      "CTFs": "CTF",
      "Datathons": "Datathon",
      "Conferences": "Conference",
      "Bootcamps": "Bootcamp",
      "Startup & Innovation Events": "Startup & Innovation",
      "Coding Competitions": "Coding Competition"
    };
    return categoryMap[pluralCategory] || pluralCategory;
  };

  const handleClick = () => {
    const singularCategory = getSingularCategory(category.title);
    navigate(`/events?category=${encodeURIComponent(singularCategory)}#filters`);
  };

  return (
    <div className="category-card" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <img src={category.imageUrl} alt={category.title} className="category-image" />
      <div className="category-overlay"></div>
      <div className="category-content">
        <h3 className="category-title">{category.title}</h3>
        <div>
          <p className="category-description">{category.description}</p>
          <p className="click-for-more">Click for more</p>
        </div>
      </div>
    </div>
  )
}

export default CategoryCard
  