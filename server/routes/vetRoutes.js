import express from "express";
import app from "../index.js";
import {
  getAllVetsQuery,
  getVetByIdWithReviewsQuery,
} from "../queries/vetQueries.js";
import Vet from "../models/Vet.js";
import Review from "../models/Review.js";

const router = express.Router();

router.get("/", (req, res) => {
  const dbConnection = app.locals.dbConnection;

  if (!dbConnection) {
    return res
      .status(500)
      .json({ error: "Database connection is not established." });
  }

  dbConnection.query(getAllVetsQuery, (err, result) => {
    if (err) {
      console.error("Error fetching vets:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "No vets found" });
    }

    res.json(result);
  });
});

router.get("/:vetId", (req, res) => {
  const dbConnection = app.locals.dbConnection;

  const { vetId } = req.params;

  if (!dbConnection) {
    return res
      .status(500)
      .json({ error: "Database connection is not established." });
  }

  dbConnection.query(getVetByIdWithReviewsQuery, [vetId], (err, result) => {
    if (err) {
      console.error("Error fetching vet data:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Vet not found" });
    }

    const row = result[0];
    const vet = new Vet(
      row.vetId,
      row.vetFirstName,
      row.vetLastName,
      row.specialization,
      row.phone_number
    );

    const reviews = result
      .filter((r) => r.reviewId !== null)
      .map((r) => {
        const review = new Review(
          r.reviewId,
          r.vet_id,
          r.user_id,
          r.rating,
          r.comment,
          r.created_at
        );

        return {
          ...review,
          userFirstName: r.userFirstName,
          userLastName: r.userLastName,
        };
      });

    res.json({
      vet,
      reviews,
    });
  });
});

export default router;
