import express from "express";
import FreeHour from "../models/FreeHour.js";
import { getFreeHoursByVetIdQuery } from "../queries/availableHoursQueries.js";

const router = express.Router();

export async function getFreeHoursByVetId(req, res) {
  const dbConnection = req.app.locals.dbConnection;
  const { vetId } = req.params;

  if (!dbConnection) {
    return res
      .status(500)
      .json({ error: "Database connection is not established." });
  }

  dbConnection.query(getFreeHoursByVetIdQuery, [vetId], (err, result) => {
    if (err) {
      console.error("Error fetching free hours:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "No free hours found for this vet" });
    }

    const freeHours = result.map(
      (row) => new FreeHour(row.id, row.vet_id, row.date_time)
    );

    res.json(freeHours);
  });
}

router.get("/:vetId", getFreeHoursByVetId);

export default router;