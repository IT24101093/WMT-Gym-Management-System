const mongoose = require('mongoose');
const User = require('./models/userModel');
require('dotenv').config();

const debugAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const adminEmail = 'admin@gym.com';
        const user = await User.findOne({ email: adminEmail });

        if (user) {
            console.log('👤 User Found:', adminEmail);
            console.log('🛡️  Role:', user.role);
            console.log('🔑 Password Hashed:', user.password.startsWith('$2')); // bcrypt hashes start with $2
            
            // Try matching password manually
            const isMatch = await user.matchPassword('admin123');
            console.log('✅ Password "admin123" Matches:', isMatch);

        } else {
            console.log('❌ User NOT FOUND:', adminEmail);
            console.log('💡 TIP: Run "node create_admin.js" first in the backend folder.');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error during debug:', error);
        process.exit(1);
    }
};

debugAdmin();
