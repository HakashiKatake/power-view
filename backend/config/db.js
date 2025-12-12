const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/powerview', {
            serverSelectionTimeoutMS: 5000 // Fail fast if no connection
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        console.error('Build broken? Make sure MONGO_URI is set in Render Environment Variables!');
        // Allow app to crash so Render knows it failed, but with better logs
        process.exit(1);
    }
};

module.exports = connectDB;
