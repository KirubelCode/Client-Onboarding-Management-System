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

    // Prepare SQL statement to search for clients by address containing the keyword
    $sql = "SELECT * FROM clientInfo WHERE address LIKE ?";

    // Prepare and bind parameters
    $stmt = $conn->prepare($sql);
    $searchKeyword = "%" . $keyword . "%"; // Surround keyword with %
    $stmt->bind_param("s", $searchKeyword);

    // Execute the statement
    $stmt->execute();

    // Get the result set
    $result = $stmt->get_result();

    // Check if any results were found
    if ($result->num_rows > 0) {
        // Output data of each row
        while($row = $result->fetch_assoc()) {
            // Output all client information
            echo "ID: " . $row["ID"]. "<br>";
            echo "First Name: " . $row["firstName"]. "<br>";
            echo "Last Name: " . $row["lastName"]. "<br>";
            echo "Email: " . $row["email"]. "<br>";
            echo "Phone: " . $row["phone"]. "<br>";
            echo "Address: " . $row["address"]. "<br>";
            // Output any other fields you need
            echo "<br>"; // Add a line break for better readability
        }
    } else {
        echo "No clients found with the specified keyword in the address.";
    }

    // Close statement and connection
    $stmt->close();
    $conn->close();
} else {
    // Return an error message if the search keyword is not provided
    echo "Search keyword not provided";
}
?>
