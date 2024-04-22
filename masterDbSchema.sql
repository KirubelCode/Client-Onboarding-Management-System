-- Create a user with the specified credentials
CREATE USER 'masterUser'@'localhost' IDENTIFIED BY 'SetuCarlow2024';

-- Grant privileges to the new user
GRANT ALL PRIVILEGES ON *.* TO 'masterUser'@'localhost';

-- Flush privileges to apply changes
FLUSH PRIVILEGES;

-- Create the master database if it doesn't exist
CREATE DATABASE IF NOT EXISTS MasterDB;

-- Use the master database
USE MasterDB;

-- Create a table to store client information
CREATE TABLE IF NOT EXISTS ClientData (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    ClientUsername VARCHAR(255) NOT NULL,
    ClientPassword VARCHAR(255) NOT NULL,
    DatabaseName VARCHAR(255) NOT NULL,
    GoogleClientId VARCHAR(255) NOT NULL,
    GoogleClientSecret VARCHAR(255) NOT NULL,
    RedirectUri VARCHAR(255) NOT NULL
);
