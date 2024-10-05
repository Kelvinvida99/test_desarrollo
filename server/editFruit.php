<?php

include('database.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['id']) && isset($_POST['name']) && isset($_POST['url'])) {
        $id = mysqli_real_escape_string($connection, $_POST['id']);
        $name = mysqli_real_escape_string($connection, $_POST['name']);
        $url = mysqli_real_escape_string($connection, $_POST['url']);

        $file_path = null;

        if (isset($_FILES['file']) && $_FILES['file']['error'] == 0) {
            $uploadDir = 'uploads/';
            $fileName = basename($_FILES['file']['name']);
            $uploadFile = $uploadDir . $fileName;

            if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadFile)) {
                $file_path = mysqli_real_escape_string($connection, $uploadFile);
            } else {
                echo json_encode(['error' => 'Error al mover el archivo']);
                exit();
            }
        }

        if ($file_path) {
            $query = "UPDATE fruit SET name = '$name', url = '$url', pathImage = '$file_path' WHERE id = $id";
        } else {
            $query = "UPDATE fruit SET name = '$name', url = '$url' WHERE id = $id";
        }

        $result = mysqli_query($connection, $query);

        if (!$result) {
            echo json_encode(['error' => 'Query Failed: ' . mysqli_error($connection)]);
            exit();
        }

        echo json_encode(['message' => 'Record Updated Successfully']);
    } else {
        echo json_encode(['error' => 'Invalid or missing data']);
    }
} else {
    echo json_encode(['error' => 'Método no permitido']);
}

?>
