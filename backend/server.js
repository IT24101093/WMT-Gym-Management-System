const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// NEW: Import cloudinary from your config file
const { cloudinary } = require("./config/cloudinaryConfig");
const ensureDefaultAdmin = require("./utils/ensureDefaultAdmin");

const app = express();

// Middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

/**
 * 🛠 වැදගත් වෙනස්කම:
 * පින්තූර (Base64) යැවීමට හැකි වන පරිදි body limit එක 50mb දක්වා වැඩි කළා.
 * මෙය app.use(express.json()) වලට පෙර තිබිය යුතුයි.
 */
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// 📝 Request Logger (to help debug connection issues)
app.use((req, res, next) => {
  console.log(
    `📡 [${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`,
  );
  next();
});

// MongoDB Database Connection
const mongoURI = process.env.MONGO_URI;

if (!mongoURI || !process.env.JWT_SECRET) {
  console.error(
    "❌ Error: MONGO_URI or JWT_SECRET is not defined in the .env file",
  );
  process.exit(1);
}

// Disable buffering to prevent 10s hangs when DB is disconnected
mongoose.set("bufferCommands", false);

console.log("📡 Attempting to connect to MongoDB...");
mongoose
  .connect(mongoURI, {
    serverSelectionTimeoutMS: 15000,
    socketTimeoutMS: 45000,
  })
  .then(async () => {
    console.log(
      "✅ MongoDB successfully connected to:",
      mongoose.connection.host,
    );
    await ensureDefaultAdmin();

    // Cloudinary Connection Test
    cloudinary.api
      .ping()
      .then(() => {
        console.log("☁️  Cloudinary successfully connected!");
      })
      .catch((error) => {
        console.log("❌ Cloudinary connection error:", error.message);
      });

    // Start Server ONLY after DB is connected
    const PORT = process.env.PORT || 5001; // ඔබේ Screenshot එකේ තිබුණේ 5001
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("❌ CRITICAL: MongoDB connection failed!");
    console.log("   - Code:", error.code);
    console.log("   - Message:", error.message);
    process.exit(1);
  });

// Test Route
app.get("/", (req, res) => {
  res.send("Gym Management API is running...");
});

// 🚀 YOUR ROUTES
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/memberships", require("./routes/membershipRoutes"));
app.use("/api/enrollments", require("./routes/enrollmentRoutes"));
app.use("/api/diets", require("./routes/dietRoutes"));
app.use("/api/trainers", require("./routes/trainerRoutes"));
app.use("/api/progress", require("./routes/progressRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/workouts", require("./routes/workoutRoutes"));
