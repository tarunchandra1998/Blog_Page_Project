import express from "express";

import dotenv from "dotenv";
import color from "colors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import cors from "cors";

//.env configuration env

dotenv.config();

// database config

connectDB();

// rest object
const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// routes

app.use("/api/v1/auth", authRoutes);
// app.use("/api/v1/blogs/create", authRoutes);
// app.use("/api/v1/blogs/view", authRoutes);

// rest api
app.get("/", (req, res) => {
  res.send("<h1>Welcome to the Tarun server </h1>");
});

// normal port
// const PORT = 8080;

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(
    `App is running on the mode ${process.env.MODE} and port number ${PORT}`
      .bgCyan.white
  );
});
