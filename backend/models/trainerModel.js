const mongoose = require("mongoose");

// එක් එක් පරිශීලකයා ලබා දෙන අදහස් සහ රේටින්ග්ස් සඳහා වෙනම Schema එකක්
const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // පරිශීලකයාගේ විස්තර ලබා ගැනීමට
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
    // වැඩ කරන වෙලාවන් (කලින් පියවරේදී එක් කළ ඒවා)
    availableFrom: {
      type: String,
      default: "06:00 AM",
    },
    availableTo: {
      type: String,
      default: "08:00 PM",
    },
    // අලුතින් එක් කළ කොටස: Ratings & Reviews
    reviews: [reviewSchema], // ලබා දී ඇති සියලුම අදහස් එකතුව
    rating: {
      type: Number,
      required: true,
      default: 0, // සාමාන්‍ය රේටින් එක
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0, // මුළු අදහස් සංඛ්‍යාව
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Trainer", trainerSchema);
