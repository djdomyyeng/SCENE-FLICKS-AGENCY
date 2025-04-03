<?php
// Database connection settings
$servername = "localhost"; // Change to your server
$username = "root"; // Change to your database username
$password = ""; // Change to your database password
$dbname = "sceneflicks"; // Change to your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Function to handle image uploads
function uploadImage($file, $directory) {
    $targetDir = "uploads/" . $directory . "/";
    $targetFile = $targetDir . basename($file["name"]);
    $imageFileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));
    
    // Check if image file is an actual image or fake image
    if (getimagesize($file["tmp_name"]) === false) {
        return "File is not an image.";
    }

    // Check if file already exists
    if (file_exists($targetFile)) {
        return "Sorry, file already exists.";
    }

    // Check file size (5MB max for example)
    if ($file["size"] > 5000000) {
        return "Sorry, your file is too large.";
    }

    // Allow certain file formats
    if ($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "gif") {
        return "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
    }

    // Try to upload the file
    if (move_uploaded_file($file["tmp_name"], $targetFile)) {
        return $targetFile;
    } else {
        return "Sorry, there was an error uploading your file.";
    }
}

// Handle form submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Gather form data
    $propertyName = $_POST['property-name'];
    $propertyDescription = $_POST['property-description'];
    $propertyLocation = $_POST['property-location'];

    // Handle image uploads
    $thumbnail = uploadImage($_FILES['property-thumbnail'], 'thumbnails');
    $coverPhoto = uploadImage($_FILES['property-cover'], 'covers');
    $babyPoolImage = uploadImage($_FILES['baby-pool'], 'pools');
    $adultPoolImage = uploadImage($_FILES['adult-pool'], 'pools');
    
    // Handle room images (example for Standard Room)
    $standardRoomImages = [];
    foreach ($_FILES['standard-room']['name'] as $key => $value) {
        $standardRoomImages[] = uploadImage($_FILES['standard-room']['tmp_name'][$key], 'rooms');
    }

    // You can handle other images in the same way

    // Example for prices and meal plans
    $bedOnlyPrice = $_POST['bed-only-price'];
    $halfBoardPrice = $_POST['half-board-price'];
    $fullBoardPrice = $_POST['full-board-price'];

    // SQL to insert the property data into the database
    $sql = "INSERT INTO properties (property_name, property_description, property_location, thumbnail, cover_photo, baby_pool_image, adult_pool_image, standard_room_images, bed_only_price, half_board_price, full_board_price) 
            VALUES ('$propertyName', '$propertyDescription', '$propertyLocation', '$thumbnail', '$coverPhoto', '$babyPoolImage', '$adultPoolImage', '" . implode(",", $standardRoomImages) . "', '$bedOnlyPrice', '$halfBoardPrice', '$fullBoardPrice')";

    if ($conn->query($sql) === TRUE) {
        echo "New property added successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

    $conn->close();
}
?>
