<?php
require_once "db.php";
require_once "functions.php";
session_start();
error_log("Inside Register.php");

$status = "";

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    error_log("In main lgic");
    $username = trim(strip_tags($_POST['username']));
    $password = trim(strip_tags($_POST['password']));
    $action = $_POST['action'];

    if ($username == '') {
        $status = "No username supplied";
        error_log($status);
    } elseif ($password == '') {
        if (userCheck($username) && $action == "register") {
            $status = "User already exists";
            error_log($status);
        } else
            $status = "No password supplied";
        error_log($status);
    } else {
        error_log(("Password: $password"));

        if ($action == "register") {
            $success = RegisterCheck($username, $password);
            if ($success) {
                $_SESSION["username"] = $username;
            }
        }

        if ($action == "login") {
            $success = LoginCheck($username, $password);
            if ($success) {
                $_SESSION["username"] = $username;
                header("Location: index.php");
            }
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Lab02 – Register / Login</title>

    <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
</head>

<body>
    <header>
        <h1>Lab02 – Register / Login</h1>
    </header>

    <main>

        <section class="auth-container">

            <div class="auth-card">

                <form method="POST">
                    <div class="form-row">
                        <label for="username">User Name:</label>
                     <input type="text" name="username" id="username" placeholder="Supply a username"
                            value="<?php echo $username ?? '' ?>">
                    </div>

                    <div class="form-row">
                        <label for="password">Password:</label>
                        <input type="password" name="password" id="password" placeholder="Supply your password">
                    </div>

                    <div class="auth-buttons">
                        <button class="btn" type="submit" name="action" value="register"
                            id="btn-register">Register</button>
                        <button class="btn" type="submit" name="action" value="login" id="btn-login">Login</button>
                    </div>

                    <div id="auth-status">
                        Page Status:
                        <?php echo $status ?? ''; ?>
                    </div>
                </form>
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