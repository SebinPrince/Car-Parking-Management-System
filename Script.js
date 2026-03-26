// Check authentication state BEFORE fetching anything
if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'login.html';
}

// Base URL for API requests
const API_URL = 'http://localhost:3000';

// DOM Elements
const vehicleForm = document.getElementById('vehicleForm');
const vehicleListBody = document.getElementById('vehicleListBody');
const emptyMessage = document.getElementById('emptyMessage');
const vehicleTable = document.getElementById('vehicleTable');
const logoutBtn = document.getElementById('logoutBtn');

// Event Listener for form submission
vehicleForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get input values
    const vehicleNumber = document.getElementById('vehicleNumber').value.trim();
    const ownerName = document.getElementById('ownerName').value.trim();
    const department = document.getElementById('department').value.trim();
    const mobileNumber = document.getElementById('mobileNumber').value.trim();

    // Create a new vehicle object
    const newVehicle = {
        vehicleNumber,
        ownerName,
        department,
        mobileNumber
    };

    try {
        // Send POST request to backend
        const response = await fetch(`${API_URL}/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newVehicle)
        });

        if (response.ok) {
            // Clear form inputs
            vehicleForm.reset();
            // Refresh the list
            fetchVehicles();
        } else {
            alert('Failed to add vehicle. Please try again.');
        }
    } catch (error) {
        console.error('Error adding vehicle:', error);
        alert('Cannot connect to the server. Ensure backend is running.');
    }
});

// Function to fetch all vehicles from backend
async function fetchVehicles() {
    try {
        const response = await fetch(`${API_URL}/vehicles`);
        const vehicles = await response.json();
        
        // Clear current list
        vehicleListBody.innerHTML = '';

        if (vehicles.length === 0) {
            // Show empty message if no vehicles
            emptyMessage.style.display = 'block';
            vehicleTable.style.display = 'none';
        } else {
            // Hide empty message and show table
            emptyMessage.style.display = 'none';
            vehicleTable.style.display = 'table';

            // Loop through fetched vehicles and add to DOM
            vehicles.forEach(vehicle => {
                const tr = document.createElement('tr');
                
                tr.innerHTML = `
                    <td>${vehicle.vehicleNumber}</td>
                    <td>${vehicle.ownerName}</td>
                    <td>${vehicle.department}</td>
                    <td>${vehicle.mobileNumber}</td>
                    <td>
                        <button class="btn-delete" onclick="deleteVehicle('${vehicle._id}')">Delete</button>
                    </td>
                `;
                
                vehicleListBody.appendChild(tr);
            });
        }
    } catch (error) {
        console.error('Error fetching vehicles:', error);
    }
}

// Function to delete a vehicle
async function deleteVehicle(id) {
    if (confirm('Are you sure you want to delete this vehicle?')) {
        try {
            // Send DELETE request to backend
            const response = await fetch(`${API_URL}/delete/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                // Refresh the list after successful deletion
                fetchVehicles();
            } else {
                alert('Failed to delete vehicle.');
            }
        } catch (error) {
            console.error('Error deleting vehicle:', error);
        }
    }
}

// Fetch vehicles when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchVehicles();

    // Event Listener for Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // Clear local storage and redirect
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('username');
            window.location.href = 'login.html';
        });
    }
});
