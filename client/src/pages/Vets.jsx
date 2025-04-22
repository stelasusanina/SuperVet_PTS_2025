import { useEffect, useState } from "react";
import axios from "axios";
import VetCard from "../components/VetCard";
import "../style/VetCard.css";

function VetsList() {
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("/vets")
      .then((response) => {
        console.log("Fetched data:", response.data);
        setVets(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.error || "Failed to fetch vets");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (vets.length === 0) return <p>No vets found.</p>;

  return (
    <div>
      <h2>Veterinarians List</h2>
      <div className="vet-list">
        <div className="vet-cards-container">
          {vets.map((vet) => (
            <VetCard key={vet.id} vet={vet} /> 
          ))}
        </div>
      </div>
    </div>
  );
}

export default VetsList;
