<?php
    require_once('ExternalData.php');
    
    // Single Line comment
    # Single line comment - Another Version to add single line comment
    /*
        Multi line comments using same style we used in Javascipt and C#
    */
    error_log("Inside Index.php file ");
    $name = "Harsimranjot";
    echo "Some stuff from PHP";
    $numbers= array(3,5,7,8); // An array to hold some int values

    function UserData()
    {
        global $name;
        // To access global variables inside the function, you need to mention the scope again
        echo "<br> Inside function your name is $name";
        
        # or super global variables are maintainted in $GLOBALS array
        echo "<br> Inside function your name is ". $GLOBALS['name'];
    }
?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Demo 01a PHP </title>
    </head>
    <body>
        <?php error_log("Value of Name variable $name" );?>
        <h1> <?php  echo "Demo 01a: $name"; ?></h1>

        <?php
            #For Error log
            error_log("Before printing array value"); // Your friend for debugging- same as console.log in Javacript
            echo "<p>Value at index postion 0 in my array: $numbers[0]</p>";
            // You can insert your variables directly inside your string

            // . (dot)  is used to concat strings

            echo "<p>Value at index position 0 in my array: ". $numbers[0]." </p>";

            // Call UserData() function here
            UserData();

            // Try to access age variable from ExternalData.php

            echo "<br>Your age is $age <br>";

            $collection = MakeArray(7);
           
            // using foreach loop print all the values

            $list = "<ul>";
            foreach($collection as $key=> $value)
            {
                $list .= " <li>$key = $value </li>";
            }
            // Regular Concat style
            $list = $list . "</ul>";
            
            // Shortcut Concat style
            //$list .= "</ul>";
            echo $list;
        ?>

    <footer>
        <?php 
            # require_once will include everything from the specified file into current file
           //require_once('footer.php'); 
           include('footer.php');
           
           /*
            The only difference is that include statement generate 
            PHP alert but PHP script will keep running if that file is missing

            On the toher hand, require_once() will generate a fatal error
            and terminates the script

            Recommeded: use require_once() - ALWAYS
           */
        ?>
    </footer>
    </body>
</html>