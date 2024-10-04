<?php

  include('database.php');

  $query = "SELECT * from fruit";
  $result = mysqli_query($connection, $query);
  if(!$result) {
    die('Query Failed'. mysqli_error($connection));
  }

  $json = array();
  while($row = mysqli_fetch_array($result)) {
    $json[] = array(
      'name' => $row['name'],
      'url' => $row['url'],
      'id' => $row['id']
    );
  }
  $jsonstring = json_encode($json);
  echo $jsonstring;
?>
