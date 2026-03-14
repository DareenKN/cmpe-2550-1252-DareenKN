<?php
error_log("Inside index.php");
session_start();
// If logout button is pressed, destroy the session and redirect to register page
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
                <form method="POST">
                    <center>
                        <button class="btn" type="submit" name="action" value="logout" id="btn-logout">Logout</button>
                    </center>
                </form>
                <div id="auth-status">
                    Page Status: Welcome
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