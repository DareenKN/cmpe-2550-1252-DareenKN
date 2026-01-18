<?php 
    // Step 1: Validation: Validate the data and request coming from client side
    /*
        isset()- function checks whether or not a variable is set
        which means it has to be declared and is not null
    */
    
    if(isset($_GET['username']) &&  strlen( $_GET['username']) > 0)
    {
        // Step 2:// Sanitize your inputs
        /*
            Need to sanitize your data received from client side
            trim()- clean white spaces from both ends of the input
            strip_tags() - strip a string from HTML, XML, PHP or tags

        */
        error_log("Before cleaning data: " .  $_GET['username']);
        // stt function is defined at the bottom of the file
        
        $cleanName = stt( $_GET['username'] );
        $cleanAge = stt( $_GET['userage'] ) ;

        error_log("After cleaning data: " .  $cleanName);

        echo "<br>Welcome to server side";
        echo "<br>Username Details ";
        echo "<br>Username:  " . $cleanName;
        echo "<br>Age:  " . $cleanAge;
    }
    else
    {
        echo "Sorry you are not allowed. Provide valid data or Enjoy the winter outside";
    }

    /**********************
     * stt      : To clean input 
     * Input    : String
     * Outpur   : Cleaned String
     * 
     */
    function stt($input)
    {
         return strip_tags( trim($input));
    }
?>