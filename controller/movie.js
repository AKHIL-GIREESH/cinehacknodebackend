const Movie = require("../model/movie.js");
const User = require("../model/user.js");

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
    // Movie.find() requires the 'Movie' object to be a properly loaded Mongoose Model.
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

    // Use .exec() for better chaining and error handling
    const movie = await Movie.findById(id).exec();

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

const addUserToMovie = async (req, res) => {
  try {
    const { id: movieId } = req.params;
    const { email } = req.body; // Expecting user email in the request body

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "User email is required." });
    }

    // 1. Find the User by email
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found with this email." });
    }

    const userId = user._id;

    // 2. Add the user ID to the movie's 'people' array using $addToSet
    const movie = await Movie.findByIdAndUpdate(
      movieId,
      { $addToSet: { people: userId } },
      { new: true } // Return the updated document
    );

    if (!movie) {
      return res
        .status(404)
        .json({ success: false, message: "Movie not found." });
    }

    // 3. (Optional but recommended) Add the movie ID to the user's 'projects' array
    await User.findByIdAndUpdate(userId, { $addToSet: { projects: movieId } });

    res.json({
      success: true,
      message: "User added to movie successfully",
      data: {
        people: movie.people,
        userAdded: { id: userId, email: user.email, username: user.username },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Fetches the details of all users/personnel associated with a movie ID.
 * The logic to fetch user details has been moved directly into this controller
 * to eliminate the dependency on the external 'people_service'.
 */
const getMoviePersonnel = async (req, res) => {
  try {
    const { id: movieId } = req.params;

    // 1. Find the movie by ID and select only the 'people' field
    const movie = await Movie.findById(movieId).select("people").exec();

    if (!movie) {
      return res
        .status(404)
        .json({ success: false, message: "Movie not found." });
    }

    const peopleIds = movie.people;

    // 2. Find all users whose IDs are in the peopleIds array
    // We exclude the password field for security.
    const peopleDetails = await User.find({
      _id: { $in: peopleIds },
    })
      .select("-password")
      .exec();

    // 3. Return the array of user details
    res.json({ success: true, data: peopleDetails });
  } catch (err) {
    // Return a generic 500 server error for database issues
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getAllMovies,
  getMovieById,
  deleteMovie,
  updateMovie,
  createMovie,
  addUserToMovie,
  getMoviePersonnel,
};
