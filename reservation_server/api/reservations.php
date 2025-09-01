<?php
// Enable error reporting for debugging (disable in production)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// CORS Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit();
}

// Configurable settings
$allowedMethods = ['GET'];
$method = $_SERVER['REQUEST_METHOD'];
if (!in_array($method, $allowedMethods)) {
  http_response_code(405); // Method Not Allowed
  echo json_encode(['message' => 'Method not allowed']);
  exit();
}


// Load configuration
require_once('../config/config.php');
require_once('../config/database.php');

// Configurable settings
$allowedMethods = ['GET'];
$maxReservationsPerPage = 4;

// Enforce allowed HTTP method
$method = $_SERVER['REQUEST_METHOD'];
if (!in_array($method, $allowedMethods)) {
  http_response_code(405); // Method Not Allowed
  echo json_encode(['message' => 'Method not allowed']);
  exit();
}

// Handle pagination
$page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
$offset = ($page - 1) * $maxReservationsPerPage;

// Query to count total reservations
$countQuery = "SELECT COUNT(*) AS totalReservations FROM reservations";
$countResult = mysqli_query($conn, $countQuery);

if (!$countResult) {
  http_response_code(500);
  echo json_encode(['message' => 'Error fetching reservations count: ' . mysqli_error($conn)]);
  mysqli_close($conn);
  exit();
}

$countRow = mysqli_fetch_assoc($countResult);
$totalReservations = $countRow['totalReservations'];

// Query to get reservations with pagination
$query = "SELECT * FROM reservations ORDER BY id ASC LIMIT $offset, $maxReservationsPerPage";
$result = mysqli_query($conn, $query);

if (!$result) {
  http_response_code(500);
  echo json_encode(['message' => 'Error fetching reservations: ' . mysqli_error($conn)]);
  mysqli_close($conn);
  exit();
}

$reservations = mysqli_fetch_all($result, MYSQLI_ASSOC);

if (empty($reservations)) {
  http_response_code(404);
  echo json_encode(['message' => 'No reservations found', 'totalReservations' => $totalReservations]);
} else {
  http_response_code(200);
  echo json_encode([
    'reservations' => $reservations,
    'totalReservations' => $totalReservations,
    'currentPage' => $page,
    'perPage' => $maxReservationsPerPage
  ]);
}

mysqli_close($conn);
?>
