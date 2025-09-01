<?php
// Enable error reporting (for debugging, disable in production)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Set CORS headers for all requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle OPTIONS preflight request and exit immediately
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // HTTP 200 OK for preflight
    http_response_code(200);
    exit();
}

require_once('../config/config.php');
require_once('../config/database.php');

$request_body = file_get_contents('php://input');
$data = json_decode($request_body, true);

// Basic input validation
if (!isset($data['location'], $data['time_slot'], $data['is_booked']) || 
    empty($data['location']) || empty($data['time_slot']) || empty($data['is_booked'])) {
    http_response_code(400);
    echo json_encode(['message' => 'Missing or empty required parameters']);
    exit();
}

// Sanitize input
$location = filter_var($data['location'], FILTER_SANITIZE_STRING);
$time_slot = filter_var($data['time_slot'], FILTER_SANITIZE_STRING);
$is_booked = filter_var($data['is_booked'], FILTER_SANITIZE_STRING);

// Prepare and execute SQL statement
$stmt = $conn->prepare('INSERT INTO reservations (location, time_slot, is_booked) VALUES (?, ?, ?)');
$stmt->bind_param('sss', $location, $time_slot, $is_booked);

if ($stmt->execute()) {
    http_response_code(201);
    echo json_encode(['message' => 'Reservation created successfully', 'id' => $stmt->insert_id]);
} else {
    http_response_code(500);
    echo json_encode(['message' => 'Database error: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
