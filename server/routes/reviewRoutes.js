import express from "express";
import {
  addNewReviewQuery,
  getUserIdByNameQuery,
} from "../queries/reviewQueries.js";

const router = express.Router();

export async function handleAddReview(req, res) {
  const dbConnection = req.app.locals.dbConnection;
  const { vet_id, userFirstName, userLastName, rating, comment } = req.body;

  if (!dbConnection) {
    return res
      .status(500)
      .json({ error: "Database connection is not established." });
  }

  if (!vet_id || !userFirstName || !userLastName || !rating || !comment) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  dbConnection.query(
    getUserIdByNameQuery,
    [userFirstName, userLastName],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Failed to find user." });
      }

      if (results.length > 0) {
        const user_id = results[0].id;

        dbConnection.query(
          addNewReviewQuery,
          [vet_id, user_id, rating, comment],
          (err) => {
            if (err) {
              return res.status(500).json({ error: "Failed to add review." });
            }

            res.status(201).json({ message: "Review added successfully." });
          }
        );
      } else {
        return res.status(404).json({ error: "User not found." });
      }
    }
  );
}

router.post("/", handleAddReview);

export default router;
