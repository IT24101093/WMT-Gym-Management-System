const mongoose = require('mongoose');
const User = require('./models/userModel');
require('dotenv').config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const adminEmail = 'admin@gym.com'; // You can change this
        const adminPassword = 'admin123';   // You can change this

        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            existingAdmin.role = 'admin';
            existingAdmin.password = adminPassword; // Reset password to admin123
            await existingAdmin.save();
            console.log('🔄 Existing user promoted to Admin and password reset:', adminEmail);
        } else {
            await User.create({
                name: 'Admin User',
                email: adminEmail,
                password: adminPassword,
                phone: '0000000000',
                age: 30,
                nic: 'ADMIN001',
                height: 180,
                weight: 75,
                role: 'admin'
            });
            console.log('✨ New Admin User created:', adminEmail);
        }

        console.log('🚀 Admin setup complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during admin creation:', error);
        process.exit(1);
    }
};

createAdmin();
