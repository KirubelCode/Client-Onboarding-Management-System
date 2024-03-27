<?php
// Check if request method is POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve data from request body
    $requestData = json_decode(file_get_contents("php://input"), true);

    // Check if all required fields are present
    if (isset($requestData['clientId']) && isset($requestData['firstName']) && isset($requestData['lastName']) && isset($requestData['email']) && isset($requestData['phone']) && isset($requestData['address'])) {
        // Assign data to variables
        $clientId = $requestData['clientId'];
        $firstName = $requestData['firstName'];
        $lastName = $requestData['lastName'];
        $email = $requestData['email'];
        $phone = $requestData['phone'];
        $address = $requestData['address'];

        // Perform database operations to update client data
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

        // Prepare SQL statement to update client data
        $sql = "UPDATE clientInfo SET firstName='$firstName', lastName='$lastName', email='$email', phone='$phone', address='$address' WHERE ID='$clientId'";

        // Execute SQL statement
        if ($conn->query($sql) === TRUE) {
            echo "Client data updated successfully";
        } else {
            echo "Error updating client data: " . $conn->error;
        }

        // Close connection
        $conn->close();
    } else {
        echo "Required fields are missing";
    }
} else {
    echo "Invalid request method";
}
?>
