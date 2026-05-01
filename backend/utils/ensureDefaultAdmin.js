const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

const DEFAULT_ADMIN = {
    name: process.env.DEFAULT_ADMIN_NAME || 'Admin User',
    email: (process.env.DEFAULT_ADMIN_EMAIL || 'admin@gym.com').trim().toLowerCase(),
    password: process.env.DEFAULT_ADMIN_PASSWORD || 'admin123',
    phone: process.env.DEFAULT_ADMIN_PHONE || '0000000000',
    age: Number(process.env.DEFAULT_ADMIN_AGE || 30),
    nic: process.env.DEFAULT_ADMIN_NIC || 'ADMIN001',
    height: Number(process.env.DEFAULT_ADMIN_HEIGHT || 180),
    weight: Number(process.env.DEFAULT_ADMIN_WEIGHT || 75),
};

const ensureDefaultAdmin = async () => {
    const existingUser = await User.findOne({ email: DEFAULT_ADMIN.email });

    if (!existingUser) {
        await User.create({
            ...DEFAULT_ADMIN,
            role: 'admin',
        });

        console.log(`👤 Default admin created: ${DEFAULT_ADMIN.email}`);
        return;
    }

    let shouldSave = false;

    if (existingUser.role !== 'admin') {
        existingUser.role = 'admin';
        shouldSave = true;
    }

    const passwordMatches = await bcrypt.compare(DEFAULT_ADMIN.password, existingUser.password);
    if (!passwordMatches) {
        const salt = await bcrypt.genSalt(10);
        existingUser.password = await bcrypt.hash(DEFAULT_ADMIN.password, salt);
        shouldSave = true;
    }

    if (!existingUser.name) {
        existingUser.name = DEFAULT_ADMIN.name;
        shouldSave = true;
    }

    if (!existingUser.phone) {
        existingUser.phone = DEFAULT_ADMIN.phone;
        shouldSave = true;
    }

    if (!existingUser.age) {
        existingUser.age = DEFAULT_ADMIN.age;
        shouldSave = true;
    }

    if (!existingUser.nic) {
        existingUser.nic = DEFAULT_ADMIN.nic;
        shouldSave = true;
    }

    if (!existingUser.height) {
        existingUser.height = DEFAULT_ADMIN.height;
        shouldSave = true;
    }

    if (!existingUser.weight) {
        existingUser.weight = DEFAULT_ADMIN.weight;
        shouldSave = true;
    }

    if (shouldSave) {
        await existingUser.save();
        console.log(`🔄 Default admin repaired: ${DEFAULT_ADMIN.email}`);
    } else {
        console.log(`✅ Default admin ready: ${DEFAULT_ADMIN.email}`);
    }
};

module.exports = ensureDefaultAdmin;
