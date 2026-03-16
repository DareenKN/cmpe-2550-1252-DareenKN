<?php
require_once "functions.php";
require_once "db.php";
error_log("Inside userManagement.php");
session_start();

if (!isset($_SESSION["username"])) {
    header("Location: register.php");
    exit();
}

if ($_SESSION["rank"] > 1) { // only Root or Admin allowed
    header("Location: index.php?status=Not authorized");
    exit();
}

$username = $_SESSION["username"];
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Lab02 – Role Management</title>

    <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&display=swap" rel="stylesheet">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="dataRetrieval.js"></script>
    <link rel="stylesheet" href="css/style.css">
</head>

<body>

    <header>
        <h1>Lab02 – Role Management</h1>
    </header>

    <main>

        <section class="user-management">

            <!-- Add User Panel -->
            <div class="add-user-panel">

                <h2>Add User</h2>


                <p class="back-link">
                    <a href="index.php">Index</a>
                </p>

            </div>

        </section>

    </main>
    <footer>
        &copy Copyright 2026 by Dareen Njatou <br>
        Last modified on
        <script>document.write(document.lastModified)</script>
    </footer>

</body>

</html>