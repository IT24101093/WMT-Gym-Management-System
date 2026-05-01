const mongoose = require('mongoose');
const Diet = require('./models/dietModel');
require('dotenv').config();

const updateDiets = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Update Keto Power
        await Diet.updateOne(
            { planName: 'Keto Power' },
            { $set: { imageUrl: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800' } }
        );
        console.log('🖼️ Updated Keto Power image');

        // Update Low-Carb Legend
        await Diet.updateOne(
            { planName: 'Low-Carb Legend' },
            { $set: { imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800' } }
        );
        console.log('🖼️ Updated Low-Carb Legend image');

        console.log('🚀 DB Update Complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating diets:', error);
        process.exit(1);
    }
};

updateDiets();
