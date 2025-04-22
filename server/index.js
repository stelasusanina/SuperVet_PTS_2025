import express from "express";
import connectDB from "./db.js"; 
import reviewsRoutes from "./routes/reviewRoutes.js";
import vetRoutes from "./routes/vetRoutes.js";
import availableHoursRoutes from "./routes/availableHoursRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js"

const app = express();

let dbConnection;

const initializeDbConnection = async () => {
  try {
    dbConnection = await connectDB(); 
    console.log("Database connection established");

    app.locals.dbConnection = dbConnection;
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
};

initializeDbConnection().then(() => {
  app.use(express.json()); 
  app.use("/reviews", reviewsRoutes); 
  app.use("/vets", vetRoutes); 
  app.use("/availableHours", availableHoursRoutes);
  app.use("/appointments", appointmentRoutes);

  app.listen(5000, () => {
    console.log("Server running on port 5000");
  });
});

export default app;
