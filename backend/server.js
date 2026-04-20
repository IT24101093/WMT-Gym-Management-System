const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); 
require('dotenv').config();

// NEW: Import cloudinary from your config file
const { cloudinary } = require('./config/cloudinaryConfig');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Allows app to accept JSON data in the body

// MongoDB Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB successfully connected!');
  })
  .catch((error) => {
    console.log('❌ MongoDB connection error:', error.message);
  });

// NEW: Cloudinary Connection Test
cloudinary.api.ping()
  .then(() => {
    console.log('☁️  Cloudinary successfully connected!');
  })
  .catch((error) => {
    console.log('❌ Cloudinary connection error:', error.message);
  });

// Test Route
app.get('/', (req, res) => {
  res.send('Gym Management API is running...');
});

// 🚀 YOUR ROUTES MUST GO HERE (Before app.listen)
app.use('/api/users', require('./routes/userRoutes'));

// ADD THIS NEW LINE FOR MEMBERSHIPS:
app.use('/api/memberships', require('./routes/membershipRoutes'));

app.use('/api/enrollments', require('./routes/enrollmentRoutes'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});


