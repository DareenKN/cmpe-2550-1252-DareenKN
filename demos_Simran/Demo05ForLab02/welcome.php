<?php

    session_start();

    if(isset($_SESSION['username']))
    {
        echo "Welcome User ".  $_SESSION['username'];
    }
    else
    {
        header("Location:login.php");
        die();
        echo "You are not authorized to see page";
    }
?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome Page</title>
    </head>
    <body>
        <a href="logout.php"> Logout</a>
    </body>
</html>