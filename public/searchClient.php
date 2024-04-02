<?php
// Check if the search keyword is provided via POST method
if(isset($_POST['keyword'])) {
    // Retrieve the search keyword from POST data
    $keyword = $_POST['keyword'];

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

    // Prepare SQL statement to search for clients by address
    $sql = "SELECT * FROM clientInfo WHERE address LIKE ?";

    // Prepare and bind parameters
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $searchKeyword);
    
    // Set the search keyword with wildcards
    $searchKeyword = '%' . $keyword . '%';

    // Execute the statement
    $stmt->execute();

    // Get the result
    $result = $stmt->get_result();

    // Initialize an array to store search results
    $searchResults = array();

    // Fetch rows and store them in the array
    while ($row = $result->fetch_assoc()) {
        $searchResults[] = $row;
    }

    // Return the search results as JSON
    echo json_encode($searchResults);

    // Close statement and connection
    $stmt->close();
    $conn->close();
} else {
    // Return error message if the search keyword is not provided
    echo "Search keyword not provided";
}
?>
