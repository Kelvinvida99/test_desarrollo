<?php

include('database.php');

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['name'])) {
  $fruit_name = mysqli_real_escape_string($connection, $data['name']);
  $fruit_url = mysqli_real_escape_string($connection, $data['url']);

  $query = "INSERT INTO fruit(name, url) VALUES ('$fruit_name', '$fruit_url')";
  $result = mysqli_query($connection, $query);

  if (!$result) {
    echo json_encode(['error' => 'Query Failed: ' . mysqli_error($connection)]);
    exit();
  }

  echo json_encode(['message' => 'Task Added Successfully']);
} else {
  echo json_encode(['error' => 'Invalid data']);
}

?>
