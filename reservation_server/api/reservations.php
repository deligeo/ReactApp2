<?php
session_start();

// ✅ Enable error reporting for debugging (optional in dev)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// ✅ CORS headers
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// ✅ Load config and DB connection
require_once('../config/config.php');
require_once('../config/database.php');

// ✅ Check authentication
if (!isset($_SESSION['user'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit;
}

// ✅ Pagination config
$maxReservationsPerPage = 4;
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$offset = ($page - 1) * $maxReservationsPerPage;

// ✅ Get total reservations count
$countQuery = "SELECT COUNT(*) as total FROM reservations";
$countResult = mysqli_query($conn, $countQuery);

if (!$countResult) {
    http_response_code(500);
    echo json_encode(['message' => 'Error fetching reservations count: ' . mysqli_error($conn)]);
    mysqli_close($conn);
    exit();
}

$countRow = mysqli_fetch_assoc($countResult);
$totalReservations = (int)$countRow['total'];

// ✅ Fetch reservations (ordered by most recent ID)
$query = "SELECT * FROM reservations ORDER BY id DESC LIMIT ?, ?";
$stmt = mysqli_prepare($conn, $query);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(['message' => 'Error preparing reservation query: ' . mysqli_error($conn)]);
    mysqli_close($conn);
    exit();
}

mysqli_stmt_bind_param($stmt, "ii", $offset, $maxReservationsPerPage);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

if (!$result) {
    http_response_code(500);
    echo json_encode(['message' => 'Error executing reservation query: ' . mysqli_error($conn)]);
    mysqli_close($conn);
    exit();
}

$reservations = mysqli_fetch_all($result, MYSQLI_ASSOC);

// ✅ Return response
if (empty($reservations)) {
    http_response_code(404);
    echo json_encode([
        'message' => 'No reservations found',
        'totalReservations' => $totalReservations
    ]);
} else {
    http_response_code(200);
    echo json_encode([
        'reservations' => $reservations,
        'totalReservations' => $totalReservations
    ]);
}

// ✅ Close connection
mysqli_close($conn);
?>
