const Workout = require("../models/workoutModel");
const mongoose = require("mongoose");

// Get all workouts
const getWorkouts = async (req, res) => {
  const user_id = req.user._id;

  const workouts = await Workout.find({user_id}).sort({ createdAt: -1 }); // descending order
  res.status(200).json(workouts);
};

// Get a single workout
const getWorkout = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  const workout = await Workout.findById(id);
  if (!workout) {
    return res.status(404).json({ error: "Workout not found" });
  }
  res.status(200).json(workout);
};

// Create a new workout
const createWorkout = async (req, res) => {
  const { title, reps, load } = req.body;

  let emptyFields = [];

  if (!title) {
    emptyFields.push("title");
  }
  if (!reps) {
    emptyFields.push("reps");
  }
  if (!load) {
    emptyFields.push("load");
  }

  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all the fields", emptyFields });
  }

  try {
    const user_id = req.user._id;
    const workout = await Workout.create({ title, reps, load, user_id });
    res.status(200).json(workout);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a workout
const deleteWorkout = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  const workout = await Workout.findOneAndDelete({ _id: id });
  if (!workout) {
    return res.status(400).json({ error: "Workout not found" });
  }
  res.status(200).json(workout);
};

// Update a workout
// Update a workout
const updateWorkout = async (req, res) => {
  const { id } = req.params;

  // Check if the ID is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  // Check if the fields are provided in the request body
  const { title, reps, load } = req.body;

  // Validate that at least one field is provided
  if (!title && !reps && !load) {
    return res.status(400).json({ error: "At least one field (title, reps, load) is required for update" });
  }

  try {
    // Perform the update
    const workout = await Workout.findOneAndUpdate(
      { _id: id },
      { title, reps, load }, // Only updating the fields provided
      { new: true } // Ensure the updated workout is returned
    );

    if (!workout) {
      return res.status(404).json({ error: "Workout not found" });
    }

    // Return the updated workout
    res.status(200).json(workout);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  getWorkouts,
  getWorkout,
  createWorkout,
  deleteWorkout,
  updateWorkout,
};