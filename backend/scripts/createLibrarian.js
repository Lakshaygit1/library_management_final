const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();
const connectDB = require('../config/db');

const createLibrarian = async () => {
    try {
        // Connect to DB
        await connectDB();

        // Check if librarian already exists
        const librarianExists = await User.findOne({ role: 'librarian' });
        if (librarianExists) {
            console.log('Librarian already exists');
            return;
        }

        // Get librarian data from environment variables
        const { DEFAULT_LIBRARIAN_USERNAME, DEFAULT_LIBRARIAN_PASSWORD, DEFAULT_LIBRARIAN_EMAIL } = process.env;

        // Create new librarian
        const librarian = new User({
            username: DEFAULT_LIBRARIAN_USERNAME,
            password: DEFAULT_LIBRARIAN_PASSWORD,
            email: DEFAULT_LIBRARIAN_EMAIL,
            role: 'librarian'
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        librarian.password = await bcrypt.hash(librarian.password, salt);

        // Save librarian to DB
        await librarian.save();
        console.log('Librarian created successfully');

    } catch (err) {
        console.error('Error during librarian creation:', err.message);
    } finally {
        // Close connection
        mongoose.connection.close();
    }
};

createLibrarian();
