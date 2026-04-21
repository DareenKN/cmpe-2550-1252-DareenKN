<?php
require_once "functions.php";
require_once "db.php";
error_log("Inside roleManagement.php");
session_start();

if (!isset($_SESSION["username"])) {
    header("Location: register.php");
    exit();
}

if($_SESSION["rank"] > 2) {// Only root or admin allowed to access role management
    header("Location: index.php?status=Not authorized to access role management");
    exit();
}

$username = $_SESSION["username"];

if ($_SERVER["REQUEST_METHOD"] == "POST" && $_POST["action"] == "logout") {
    session_destroy();
    header("Location: register.php");
    exit();
}
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

                <h2>Add Role</h2>

                <form method="POST" class="add-user-form">

                    <div class="form-row">
                        <label for="rolename">Role Name :</label>
                        <input type="text" name="rolename" id="roleName" placeholder="Supply a role name">
                    </div>

                    <div class="form-row">
                        <label for="desc">Role Description :</label>
                        <input type="text" name="desc" id="roleDescription" placeholder="Supply a description">
                    </div>

                    <div class="form-row">
                        <label for="rolerank">Role Rank:</label>
                        <input type="number" min="1" name="role" id="rolerank" placeholder="Supply a rank">
                    </div>

                    <div class="form-row">
                        <button class="btn" type="button" id="addRole">Add Role</button>
                    </div>

                </form>
                <center>
                    <p id="form-status"></p>
                </center>

            </div>


            <!-- Users Table -->
            <div class="users-table-section">

                <table class="data-table roles-table">

                    <thead>
                        <tr>
                            <th>Delete</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Role Rank</th>
                            <th colspan="2">Change Rank</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>

                <center>
                    <p id="status"></p>
                </center>

                <p class="back-link">
                    <a href="index.php">Index</a>
                </p>

            </div>

            <form method="POST" class="logout-form">
                <button class="btn" type="submit" name="action" value="logout">Logout</button>
            </form>

        </section>

    </main>
    <footer>
        &copy Copyright 2026 by Dareen Njatou <br>
        Last modified on
        <script>document.write(document.lastModified)</script>
    </footer>

</body>

</html>