import React from "react";
import "../style/StarRating.css";

function StarRating({ rating }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const totalStars = 5;

  return (
    <div className="star-rating">
      {[...Array(totalStars)].map((_, i) => {
        if (i < fullStars) {
          return <span key={i} className="star full">★</span>;
        } else if (i === fullStars && hasHalfStar) {
          return <span key={i} className="star half">★</span>;
        } else {
          return <span key={i} className="star">★</span>;
        }
      })}
    </div>
  );
}

export default StarRating;
