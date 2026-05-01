const mongoose = require('mongoose');
const Diet = require('./models/dietModel');
const Workout = require('./models/workoutModel');
const User = require('./models/userModel');
const dotenv = require('dotenv');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Get an admin user to associate with the created plans
        let admin = await User.findOne({ email: 'admin@gym.com' });
        
        if (!admin) {
            console.log('👷 No admin found. Creating default admin (admin@gym.com / admin123)...');
            admin = await User.create({
                name: 'System Admin',
                email: 'admin@gym.com',
                password: 'admin123',
                phone: '0000000000',
                age: 30,
                nic: 'ADMIN001',
                height: 180,
                weight: 80,
                role: 'admin'
            });
            console.log('✅ Default admin created!');
        } else {
            console.log('✅ Admin found:', admin.email);
            // Force reset password for the existing admin to ensure user can log in
            admin.role = 'admin';
            admin.password = 'admin123';
            await admin.save();
            console.log('🔄 Admin password reset to: admin123');
        }

        // 🥗 DIET PLANS
        const diets = [
            {
                planName: 'Elite Shred',
                description: 'Cutto-phase nutrition focused on high protein and moderate healthy fats.',
                calories: 1800,
                imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
                user: admin._id,
                meals: [
                    { name: 'Breakfast', kcal: 400, items: 'Avo Toast + 4 Egg Whites' },
                    { name: 'Lunch', kcal: 600, items: 'Grilled Chicken (150g) + Quinoa' },
                    { name: 'Dinner', kcal: 500, items: 'Salmnon Steak + Asparagus' },
                    { name: 'Snack', kcal: 300, items: 'Whey Isolate + Handful of Nuts' }
                ]
            },
            {
                planName: 'Muscle Titan',
                description: 'Bulk-phase diet designed for maximum hypertrophic response and energy.',
                calories: 3200,
                imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
                user: admin._id,
                meals: [
                    { name: 'Breakfast', kcal: 800, items: 'Oatmeal with Peanut Butter + 4 Whole Eggs' },
                    { name: 'Lunch', kcal: 900, items: 'Beef Mince (200g) + Brown Rice + Veggies' },
                    { name: 'Dinner', kcal: 1000, items: 'Pasta Bolognese + Parmesan' },
                    { name: 'Post-Workout', kcal: 500, items: 'Banana + Protein Shake + Creatine' }
                ]
            },
            {
                planName: 'Vegan Vitality',
                description: 'Plant-based powerhouse for clean energy and rapid recovery.',
                calories: 2200,
                imageUrl: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=800',
                user: admin._id,
                meals: [
                    { name: 'Breakfast', kcal: 500, items: 'Tofu Scramble with Spinach' },
                    { name: 'Lunch', kcal: 600, items: 'Lentil Soup + Sweet Potato' },
                    { name: 'Dinner', kcal: 700, items: 'Chickpea Curry + Basmati Rice' },
                    { name: 'Snack', kcal: 400, items: 'Hummus with Carrot Sticks' }
                ]
            },
            {
                planName: 'Keto Power',
                description: 'Ultra low-carb, high-fat protocol to trigger ketosis and fat adaptation.',
                calories: 2100,
                imageUrl: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800',
                user: admin._id,
                meals: [
                    { name: 'Breakfast', kcal: 600, items: 'Bacon & Eggs with Sliced Avocado' },
                    { name: 'Lunch', kcal: 700, items: 'Cobb Salad with Blue Cheese and Ranch' },
                    { name: 'Dinner', kcal: 800, items: 'Ribeye Steak with Garlic Butter Broccoli' }
                ]
            },
            {
                planName: 'Mediterranean Glow',
                description: 'Heart-healthy diet rich in omega-3s, olive oil, and fresh produce.',
                calories: 2400,
                imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800',
                user: admin._id,
                meals: [
                    { name: 'Breakfast', kcal: 500, items: 'Greek Yogurt with Honey and Walnuts' },
                    { name: 'Lunch', kcal: 700, items: 'Grilled Octopus or Fish with Greek Salad' },
                    { name: 'Dinner', kcal: 1200, items: 'Whole Grain Pasta with Pesto and Sautéed Shrimp' }
                ]
            },
            {
                planName: 'Warrior Fast',
                description: 'Optimized for 20:4 intermittent fasting with a nutrient-dense feeding window.',
                calories: 2500,
                imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
                user: admin._id,
                meals: [
                    { name: 'Pre-Fast Break', kcal: 200, items: 'Bone Broth and Sea Salt' },
                    { name: 'Main Feast', kcal: 1800, items: 'Double Bison Burger (no bun) + Sweet Potato Fries + Large Salad' },
                    { name: 'Dessert', kcal: 500, items: 'Dark Chocolate and Mixed Berries' }
                ]
            },
            {
                planName: 'High-Protein Pulse',
                description: 'Elite athlete protocol focused on rapid muscle fiber repair and nitrogen balance.',
                calories: 2800,
                imageUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800',
                user: admin._id,
                meals: [
                    { name: 'Breakfast', kcal: 700, items: 'Egg White Omelette + Smoked Salmon' },
                    { name: 'Lunch', kcal: 800, items: 'Roasted Chicken Breast + Quinoa Salad' },
                    { name: 'Dinner', kcal: 900, items: 'Lean Sirloin + Roasted Sweet Potato' },
                    { name: 'Snack', kcal: 400, items: 'Casein Shake + Almonds' }
                ]
            },
            {
                planName: 'Low-Carb Legend',
                description: 'Zero-sugar, moderate-fat approach for constant energy without insulin spikes.',
                calories: 2000,
                imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
                user: admin._id,
                meals: [
                    { name: 'Breakfast', kcal: 500, items: 'Avocado and Poached Eggs' },
                    { name: 'Lunch', kcal: 600, items: 'Grilled Tuna Steak with Green Beans' },
                    { name: 'Dinner', kcal: 700, items: 'Baked Cod with Lemon-Butter Asparagus' },
                    { name: 'Snack', kcal: 200, items: 'Spinach and Kale Smoothie' }
                ]
            },
            {
                planName: 'Plant-Based Power',
                description: 'Clean, alkaline-focused nutrition using plant proteins for maximum recovery.',
                calories: 2300,
                imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
                user: admin._id,
                meals: [
                    { name: 'Breakfast', kcal: 500, items: 'Tofu Scramble with Bell Peppers' },
                    { name: 'Lunch', kcal: 700, items: 'Tempeh Stir-fry with Brown Rice' },
                    { name: 'Dinner', kcal: 800, items: 'Lentil Bolognese with Zucchini Noodles' },
                    { name: 'Snack', kcal: 300, items: 'Pumpkin Seeds + Dried Apricots' }
                ]
            },
            {
                planName: 'Paleo Prime',
                description: 'The "Caveman" diet focusing on whole, unprocessed foods like lean meats and nuts.',
                calories: 2300,
                imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
                user: admin._id,
                meals: [
                    { name: 'Breakfast', kcal: 500, items: 'Scrambled Eggs with Sausage and Bell Peppers' },
                    { name: 'Lunch', kcal: 700, items: 'Steak Salad with Olive Oil Dressing' },
                    { name: 'Dinner', kcal: 800, items: 'Baked Chicken Wings with Celery and Carrots' },
                    { name: 'Snack', kcal: 300, items: 'Mixed Nuts and Beef Jerky' }
                ]
            },
            {
                planName: 'Zen Fish',
                description: 'A light, omega-rich diet based on traditional Japanese coastal nutrition.',
                calories: 1900,
                imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=800',
                user: admin._id,
                meals: [
                    { name: 'Breakfast', kcal: 400, items: 'Miso Soup with Tofu and Green Tea' },
                    { name: 'Lunch', kcal: 600, items: 'Sashimi Platter with Ginger and Wasabi' },
                    { name: 'Dinner', kcal: 700, items: 'Grilled Mackerel with Steamed Vegetables' },
                    { name: 'Snack', kcal: 200, items: 'Edamame with Sea Salt' }
                ]
            },
            {
                planName: 'Berry Clean',
                description: 'High antioxidant protocol focused on complex carbs and berry-sourced fructose.',
                calories: 2000,
                imageUrl: 'https://images.unsplash.com/photo-1477763858572-cda7deaa9bc5?w=800',
                user: admin._id,
                meals: [
                    { name: 'Breakfast', kcal: 500, items: 'Blueberry Porridge and Chia Seeds' },
                    { name: 'Lunch', kcal: 600, items: 'Turkey Wrap with Spinach and Raspberry Vinaigrette' },
                    { name: 'Dinner', kcal: 600, items: 'Salmon with Strawberry and Avocado Salsa' },
                    { name: 'Snack', kcal: 300, items: 'Greek Yogurt with Fresh Mixed Berries' }
                ]
            }
        ];

        // 🏋️ WORKOUT PLANS
        const workouts = [
            {
                title: 'Iron Mastery',
                description: 'Combined heavy compounds and isolation for pure strength and size.',
                duration: 60,
                difficulty: 'Advanced',
                caloriesBurned: 550,
                imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
                user: admin._id
            },
            {
                title: 'High-Octane Cardio',
                description: 'HIIT session designed to melt fat and increase lung capacity.',
                duration: 30,
                difficulty: 'Intermediate',
                caloriesBurned: 450,
                imageUrl: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800',
                user: admin._id
            },
            {
                title: 'Zen Recovery',
                description: 'Full body movement and stretching to keep you mission-ready.',
                duration: 45,
                difficulty: 'Beginner',
                caloriesBurned: 150,
                imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
                user: admin._id
            },
            {
                title: 'Calisthenics King',
                description: 'Master your own bodyweight with progressive gymnastic movements.',
                duration: 50,
                difficulty: 'Intermediate',
                caloriesBurned: 400,
                imageUrl: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800',
                user: admin._id
            },
            {
                title: 'Powerlifter Path',
                description: 'Focused on the Big 3: Squat, Bench, and Deadlift for maximal strength.',
                duration: 90,
                difficulty: 'Expert',
                caloriesBurned: 600,
                imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac00ad?w=800',
                user: admin._id
            },
            {
                title: 'Yoga Flow',
                description: 'Fluid transitions and isometric holds to build functional stability.',
                duration: 60,
                difficulty: 'Beginner',
                caloriesBurned: 200,
                imageUrl: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=800',
                user: admin._id
            },
            {
                title: 'Spartan Circuit',
                description: 'High-rep, high-intensity compound movements to build legendary endurance.',
                duration: 45,
                difficulty: 'Expert',
                caloriesBurned: 500,
                imageUrl: 'https://images.unsplash.com/photo-1599058917232-d750c1859d7c?w=800',
                user: admin._id
            },
            {
                title: 'Boxer Burn',
                description: 'Shadow boxing, footwork, and core conditioning for elite agility.',
                duration: 40,
                difficulty: 'Advanced',
                caloriesBurned: 480,
                imageUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800',
                user: admin._id
            },
            {
                title: 'Foundation 101',
                description: 'Perfecting form on basic movements for absolute beginners.',
                duration: 40,
                difficulty: 'Beginner',
                caloriesBurned: 220,
                imageUrl: 'https://images.unsplash.com/photo-1571019623124-7bc76f10762f?w=800',
                user: admin._id
            }
        ];

        await Diet.deleteMany({});
        await Workout.deleteMany({});
        await Diet.insertMany(diets);
        await Workout.insertMany(workouts);

        console.log('Successfully seeded Diets and Workouts!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
