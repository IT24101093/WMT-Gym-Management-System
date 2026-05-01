const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Generate JWT Helper Function
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// @desc    Register a new user
const registerUser = async (req, res) => {
  try {
    const { name, phone, age, nic, height, weight } = req.body;
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    if (
      !name ||
      !email ||
      !password ||
      !phone ||
      !age ||
      !nic ||
      !height ||
      !weight
    ) {
      return res.status(400).json({ message: "Please add all fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log(`⚠️  Email already exists: ${email}`);
      return res
        .status(400)
        .json({ message: `Email already exists: ${email}` });
    }

    const nicExists = await User.findOne({ nic });
    if (nicExists) {
      console.log(`⚠️  NIC already exists: ${nic}`);
      return res
        .status(400)
        .json({ message: `NIC already exists: ${nic}` });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      age,
      nic,
      height,
      weight,
    });

    console.log("✅ User created successfully:", user._id);

    if (user) {
      const heightInMeters = user.height / 100;
      const bmi = (user.weight / (heightInMeters * heightInMeters)).toFixed(2);

      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        bmi: bmi,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("❌ Registration Error:", error.message);
    
    // Handle specific MongoDB validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors)
        .map((err) => err.message)
        .join(", ");
      return res.status(400).json({ message: `Validation Error: ${messages}` });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ message: `${field} already exists` });
    }
    
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate a user
const loginUser = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password?.trim();

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide an email and password" });
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        age: user.age,
        nic: user.nic,
        height: user.height,
        weight: user.weight,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("❌ Login Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile (Updated with Trainer Population)
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("currentDietPlan")
      .populate("currentWorkoutPlan")
      .populate("selectedTrainer"); // 👈 අලුතින් එක් කළ Populate logic එක

    if (user) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        age: user.age,
        nic: user.nic,
        height: user.height,
        weight: user.weight,
        role: user.role,
        currentDietPlan: user.currentDietPlan,
        currentWorkoutPlan: user.currentWorkoutPlan,
        selectedTrainer: user.selectedTrainer, // 👈 දැන් මෙහි සම්පූර්ණ විස්තර ඇත
        gymGoals: user.gymGoals,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      if (
        user._id.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
      ) {
        return res
          .status(401)
          .json({ message: "Not authorized to update this profile" });
      }
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      user.age = req.body.age || user.age;
      user.height = req.body.height || user.height;
      user.weight = req.body.weight || user.weight;

      if (req.body.password) {
        if (!req.body.oldPassword) {
          return res
            .status(400)
            .json({
              message: "Please provide your current password to set a new one.",
            });
        }
        const bcrypt = require("bcryptjs");
        const isMatch = await bcrypt.compare(
          req.body.oldPassword,
          user.password,
        );
        if (!isMatch) {
          return res
            .status(401)
            .json({
              message: "Incorrect current password. Profile not updated.",
            });
        }
        user.password = req.body.password;
      }
      const updatedUser = await user.save();
      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        message: "Profile updated successfully",
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password } = req.body || {};
    if (user) {
      const isOwner = user._id.toString() === req.user._id.toString();
      const isAdmin = req.user.role === "admin";
      if (!isOwner && !isAdmin) {
        return res
          .status(401)
          .json({ message: "Not authorized to delete this profile" });
      }
      if (isOwner && !isAdmin) {
        if (!password) {
          return res
            .status(400)
            .json({
              message: "Please provide your password to confirm deletion",
            });
        }
        const bcrypt = require("bcryptjs");
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res
            .status(401)
            .json({ message: "Invalid password. Account deletion failed." });
        }
      }
      await user.deleteOne();
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user selections
const updateSelections = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      if (req.body.currentDietPlan !== undefined)
        user.currentDietPlan = req.body.currentDietPlan || null;
      if (req.body.currentWorkoutPlan !== undefined)
        user.currentWorkoutPlan = req.body.currentWorkoutPlan || null;
      if (req.body.selectedTrainer !== undefined)
        user.selectedTrainer = req.body.selectedTrainer || null;
      if (req.body.gymGoals) {
        user.gymGoals = { ...user.gymGoals, ...req.body.gymGoals };
      }
      const updatedUser = await user.save();
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUser,
  deleteUser,
  getAllUsers,
  updateSelections,
};
