import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import careerRoute from "./Routes/careerRoute.js";
import contacRoute from "./Routes/contactRoute.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json()); // Routes
app.use("/api/career", careerRoute);
app.use("/api/Contact", contacRoute);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
