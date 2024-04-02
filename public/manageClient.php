<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Clients</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5; 
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }

        .container {
            max-width: 800px;
            margin: 20px;
            padding: 20px;
            background-color: #fff;
            border: 2px;
            border-radius: 50px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border-style: outset;
            margin-left: 15%;
        }

        .client-dropdown {
            margin-bottom: 20px;
        }

        .client-details {
            margin-bottom: 20px;
        }

        .client-details label {
            display: block;
            margin-bottom: 10px;
            color: #333;
            font-weight: bold;
            margin: 10px;
        }

        .client-details input {
            width: calc(100% - 22px); 
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            transition: border-color 0.3s;
        }

        .client-details input:focus {
            border-color: #007bff; /* Highlight border color on focus */
            outline: none;
        }

        .button-container {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
        }

        .button-container button {
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s;
        }

        .button-container button:hover {
            background-color: #007bff;
            color: #fff;
            margin-right: 10px;
            
        }

        .back-button {
    position: fixed;
    bottom: 20px; 
    left: 20px;
    padding: 10px 20px;
    font-size: 16px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    
}



    </style>
</head>
<body>
    <div class="container">
        <h1>Manage Clients</h1>
        <div class="client-dropdown">
            <label for="clientSelect">Select Client:</label>
            <select id="clientSelect" onchange="selectClient()">
                <option value="">Select a client</option>
                <!-- PHP code to populate dropdown options -->
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
                $sql = "SELECT ID, firstName, lastName FROM clientInfo";
                $result = $conn->query($sql);

                if ($result->num_rows > 0) {
                    // Output data of each row
                    while($row = $result->fetch_assoc()) {
                        echo '<option value="' . $row["ID"] . '">' . $row["firstName"] . ' ' . $row["lastName"] . ' (' . $row["ID"] . ')</option>';
                    }
                }
                $conn->close();
                ?>
            </select>
        </div>
        <div id="clientDetails" class="client-details">
            <label for="firstName">First Name:</label>
            <input type="text" id="firstName" name="firstName" readonly>
            <label for="lastName">Last Name:</label>
            <input type="text" id="lastName" name="lastName" readonly>
            <label for="email">Email:</label>
            <input type="text" id="email" name="email" readonly>
            <label for="phone">Phone:</label>
            <input type="text" id="phone" name="phone" readonly>
            <label for="address">Address:</label>
            <input type="text" id="address" name="address" readonly>
        </div>
    </div>
    <div class="button-container">
        <button onclick="editClient()">Edit Client</button>
        <button onclick="updateClient()">Update Client</button>
        <button onclick="deleteClient()">Delete Client</button>
    </div>
    

   

    <script>
        function selectClient() {
            const clientId = document.getElementById('clientSelect').value;

            if (clientId) {
                // Send request to server to fetch client details
                fetch('http://localhost/project2024/public/getClientDetails.php?id=' + clientId)
                    .then(response => response.json())
                    .then(data => {
                        // Populate text boxes with client data
                        document.getElementById('firstName').value = data.firstName || '';
                        document.getElementById('lastName').value = data.lastName || '';
                        document.getElementById('email').value = data.email || '';
                        document.getElementById('phone').value = data.phone || '';
                        document.getElementById('address').value = data.address || '';
                    })
                    .catch(error => {
                        console.error('Error fetching client details:', error);
                    });
            } else {
                // Clear text boxes if no client selected
                document.getElementById('firstName').value = '';
                document.getElementById('lastName').value = '';
                document.getElementById('email').value = '';
                document.getElementById('phone').value = '';
                document.getElementById('address').value = '';
            }
        }

        function editClient() {
            document.getElementById('firstName').readOnly = false;
            document.getElementById('lastName').readOnly = false;
            document.getElementById('email').readOnly = false;
            document.getElementById('phone').readOnly = false;
            document.getElementById('address').readOnly = false;
        }

        function updateClient() {
            // Get the updated values from text boxes
            const clientId = document.getElementById('clientSelect').value;
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const address = document.getElementById('address').value;

            // Send a POST request to updateClient.php
            fetch('http://localhost/project2024/public/updateClient.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ clientId, firstName, lastName, email, phone, address })
            })
            .then(response => response.text())
            .then(data => {
                alert(data);
            })
            .catch(error => {
                console.error('Error updating client:', error);
            });
        }

        function deleteClient() {
    // Get the selected client ID
    const selectedClientId = document.getElementById('clientSelect').value;

    // Check if a client is selected
    if (selectedClientId) {
        // Confirm deletion with the user
        const confirmation = confirm('Are you sure you want to delete this client?');

        if (confirmation) {
            // Send a POST request to the deleteClient.php script
            fetch('http://localhost/project2024/public/deleteClient.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: 'clientId=' + selectedClientId
            })
            .then(response => {
                if (response.ok) {
                    // If deletion is successful, show alert
                    alert('Client deleted successfully');
                } else {
                    // If there's an error, show alert with error message
                    response.text().then(errorMessage => {
                        alert('Error deleting client: ' + errorMessage);
                    });
                }
            })
            .catch(error => {
                // Handle fetch errors
                console.error('Error deleting client:', error);
                alert('Error deleting client');
            });
        }
    } else {
        // No client selected
        alert('Please select a client to delete');
    }
}

function goBack() {
        // Go back to the previous page
        window.history.back();
    }
    </script>
    <button onclick="goBack()" class="back-button">Back</button>
</body>
</html>

