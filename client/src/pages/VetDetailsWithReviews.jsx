import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ReviewCard from "../components/ReviewCard";
import ReviewForm from "../components/ReviewForm";
import "../style/ReviewCard.css";
import "../style/FreeHour.css";

function VetDetailsWithReviews() {
  const { id } = useParams();
  const [vet, setVet] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [availableHours, setAvailableHours] = useState([]);
  const [selectedHour, setSelectedHour] = useState(null);

  useEffect(() => {
    axios
      .get(`/vets/${id}`)
      .then((response) => {
        setVet(response.data.vet);
        setReviews(response.data.reviews);
      })
      .catch((err) => {
        console.error("Error fetching vet details or reviews", err);
      });

    axios
      .get(`/availableHours/${id}`)
      .then((response) => {
        setAvailableHours(response.data); 
      })
      .catch((err) => {
        console.error("Error fetching free hours", err);
      });
  }, [id]);

  const refreshReviews = () => {
    axios
      .get(`/vets/${id}`)
      .then((response) => {
        setReviews(response.data.reviews);
        window.scrollTo(0, 0);
      })
      .catch((err) => {
        console.error("Error fetching updated reviews", err);
      });
  };

  const handleHourSelection = (hour) => {
    setSelectedHour(hour); 
  };

  const handleConfirmAppointment = () => {
    if (!selectedHour) {
      alert("Please select a free hour.");
      return;
    }

    const appointmentData = {
      user_id: 1,
      vet_id: vet.id,
      date_time: selectedHour.date_time,
      freeHourId: selectedHour.id, 
    };

    axios
      .post("/appointments", appointmentData)
      .then((response) => {
        alert("Appointment confirmed!");

        setAvailableHours((prevHours) =>
          prevHours.filter((hour) => hour.id !== selectedHour.id) 
        );
        setSelectedHour(null);
      })
      .catch((err) => {
        console.error("Error confirming appointment", err);
      });
  };

  return (
    <div className="vet-details">
      {vet && (
        <div>
          <h2>Dr. {`${vet.firstName} ${vet.lastName}`}</h2>
          <h4>{vet.specialization}</h4>
          <h4>{vet.phone_number}</h4>

          <div>
            <h5>Available Hours:</h5>
            {availableHours.length === 0 ? (
              <p>No free hours available at the moment.</p>
            ) : (
              <div className="free-hours-container">
                {availableHours.map((freeHour) => (
                  <div
                    key={freeHour.id}
                    className={`free-hour-item ${selectedHour && selectedHour.id === freeHour.id ? "selected" : ""}`}
                    onClick={() => handleHourSelection(freeHour)}
                  >
                    {new Date(freeHour.date_time).toLocaleString()}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleConfirmAppointment}
            className="confirm-appointment-btn"
            disabled={!selectedHour} 
          >
            Confirm Appointment
          </button>

          <div className="reviews">
            {reviews.length === 0 ? (
              <p>No reviews yet!</p>
            ) : (
              reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))
            )}
          </div>

          <ReviewForm vetId={id} onReviewAdded={refreshReviews} />
        </div>
      )}
    </div>
  );
}

export default VetDetailsWithReviews;
