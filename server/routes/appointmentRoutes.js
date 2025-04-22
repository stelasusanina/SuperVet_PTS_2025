import express from "express";

import { createAppointmentQuery } from "../queries/appointmentQueries.js";
import { markHourUnavailableQuery } from "../queries/availableHoursQueries.js";
import Appointment from "../models/Appointment.js";

const router = express.Router();

export async function createAppointmentHandler(req, res) {
  const dbConnection = req.app.locals.dbConnection;
  const { user_id, vet_id, date_time, freeHourId } = req.body;

  if (!dbConnection) {
    return res
      .status(500)
      .json({ error: "Database connection is not established." });
  }

  if (!user_id || !vet_id || !date_time || !freeHourId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  dbConnection.query(
    createAppointmentQuery,
    [user_id, vet_id, date_time],
    (err, result) => {
      if (err) {
        console.error("Error creating appointment:", err);
        return res.status(500).json({ error: "Failed to create appointment" });
      }

      const newAppointment = new Appointment(
        result.insertId,
        user_id,
        vet_id,
        date_time
      );

      dbConnection.query(markHourUnavailableQuery, [freeHourId], (err2) => {
        if (err2) {
          console.warn(
            "Appointment created, but failed to mark free hour as unavailable:",
            err2
          );
          return res.status(200).json({
            message:
              "Appointment created, but failed to update hour availability",
            appointment: newAppointment,
          });
        }

        res.status(201).json({
          message:
            "Appointment created and hour marked unavailable successfully",
          appointment: newAppointment,
        });
      });
    }
  );
}

// Attach handler to the route
router.post("/", createAppointmentHandler);

export default router;
