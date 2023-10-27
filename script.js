// script.js

// Function to authenticate user and get bearer token
function authenticateUser(login_id, password) {
    fetch("https://qa2.sunbasedata.com/sunbase/portal/api/assignment_auth.jsp", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "login_id": login_id,
            "password": password
        })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error("Authentication failed");
    })
    .then(data => {
        const token = data.token; // Assuming the response has a key named 'token'
        // Store the token securely, maybe in sessionStorage or localStorage for future use
        // Redirect to customer list page upon successful login
        window.location.href = "customer_list.html";
    })
    .catch(error => {
        console.error("Authentication Error:", error);
        // Handle authentication failure, show error message to the user
    });
}

// Function to fetch and display customer list
function fetchCustomerList() {
    fetch("https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=get_customer_list", {
        method: "GET",
        headers: {
            "Authorization": "Bearer YOUR_TOKEN_HERE" // Replace YOUR_TOKEN_HERE with the stored token
        }
    })
    .then(response => response.json())
    .then(data => {
        const customerList = document.getElementById("customerList");
        customerList.innerHTML = ""; // Clear existing list
        data.forEach(customer => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${customer.first_name}</td>
                <td>${customer.last_name}</td>
                <td>${customer.street}</td>
                <td>${customer.address}</td>
                <td>${customer.city}</td>
                <td>${customer.state}</td>
                <td>${customer.email}</td>
                <td>${customer.phone}</td>
            `;
            customerList.appendChild(row);
        });
    })
    .catch(error => {
        console.error("Error fetching customer list:", error);
        // Handle error, show error message to the user
    });
}

// Function to add a new customer
function addCustomer(formData) {
    fetch("https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=create", {
        method: "POST",
        headers: {
            "Authorization": "Bearer YOUR_TOKEN_HERE", // Replace YOUR_TOKEN_HERE with the stored token
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (response.status === 201) {
            console.log("Customer created successfully!");
            // Optionally, redirect to the customer list page or update the UI
        } else if (response.status === 400) {
            console.error("Bad Request: First Name or Last Name is missing");
            // Handle validation error, show error message to the user
        } else {
            console.error("Error creating customer:", response.status);
            // Handle other errors, show error message to the user
        }
    })
    .catch(error => {
        console.error("Error creating customer:", error);
        // Handle error, show error message to the user
    });
}

// Event listener for login form submission
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const login_id = document.getElementById("login_id").value;
    const password = document.getElementById("password").value;
    authenticateUser(login_id, password);
});

// Event listener for add customer form submission
document.getElementById("addCustomerForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const formData = {
        "first_name": document.getElementById("first_name").value,
        "last_name": document.getElementById("last_name").value,
        "street": document.getElementById("street").value,
        "address": document.getElementById("address").value,
        "city": document.getElementById("city").value,
        "state": document.getElementById("state").value,
        "email": document.getElementById("email").value,
        "phone": document.getElementById("phone").value
    };
    addCustomer(formData);
});
