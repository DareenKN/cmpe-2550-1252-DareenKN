<?php
error_log("Inside index.php");
session_start();

if (!isset($_SESSION["username"])) {
    header("Location: register.php");
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
    <title>Lab02 – Index Page</title>

    <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
</head>

<body>

    <header>
        <h1>Lab02 – Index Page</h1>
    </header>

    <main>

        <section class="auth-container">

            <div class="auth-card">

                <div class="menu-container">

                    <div class="menu-row">
                        <?php if ($_SESSION["rank"] <= 2) { // only Root, Admin, or Moderator can see user management link
                                echo '<p><a href="user_management.php">User Management</a></p><br>';
                                echo '<p><a href="role_management.php">Role Management</a></p><br>';
                            } ?>
                        <p><a href="messages.php">Messages</a></p>

                    </div>

                    <form method="POST" class="logout-form">
                        <button class="btn" type="submit" name="action" value="logout">Logout</button>
                    </form>

                    <div id="auth-status">
                        Page Status : Welcome <?php echo $username; ?>!
                    </div>

                </div>

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