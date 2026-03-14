<?php
session_start();
error_log("Inside Register.php");

$output = [];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    error_log("In main lgic");
    $username = trim(strip_tags($_POST['username']));
    $password = trim(strip_tags($_POST['password']));
    $action = $_POST['action'];

    if ($username == '') {
        $output['status'] = "No username supplied";
        error_log(json_encode($output));
    } elseif ($password == '') {
        $output['status'] = "No password supplied";
        error_log(json_encode($output));
    } else {

        $secret = password_hash($password, PASSWORD_DEFAULT);
        error_log(("Password: $password"));
        error_log("Encoded : $secret");

        if ($action == "register") {

            $_SESSION["username"] = $username;
            $_SESSION["hash"] = $secret;

            $output["status"] = "Registered";
            error_log(json_encode($output));
        }

        if ($action == "login") {

            if (isset($_SESSION["username"]) && $_SESSION["username"] == $username && password_verify($password, $_SESSION["hash"])) {
                $output["status"] = "Login success";
                header("Location: login.php");
            } else {
                $output["status"] = "Login failed";
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
                        <input type="text" name="username" id="username" placeholder="Supply a username">
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
                        <?php
                        if (isset($output["status"]))
                            echo $output["status"]; ?>
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