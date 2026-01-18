<?php
    session_start();  // Rejoin

    session_unset();  // Unset all session variables

    session_destroy(); // destroy the session

    header("Location:login.php"); // Redirect the user to login page

?>