const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Initialize Express App
const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' folder

// Connect to MongoDB
// Ensure MongoDB is installed locally and running, or replace with MongoDB Atlas URI
mongoose.connect('mongodb://127.0.0.1:27017/vehicleDB')
    .then(() => console.log('Successfully connected to MongoDB.'))
    .catch((err) => console.error('MongoDB connection error:', err));

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

// 1. POST /add → Add vehicle
app.post('/add', async (req, res) => {//api call(new data insertion)
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
