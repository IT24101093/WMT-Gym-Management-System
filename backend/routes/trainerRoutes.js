const express = require("express");
const router = express.Router();
const {
  getTrainers,
  getTopTrainer,
  createTrainer,
  updateTrainer,
  deleteTrainer,
  createTrainerReview,
  markAttendance, // 👈 අලුතින් එක් කළා
} = require("../controllers/trainerController");
const { protect, admin } = require("../middleware/authMiddleware");

// /api/trainers
router.route("/").get(getTrainers).post(protect, admin, createTrainer);

// /api/trainers/top
router.get("/top", getTopTrainer);

// 📅 /api/trainers/attendance
// QR එක scan කළ පසු පැමිණීම සටහන් කිරීමට
router.post("/attendance", protect, markAttendance);

// /api/trainers/:id/reviews
router.route("/:id/reviews").post(protect, createTrainerReview);

// /api/trainers/:id
router
  .route("/:id")
  .put(protect, admin, updateTrainer)
  .delete(protect, admin, deleteTrainer);

module.exports = router;
