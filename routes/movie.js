const express = require("express");
const {
  createMovie,
  deleteMovie,
  updateMovie,
  getAllMovies,
  getMovieById,
  addUserToMovie,
  getMoviePersonnel,
} = require("../controller/movie.js");

const router = express.Router();

// Create a movie
router.post("/create", createMovie);

// Update a movie
router.patch("/update/:id", updateMovie);

// Delete a movie
router.delete("/delete/:id", deleteMovie);

// Fetch all movies
router.get("/", getAllMovies);

// Fetch a single movie by ID

router.get("/personnel/:id", getMoviePersonnel);

router.post("/personnel/:id", addUserToMovie);
router.get("/:id", getMovieById);

module.exports = router;
