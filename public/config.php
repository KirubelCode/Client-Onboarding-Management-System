<?php
// Function to retrieve database configuration based on user session
function getUserDatabaseConfig() {
    // Start or resume session
    session_start();

    // Check if user data is stored in session
    if (isset($_SESSION['userData'])) {
        $userData = $_SESSION['userData'];

        // Extract database connection parameters from user data
        $dbServer = 'localhost'; // Assuming the database server is local
        $dbUsername = $userData['ClientUsername']; // Username stored in session
        $dbPassword = $userData['ClientPassword']; // Password stored in session
        $dbName = $userData['DatabaseName']; // Database name stored in session

        return array(
            'server' => $dbServer,
            'username' => $dbUsername,
            'password' => $dbPassword,
            'database' => $dbName
        );
    }

    return null; // Return null if user data is not found in session
}
?>
