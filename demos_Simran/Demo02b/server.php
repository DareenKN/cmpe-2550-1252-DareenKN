<?php
    error_log("Inside server side");
    
    // Validation
    if($_SERVER['REQUEST_METHOD']=="GET")
    {
        if(isset($_GET['action']) && $_GET['action']=="b2")
        { // Request is for b2 button
            $cleanName = strip_tags( trim( $_GET['p1Name']) );

            echo "Hello $cleanName";
        }
        else if(isset($_GET['action']) && $_GET['action']=="b3")
        { // Request is for b3 button
            $cleanName = strip_tags( trim( $_GET['p1Name']) );
            $score = 3;
            
            $data = (object) [
                'name'         => $cleanName,
                'currentScore' => $score,
                'nextTurn'     => 2 
            ];
            
            error_log( json_encode($data) );
            // Send data back to client
            // Convert the data object into a string

            // json_encode(): covert an object into string
            echo json_encode($data);
            
        }
        else
        { // otherwise b1 button
            echo "Hello message from server";
        }
    }
    else
    {
        echo "No You are not allowed.";
    }

?>