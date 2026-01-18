<?php


    session_start(); // Create or rejoin a session

    if(isset($_SESSION['loginUser']))
    {
    echo "Welcome to my website: ". $_SESSION['loginUser'];

    $_SESSION['item1']= "Book on programming";
    
    echo "<br><a href= 'logout.php'> Logout </a>";
    }
    else{
        header('Location:login.php');
    }
?>