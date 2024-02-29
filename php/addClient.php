<?php
include 'db.inc.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $fname = $_POST['fname'];
    $lname = $_POST['lname'];
    $phone = $_POST['phone'];
    $address = $_POST['address'];
    $email = $_POST['email'];

    $sql = "INSERT INTO clientInfo (Fname, Lname, Phone, Address, Email) VALUES ('$fname', '$lname', '$phone', '$address', '$email')";

    if ($conn->query($sql) === TRUE) {
        echo "";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Client Inserted Successfully</title>
    <link rel="stylesheet" href="styles.css"> 
</head>
<body>
    <div class="container">
        <h1 class="title">Client Inserted Successfully</h1>
        <div class="message">
            <p>The client details have been successfully inserted into the database.</p>
        </div>
        <div class="buttons">
            <a href="index.html" class="btn add-client">Main Menu</a>
        </div>
    </div>
</body>
</html>

