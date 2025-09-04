<?php
header("Content-Type: application/json");

// Load configuration files
require_once('../config/config.php');
require_once('../config/database.php');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  $requestUri = $_SERVER['REQUEST_URI'];
  $parts = explode('/', $requestUri);
  $id = intval(end($parts)); // Get reservation ID from URL

  $query = "SELECT * FROM reservations WHERE id = ?";
  $stmt = $conn->prepare($query);
  $stmt->bind_param('i', $id);
  $stmt->execute();
  $result = $stmt->get_result();

  if ($result->num_rows === 1) {
    $reservation = $result->fetch_assoc();

    $response = [
      'status' => 'success',
      'data' => [
        'id' => $reservation['id'],
        'location' => $reservation['location'],
        'time_slot' => $reservation['time_slot'],
        'is_booked' => $reservation['is_booked'],
        'imageName' => $reservation['imageName'] ?? null
      ]
    ];

    echo json_encode($response);

  } else {
    echo json_encode(['status' => 'error', 
                      'message' => 'Reservation not found']
    );
  }

  $stmt->close();
  $conn->close();
}
?>