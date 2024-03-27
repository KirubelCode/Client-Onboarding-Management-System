<?php
// Check if the client ID is provided via POST method
if(isset($_POST['clientId'])) {
    // Retrieve client ID from POST data
    $clientId = $_POST['clientId'];

    // Database connection parameters
    $servername = "localhost";
    $username = "C00260396";
    $password = "SetuCarlow2024";
    $dbname = "ClientsDB";

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Prepare SQL statement to delete client
    $sql = "DELETE FROM clientInfo WHERE ID = ?";

    // Prepare and bind parameters
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $clientId);

    // Execute the statement
    if ($stmt->execute() === TRUE) {
        // Return success message
        echo "Client deleted successfully";
    } else {
        // Return error message
        echo "Error deleting client: " . $conn->error;
    }

    // Close statement and connection
    $stmt->close();
    $conn->close();
} else {
    // Return error message if client ID is not provided
    echo "Client ID not provided";
}
?>
