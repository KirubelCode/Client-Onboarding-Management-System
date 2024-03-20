<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Clients</title>
    <style>
             body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5; /* Background color */
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }

        .client-container {
            max-width: 800px;
            margin: 0 auto; 
            padding: 20px; 
            padding-bottom: 25px;
            border: 2px solid;
            border-radius: 10px; 
            border-style: outset;
            background-color: #fff; /* Background color */
        }

        .client-box {
            overflow-x: auto;
        }

        .header-row {
            display: flex;
            background-color: #f0f0f0;
            padding: 10px 0;
            font-weight: bold;
        }

        .client-header, .client-detail {
            flex: 1;
            padding: 10px;
            border-right: 1px solid #ccc; /* Add right border */
            border-bottom: 1px solid #ccc; /* Add bottom border */
        }

        .client-row {
            display: flex;
            border-bottom: 1px solid #ccc; /* Add bottom border */
        }

        .client-detail {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            border-left: 1px solid #ccc; 
        }

        .client-info {
            overflow-y: auto; /* Enable vertical scrolling */
            max-height: 400px; /* Limit maximum height to enable scrolling */
        }
        
     
    </style>
</head>
<body>
    <div class="client-container">
        <h1>Manage Clients</h1>
        <div class="client-box">
            <div class="header-row">
                <div class="client-header">ID</div>
                <div class="client-header">First Name</div>
                <div class="client-header">Last Name</div>
                <div class="client-header">Email</div>
                <div class="client-header">Phone</div>
                <div class="client-header">Address</div>
            </div>
            <div class="client-info">
                <?php
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

                // Query to retrieve all client data
                $sql = "SELECT * FROM clientInfo";
                $result = $conn->query($sql);

                if ($result->num_rows > 0) {
                    // Output data of each row
                    while($row = $result->fetch_assoc()) {
                        echo '<div class="client-row">';
                        echo '<div class="client-detail">' . $row["ID"] . '</div>';
                        echo '<div class="client-detail">' . $row["firstName"] . '</div>';
                        echo '<div class="client-detail">' . $row["lastName"] . '</div>';
                        echo '<div class="client-detail">' . $row["email"] . '</div>';
                        echo '<div class="client-detail">' . $row["phone"] . '</div>';
                        echo '<div class="client-detail">' . $row["address"] . '</div>';
                        echo '</div>';
                    }
                } else {
                    echo "0 results";
                }

                $conn->close();
                ?>
            </div>
        </div>
    </div>
</body>
</html>
