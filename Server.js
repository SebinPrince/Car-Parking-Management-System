const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Initialize Express App
const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodie
app.use(express.static(__dirname));

// Connect to MongoDB
// Ensure MongoDB is installed locally and running, or replace with MongoDB Atlas URI
mongoose.connect('mongodb://127.0.0.1:27017/vehicleDB')
    .then(() => console.log('Successfully connected to MongoDB.'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Define User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Create User Model
const User = mongoose.model('User', userSchema);

// Define Vehicle Schema
const vehicleSchema = new mongoose.Schema({
    vehicleNumber: { type: String, required: true },
    ownerName: { type: String, required: true },
    department: { type: String, required: true },
    mobileNumber: { type: String, required: true }
});

// Create Vehicle Model
const Vehicle = mongoose.model('Vehicle', vehicleSchema);

// --- REST API ENDPOINTS ---

// Simple Login Endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Hardcoded credentials fallback
        if (username === 'admin' && password === 'admin') {
            return res.status(200).json({ message: 'Login successful' });
        }

        // Database credentials check
        const user = await User.findOne({ username, password });
        if (user) {
            return res.status(200).json({ message: 'Login successful' });
        } else {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error during login' });
    }
});

// Signup Endpoint
app.post('/api/signup', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const newUser = new User({ username, password });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error during signup' });
    }
});

// 1. POST /add → Add vehicle
app.post('/add', async (req, res) => {
    try {
        const { vehicleNumber, ownerName, department, mobileNumber } = req.body;

        // Create a new instance of the Vehicle model
        const newVehicle = new Vehicle({
            vehicleNumber,
            ownerName,
            department,
            mobileNumber
        });

        // Save to database
        await newVehicle.save();
        res.status(201).json({ message: 'Vehicle added successfully', vehicle: newVehicle });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add vehicle' });
    }
});

// 2. GET /vehicles → Get all vehicles
app.get('/vehicles', async (req, res) => {
    try {
        // Fetch all vehicles from database
        const vehicles = await Vehicle.find();
        res.status(200).json(vehicles);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch vehicles' });
    }
});

// 3. DELETE /delete/:id → Delete vehicle
app.delete('/delete/:id', async (req, res) => {
    try {
        const vehicleId = req.params.id;

        // Find and delete the vehicle by its MongoDB _id
        await Vehicle.findByIdAndDelete(vehicleId);
        res.status(200).json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete vehicle' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
