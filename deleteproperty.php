<?php
// Include database connection
include('db_connection.php');

// Check if the property ID is set and not empty
if(isset($_POST['property_id']) && !empty($_POST['property_id'])) {
    // Get the property ID from the form
    $property_id = $_POST['property_id'];

    // Validate the property ID to prevent SQL injection
    $property_id = mysqli_real_escape_string($conn, $property_id);

    // SQL query to delete the property from the database
    $sql = "DELETE FROM properties WHERE property_id = '$property_id'";

    // Execute the query
    if(mysqli_query($conn, $sql)) {
        echo "Property deleted successfully.";
        // Redirect or show a success message
        // header('Location: success_page.php');
    } else {
        echo "Error deleting property: " . mysqli_error($conn);
    }

    // Close the database connection
    mysqli_close($conn);
} else {
    echo "Please provide a property ID to delete.";
}
?>
