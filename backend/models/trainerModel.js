const mongoose = require("mongoose");

// A separate schema for comments and ratings provided by each user
const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // To get the user's details
    },
  },
  {
    timestamps: true,
  },
);

const trainerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    specialization: {
      type: String,
      required: [true, "Please add a specialization"],
    },
    age: {
      type: Number,
    },
    bio: {
      type: String,
    },
    experience: {
      type: Number,
    },
    contact: {
      type: String,
    },
    image: {
      type: String,
      default: "",
    },
    // Working hours
    availableFrom: {
      type: String,
      default: "06:00 AM",
    },
    availableTo: {
      type: String,
      default: "08:00 PM",
    },
    // Ratings & Reviews
    reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Trainer", trainerSchema);
