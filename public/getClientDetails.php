<?php
// Check if the ID parameter is set in the URL
if (isset($_GET['id'])) {
    $clientId = $_GET['id'];

    // Your database connection code
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

    // Prepare and execute SQL statement to retrieve client details
    $stmt = $conn->prepare("SELECT * FROM clientInfo WHERE ID = ?");
    $stmt->bind_param("i", $clientId);
    $stmt->execute();
    $result = $stmt->get_result();

    // Check if the client exists
    if ($result->num_rows > 0) {
        // Fetch client details as an associative array
        $clientData = $result->fetch_assoc();

        // Return client details as JSON response
        header('Content-Type: application/json');
        echo json_encode($clientData);
    } else {
        // If client does not exist, return an error message
        echo json_encode(array('error' => 'Client not found'));
    }

    // Close database connection
    $stmt->close();
    $conn->close();
} else {
    // If ID parameter is not set, return an error message
    echo json_encode(array('error' => 'Client ID not provided'));
}
?>
