const API = "http://localhost:3000";

// Load vehicles
async function loadVehicles() {
    const res = await fetch(API + "/vehicles");
    const data = await res.json();

    displayVehicles(data);
}

// Display vehicles in table
function displayVehicles(data) {
    const tbody = document.getElementById("vehicleListBody");
    const emptyMsg = document.getElementById("emptyMessage");

    tbody.innerHTML = "";

    if (data.length === 0) {
        emptyMsg.style.display = "block";
        return;
    } else {
        emptyMsg.style.display = "none";
    }

    data.forEach(v => {
        const row = `
            <tr>
                <td>${v.vehicleNumber}</td>
                <td>${v.ownerName}</td>
                <td>${v.department}</td>
                <td>${v.mobileNumber}</td>
                <td>
                    <button onclick="deleteVehicle('${v._id}')">Delete</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Add vehicle
document.getElementById("vehicleForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const vehicle = {
        vehicleNumber: document.getElementById("vehicleNumber").value,
        ownerName: document.getElementById("ownerName").value,
        department: document.getElementById("department").value,
        mobileNumber: document.getElementById("mobileNumber").value
    };

    await fetch(API + "/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vehicle)
    });

    this.reset();
    loadVehicles();
});

// Delete vehicle
async function deleteVehicle(id) {
    await fetch(API + "/delete/" + id, {
        method: "DELETE"
    });
    loadVehicles();
}

// 🔍 SEARCH FUNCTION (NEW)
async function searchVehicle() {
    const searchValue = document.getElementById("searchInput").value.toLowerCase();

    const res = await fetch(API + "/vehicles");
    const data = await res.json();

    const filtered = data.filter(v =>
        v.vehicleNumber.toLowerCase().includes(searchValue)
    );

    displayVehicles(filtered);
}

// Initial load
loadVehicles();
