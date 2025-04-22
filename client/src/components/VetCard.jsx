import React from "react";
import { Link } from "react-router-dom";
import "../style/VetCard.css";
import StarRating from "./StarRating";

function VetCard({ vet }) {
  return (
    <Link to={`/vets/${vet.id}`} className="vet-link">
      <div className="vet-card">
        <div className="name-rating">
          <h3>
            Dr. {vet.firstName} {vet.lastName}
          </h3>
          <StarRating rating={vet.avg_rating} />
        </div>
        <p>
          <strong>Specialization:</strong> {vet.specialization}
        </p>
        <p>
          <strong>Phone:</strong> {vet.phone_number}
        </p>
      </div>
    </Link>
  );
}

export default VetCard;
