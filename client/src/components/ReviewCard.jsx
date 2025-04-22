import React from "react";
import StarRating from "./StarRating";

function ReviewCard({ review }) {
  const formattedDate = new Date(review.created_at).toLocaleString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="review-card">
      <div className="flex justify-between items-center mb-1">
        <span className="font-semibold">
          {review.userFirstName} {review.userLastName}
        </span>
        <span className="dateTime">{formattedDate}</span>
      </div>
      <StarRating rating={review.rating} />
      <p className="comment">"{review.comment}"</p>
    </div>
  );
}

export default ReviewCard;
