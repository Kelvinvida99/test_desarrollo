<?php

include('database.php');

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['id'])) {
  $id = mysqli_real_escape_string($connection, $data['id']);
  $query = "DELETE FROM fruit WHERE id = $id";
  $result = mysqli_query($connection, $query);

  if (!$result) {
    echo json_encode(['error' => 'Query Failed: ' . mysqli_error($connection)]);
    exit();
  }

  echo json_encode(['message' => 'Task Deleted Successfully']);
} else {
  echo json_encode(['error' => 'ID not provided']);
}

?>
