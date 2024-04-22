<?php
// Database connection parameters for administrative tasks
$adminUsername = "masterUser";
$adminPassword = "SetuCarlow2024";
$adminDbname = "MasterDB";
$adminHost = "localhost";

// Create connection to perform administrative tasks
$adminConn = new mysqli($adminHost, $adminUsername, $adminPassword, $adminDbname);

// Check connection for administrative tasks
if ($adminConn->connect_error) {
    die("Connection failed for administrative tasks: " . $adminConn->connect_error);
}

// Retrieve form data from POST request
$newUsername = $_POST['username'];
$newDbname = $_POST['dbname'];
$newClientId = $_POST['clientId'];
$newClientSecret = $_POST['clientSecret'];
$newRedirectUri = $_POST['redirectUri'];
$newClientPassword = $_POST['password']; // Assuming client password is submitted from form

// Prepare SQL statement to check for existing client
$sql = "SELECT COUNT(*) AS count_exists
        FROM ClientData
        WHERE ClientUsername = ?";

// Prepare and bind parameters for client existence check
$stmt = $adminConn->prepare($sql);
$stmt->bind_param("s", $newUsername);

// Execute the statement for client existence check
$stmt->execute();

// Get the result for client existence check
$result = $stmt->get_result();
$row = $result->fetch_assoc();

// Check if the client already exists
if ($row['count_exists'] > 0) {
    echo "Error: Client already exists in the database.";
} else {
    // Proceed with inserting the new record into ClientData table
    $insertSql = "INSERT INTO ClientData (ClientUsername, DatabaseName, GoogleClientId, GoogleClientSecret, RedirectUri, ClientPassword)
                  VALUES (?, ?, ?, ?, ?, ?)";
    
    $insertStmt = $adminConn->prepare($insertSql);
    $insertStmt->bind_param("ssssss", $newUsername, $newDbname, $newClientId, $newClientSecret, $newRedirectUri, $newClientPassword);
    
    if ($insertStmt->execute()) {
        echo "Client information inserted successfully.";

        // Close insert statement
        $insertStmt->close();

        // Create the client's database (ClientsDB)
        $createDbSql = "CREATE DATABASE IF NOT EXISTS $newDbname";
        if ($adminConn->query($createDbSql) === TRUE) {
            echo "Database '$newDbname' created successfully.<br>";

            // Grant privileges to the new user on their database
            $grantPrivilegesSql = "GRANT ALL PRIVILEGES ON $newDbname.* TO '$newUsername'@'localhost' IDENTIFIED BY '$newClientPassword'";
            if ($adminConn->query($grantPrivilegesSql) === TRUE) {
                echo "User privileges granted successfully.<br>";

                // Flush privileges to apply changes
                $flushPrivilegesSql = "FLUSH PRIVILEGES";
                if ($adminConn->query($flushPrivilegesSql) === TRUE) {
                    echo "Privilege tables reloaded successfully.<br>";
                } else {
                    echo "Error reloading privilege tables: " . $adminConn->error . "<br>";
                }

                // Switch to the newly created database (ClientsDB)
                $adminConn->select_db($newDbname);

                // Create clientInfo table in ClientsDB database
                $createTableSql = "CREATE TABLE IF NOT EXISTS clientInfo (
                    ID INT AUTO_INCREMENT PRIMARY KEY,
                    firstName VARCHAR(255),
                    lastName VARCHAR(255),
                    email VARCHAR(255),
                    phone VARCHAR(20),
                    address VARCHAR(255)
                )";

                if ($adminConn->query($createTableSql) === TRUE) {
                    echo "Table 'clientInfo' created successfully in '$newDbname'.";
                } else {
                    echo "Error creating table 'clientInfo': " . $adminConn->error;
                }
            } else {
                echo "Error granting privileges to user: " . $adminConn->error;
            }
        } else {
            echo "Error creating database '$newDbname': " . $adminConn->error;
        }
    } else {
        echo "Error inserting client information: " . $insertStmt->error;
    }
}

// Close select statement and connection for administrative tasks
$stmt->close();
$adminConn->close();
?>
