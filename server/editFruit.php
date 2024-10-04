<?php

include('database.php');

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['id']) && isset($data['name']) && isset($data['url'])) {
  $id = mysqli_real_escape_string($connection, $data['id']);
  $name = mysqli_real_escape_string($connection, $data['name']);
  $url = mysqli_real_escape_string($connection, $data['url']);

  $query = "UPDATE fruit SET name = '$name', url = '$url' WHERE id = $id";

  $result = mysqli_query($connection, $query);
  
  if (!$result) {
    echo json_encode(['error' => 'Query Failed: ' . mysqli_error($connection)]);
    exit();
  }

  echo json_encode(['message' => 'Record Updated Successfully']);
} else {
  echo json_encode(['error' => 'Invalid or missing data']);
}

?>
