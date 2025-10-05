const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

console.log("Mongo URI:", MONGO_URI);

// CORS Configuration - Fixed for credentials mode
const corsOptions = {
  origin: "http://localhost:5173", // Your Vite frontend URL
  credentials: true, // Allow credentials (cookies, authorization headers)
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Apply CORS middleware BEFORE other middleware
app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json());

// Routes
const movieRoutes = require("./routes/movie.js");
app.use("/api/movies", movieRoutes);
app.use("/api/auth", require("./routes/authRoute"));

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to DB:", error);
    process.exit(1);
  }
}

startServer();
