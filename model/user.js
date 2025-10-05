const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
  role: {
    type: String,
    enum: ["Director", "Producer", "Writer", "Actor", "Crew"],
  },
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  projects: [projectSchema],
});

module.exports = mongoose.model("User", userSchema);
