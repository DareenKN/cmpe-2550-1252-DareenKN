<?php

    // Hashing the password

    //password_hash(actual password, Encry Algo)

    $secret =  password_hash("Simran1234", PASSWORD_DEFAULT);

    error_log($secret);


    function LoginCheck($user, $pass)
    {
        global $secret;
                            // password_verify (Userone, encrypted one stored in DB)
        if($user == "Simran" && password_verify($pass, $secret))
        {
            return true;
        }
        return false;
        
    }



?>