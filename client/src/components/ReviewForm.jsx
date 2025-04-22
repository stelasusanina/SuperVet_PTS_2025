import React, { useState } from "react";
import axios from "axios";
import "../style/ReviewForm.css";

function ReviewForm({ vetId, onReviewAdded }) {
  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/reviews", {
        vet_id: vetId,
        userFirstName,
        userLastName,
        rating,
        comment,
      });

      setUserFirstName("");
      setUserLastName("");
      setComment("");
      setRating(5);

      if (onReviewAdded) {
        onReviewAdded();
      }
    } catch (err) {
      console.error("Failed to submit review", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <h3 className="review-form__title">Add a Review</h3>

      <div className="review-form__input-group">
        <div className="review-form__input-container">
          <label className="review-form__label">First Name</label>
          <input
            type="text"
            value={userFirstName}
            onChange={(e) => setUserFirstName(e.target.value)}
            required
            className="review-form__input"
          />
        </div>
        <div className="review-form__input-container">
          <label className="review-form__label">Last Name</label>
          <input
            type="text"
            value={userLastName}
            onChange={(e) => setUserLastName(e.target.value)}
            required
            className="review-form__input"
          />
        </div>
      </div>

      <div>
        <label className="review-form__label">Rating (1-5)</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="review-form__input"
        >
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="review-form__label">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          className="review-form__textarea"
        />
      </div>

      <button type="submit" className="review-form__submit">
        Submit Review
      </button>
    </form>
  );
}

export default ReviewForm;