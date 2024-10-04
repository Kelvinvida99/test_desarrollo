<?php

include('database.php');

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['id'])) {
  $id = mysqli_real_escape_string($connection, $data['id']);

  $query = "SELECT * FROM fruit WHERE id = {$id}";

  $result = mysqli_query($connection, $query);
  
  if (!$result) {
    die('Query Failed: ' . mysqli_error($connection));
  }

  $json = array();
  
  while ($row = mysqli_fetch_array($result)) {
    $json[] = array(
      'name' => $row['name'],
      'url' => $row['url'],
      'id' => $row['id']
    );
  }

  echo json_encode($json[0]);
} else {
  echo json_encode(['error' => 'ID not provided']);
}

?>
