<?php
header("Access-Control-Allow-Origin: *");  // Or specify your frontend domain
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once('../config/config.php');
require_once('../config/database.php');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { // handle preflight
    http_response_code(200);
    exit();
}

// Validate required POST fields
if (!isset($_POST['location'], $_POST['time_slot'], $_POST['is_booked'])) {
    http_response_code(400);
    echo json_encode(['message' => 'Missing required fields']);
    exit();
}

// Sanitize input
$location   = filter_var($_POST['location'], FILTER_SANITIZE_STRING);
$time_slot = filter_var($_POST['time_slot'], FILTER_SANITIZE_STRING);
$is_booked  = filter_var($_POST['is_booked'], FILTER_SANITIZE_STRING);

// Handle image upload if exists
$uploadDir = __DIR__ . "/uploads/";
$imageName = "placeholder_100.jpg"; // default

if (!empty($_FILES['image']['name'])) {
    $originalName = basename($_FILES['image']['name']);
    $targetFilePath = $uploadDir . $originalName;

    // Check if file already exists
    if (file_exists($targetFilePath)) {
        http_response_code(400);
        echo json_encode(['message' => 'File already exists: ' . $originalName]);
        exit();
    }

    if (!move_uploaded_file($_FILES['image']['tmp_name'], $targetFilePath)) {
        http_response_code(500);
        echo json_encode([
            'message' => 'Error uploading file',
            'php_error' => $_FILES['image']['error']
        ]);
        exit();
    }

    $imageName = $originalName; // overwrite default with uploaded file name
}

// Prepare SQL with imageName column
$stmt = $conn->prepare('INSERT INTO reservations (location, time_slot, is_booked, imageName) VALUES(?, ?, ?, ?)');
$stmt->bind_param('ssss', $location, $time_slot, $is_booked, $imageName);

// Execute statement
if ($stmt->execute()) {
    $id = $stmt->insert_id;
    http_response_code(201);
    echo json_encode([
        'message' => 'Reservation created successfully',
        'id' => $id,
        'imageName' => $imageName
    ]);
} else {
    http_response_code(500);
    echo json_encode(['message' => 'Error creating reservation: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>