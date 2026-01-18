<?php

    // Process your form here
    if($_SERVER['REQUEST_METHOD']=="POST")
    {
        // Start a new session or join a session if there is one
        session_start();

        $cleanUserName = strip_tags(trim($_POST['username']));
        
        // Session variable to maintain username
        $_SESSION['loginUser'] = $cleanUserName;

        // Logic to varify username and password
        
        // Redirecting the user to dashboard.php page
        header('Location: dashboard.php');

    }

?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Demo 02 A</title>
    </head>
    <body>
        <h1> Week 02 Day 03 : Demo 02 A: Sessions</h1>

        <form action="login.php" method="POST">
            <label for="username">Username</label>
            <input type="text" name="username" required>

            <input type="submit" name ="submit" value="Login">

        </form>
        

    </body>
</html>