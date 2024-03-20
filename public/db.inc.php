<?php
$servername = "localhost:3000";
$username = "C00260396";
$password = "SetuCarlow2024";
$dbname = "ClientsDB";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

?>
