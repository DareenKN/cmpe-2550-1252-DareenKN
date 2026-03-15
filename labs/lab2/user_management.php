<?php
require_once "functions.php";
require_once "db.php";
error_log("Inside userManagement.php");
session_start();

if (!isset($_SESSION["username"])) {
    header("Location: register.php");
    exit();
}

$username = $_SESSION["username"];
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Lab02 – User Management</title>

    <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
</head>

<body>

    <header>
        <h1>Lab02 – User Management</h1>
    </header>

    <main>

        <section class="user-management">

            <!-- Add User Panel -->
            <div class="add-user-panel">

                <h2>Add User</h2>

                <form method="POST" class="add-user-form">

                    <div class="form-row">
                        <label for="username">UserName :</label>
                        <input type="text" name="username" id="username" placeholder="Supply a username">
                    </div>

                    <div class="form-row">
                        <label for="password">Password :</label>
                        <input type="password" name="password" id="password" placeholder="Supply a password">
                    </div>

                    <div class="form-row">
                        <label for="role">Role :</label>
                        <select name="role" id="role">
                            <option value="Member">Member</option>
                            <option value="Administrator">Administrator</option>
                            <option value="Root">Root</option>
                        </select>
                    </div>

                    <div class="form-row">
                        <button class="btn" type="submit" name="action" value="addUser">Add User</button>
                    </div>

                </form>

            </div>


            <!-- Users Table -->
            <div class="users-table-section">

                <table class="data-table users-table">

                    <thead>
                        <tr>
                            <th>Op</th>
                            <th>UserID</th>
                            <th>UserName</th>
                            <th>Hashed Password</th>
                            <th>Change Role</th>
                        </tr>
                    </thead>

                    <tbody>

                        <?php
                        $query = "SELECT u.user_id, u.username, u.password_hash, r.role_name
                                  FROM users u
                                    JOIN user_roles ur ON u.user_id = ur.user_id
                                    JOIN roles r ON ur.role_id = r.role_id";
                        $result = mySqlQuery($query);
                        $count = 0;
                        if ($result) {
                            while ($row = $result->fetch_assoc()) {
                                $count++;
                                $user_id = $row["user_id"];
                                $user_name = $row["username"];
                                $password_hash = $row["password_hash"];
                                $current_role = $row["role_name"];

                                echo "<tr>";

                                echo "<td>
                                        <form method='POST'>
                                            <button class='btn' name='delete_user' value='$user_id'>Delete</button>
                                        </form>
                                    </td>";

                                echo "<td>$user_id</td>";
                                echo "<td>$user_name</td>";
                                echo "<td>$password_hash</td>";

                                echo "<td>
                                        <form method='POST'>
                                        <input type='hidden' name='user_id' value='$user_id'>
                                        <select name='new_role'>";

                                $roles = mySQLQuery("SELECT role_name FROM roles");
                                $roleList = [];
                                while ($role = $roles->fetch_assoc()) {
                                    $roleList[] = $role["role_name"];
                                }

                                foreach ($roleList as $role_name) {
                                    $selected = ($role_name == $current_role) ? "selected" : "";

                                    echo "<option value='$role_name' $selected>$role_name</option>";
                                }

                                echo "</select>
                                        <button name='change_role'>Change</button>
                                    </form>
                                </td>";

                                echo "</tr>";

                            }
                        }
                        ?>

                    </tbody>

                </table>

                <center><p id="status">Retrieved : <?php echo $count; ?> user records</p></center>

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