<?php
// Database connection parameters
$servername = "localhost";
$username = "masterUser";
$password = "SetuCarlow2024";
$dbname = "MasterDB";

// Retrieve form data from POST request
$userUsername = $_POST['username'];
$userPassword = $_POST['password'];

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Prepare SQL statement to check if username and password match
$sql = "SELECT * FROM ClientData WHERE ClientUsername = ? AND ClientPassword = ?";
$stmt = $conn->prepare($sql);

// Bind parameters
$stmt->bind_param("ss", $userUsername, $userPassword);

// Execute the statement
$stmt->execute();

// Get the result
$result = $stmt->get_result();

// Check if a matching record is found
if ($result->num_rows > 0) {
    // Username and password match, login successful
    echo "Login successful!";
    // Redirect to user dashboard or another page
    // Example: header("Location: dashboard.php");
} else {
    // Username and/or password do not match
    echo "Invalid username or password!";
}

// Close statement and connection
$stmt->close();
$conn->close();
?>
