const Movie = require("../model/movie.js");

const createMovie = async (req, res) => {
  try {
    const { title, genre, director } = req.body;

    if (!title || !genre || !director) {
      return res.status(400).json({
        success: false,
        message: "Title, genre, and director are required",
      });
    }

    const movie = await Movie.create({ title, genre, director });
    res.status(201).json({ success: true, data: movie });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Movie.findByIdAndDelete(id);

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Movie not found" });
    }

    res.json({ success: true, message: "Movie deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Movie.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true } // return the updated document
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Movie not found" });
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Fetch all movies
const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 }); // newest first
    res.json({ success: true, data: movies });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Fetch a single movie by ID
const getMovieById = async (req, res) => {
  try {
    const { id } = req.params;

    const movie = await Movie.findById(id)
      .populate("budget") // optional, if budget is a separate collection
      .exec();

    if (!movie) {
      return res
        .status(404)
        .json({ success: false, message: "Movie not found" });
    }

    res.json({ success: true, data: movie });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getAllMovies,
  getMovieById,
  deleteMovie,
  updateMovie,
  createMovie,
};
