<?php

include('database.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    if (isset($_POST['name'])) {
        $fruit_name = mysqli_real_escape_string($connection, $_POST['name']);

        $fruit_url = isset($_POST['url']) ? mysqli_real_escape_string($connection, $_POST['url']) : null;

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

        $columns = "name";
        $values = "'$fruit_name'";

        if ($fruit_url) {
            $columns .= ", url";
            $values .= ", '$fruit_url'";
        }

        if ($file_path) {
            $columns .= ", pathImage";
            $values .= ", '$file_path'";
        }

        $query = "INSERT INTO fruit($columns) VALUES ($values)";
        $result = mysqli_query($connection, $query);

        if (!$result) {
            echo json_encode(['error' => 'Query Failed: ' . mysqli_error($connection)]);
            exit();
        }

        echo json_encode(['message' => 'Datos guardados exitosamente']);
    } else {
        echo json_encode(['error' => 'El campo "name" es obligatorio']);
    }
} else {
    echo json_encode(['error' => 'Método no permitido']);
}

?>
