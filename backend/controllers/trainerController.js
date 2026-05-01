const Trainer = require("../models/trainerModel");
const User = require("../models/userModel"); // 👈 Attendance සඳහා User model එක අවශ්‍යයි
const cloudinary = require("cloudinary").v2;

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// @desc    Get all trainers
const getTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find({});
    res.status(200).json(trainers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get top rated trainer
const getTopTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.find({}).sort({ rating: -1 }).limit(1);
    if (trainer && trainer.length > 0) {
      res.json(trainer[0]);
    } else {
      res.status(404).json({ message: "No trainers found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new trainer
const createTrainer = async (req, res) => {
  const {
    name,
    specialization,
    bio,
    experience,
    contact,
    age,
    image,
    availableFrom,
    availableTo,
  } = req.body;
  if (!name || !specialization) {
    return res
      .status(400)
      .json({ message: "Name and specialization are required" });
  }
  try {
    let imageUrl = "";
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: "trainers",
      });
      imageUrl = uploadResponse.secure_url;
    }
    const trainer = await Trainer.create({
      name: name.trim(),
      specialization: specialization.trim(),
      age: age ? Number(age) : undefined,
      bio: bio?.trim(),
      experience: experience ? Number(experience) : undefined,
      contact: contact?.trim(),
      image: imageUrl,
      availableFrom: availableFrom || "06:00 AM",
      availableTo: availableTo || "08:00 PM",
    });
    res.status(201).json(trainer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a trainer
const updateTrainer = async (req, res) => {
  const { image, availableFrom, availableTo } = req.body;
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (trainer) {
      if (image && image.startsWith("data:image")) {
        const uploadResponse = await cloudinary.uploader.upload(image, {
          folder: "trainers",
        });
        trainer.image = uploadResponse.secure_url;
      }
      trainer.name = req.body.name || trainer.name;
      trainer.specialization =
        req.body.specialization || trainer.specialization;
      trainer.age = req.body.age || trainer.age;
      trainer.bio = req.body.bio || trainer.bio;
      trainer.experience = req.body.experience || trainer.experience;
      trainer.contact = req.body.contact || trainer.contact;
      trainer.availableFrom = availableFrom || trainer.availableFrom;
      trainer.availableTo = availableTo || trainer.availableTo;
      const updatedTrainer = await trainer.save();
      res.json(updatedTrainer);
    } else {
      res.status(404).json({ message: "Trainer not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a trainer
const deleteTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (trainer) {
      await Trainer.findByIdAndDelete(req.params.id);
      res.json({ message: "Trainer removed successfully" });
    } else {
      res.status(404).json({ message: "Trainer not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create/Update review
const createTrainerReview = async (req, res) => {
  const { rating, comment } = req.body;
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (trainer) {
      const alreadyReviewed = trainer.reviews.find(
        (r) => r.user.toString() === req.user._id.toString(),
      );
      if (alreadyReviewed) {
        alreadyReviewed.rating = Number(rating);
        alreadyReviewed.comment = comment;
      } else {
        const review = {
          name: req.user.name,
          rating: Number(rating),
          comment,
          user: req.user._id,
        };
        trainer.reviews.push(review);
      }
      trainer.numReviews = trainer.reviews.length;
      trainer.rating =
        trainer.reviews.reduce((acc, item) => item.rating + acc, 0) /
        trainer.reviews.length;
      await trainer.save();
      res
        .status(201)
        .json({ message: alreadyReviewed ? "Review updated" : "Review added" });
    } else {
      res.status(404).json({ message: "Trainer not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📅 @desc    Mark user attendance via QR Scan
// @route   POST /api/trainers/attendance
// @access  Private
const markAttendance = async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Checking if attendance has already been recorded for today
    const today = new Date().setHours(0, 0, 0, 0);
    const alreadyPresent = user.attendance.find(
      (record) => new Date(record.date).setHours(0, 0, 0, 0) === today,
    );

    if (alreadyPresent) {
      return res
        .status(400)
        .json({ message: "Attendance already marked for today" });
    }

    // attendance
    user.attendance.push({
      trainer: req.user._id,
      date: new Date(),
      status: "Present",
    });

    await user.save();
    res.status(200).json({ message: `Attendance marked for ${user.name}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTrainers,
  getTopTrainer,
  createTrainer,
  updateTrainer,
  deleteTrainer,
  createTrainerReview,
  markAttendance,
};
