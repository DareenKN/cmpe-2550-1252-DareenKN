<?php
// Create a session if one does not already exist, or join the existing session
session_start();  

// NOTE: Session variables may be set or retrieved by indexing the $_SESSION superglobal
//       $SESSION is available any time after session_start() has been used, in all scopes

error_log(json_encode($_GET));

// Clean all input data
$clean = array();
foreach($_POST as $key => $value)
    $clean[trim(strip_tags(htmlspecialchars($key)))] = 
                    trim(strip_tags(htmlspecialchars($value)));

error_log(json_encode($clean));
                   
$output = array();  // create an array for output data to be sent to the client



// Check if an action has been provided
if (isset($clean["action"]))
{
    // Perform the action requested by the client if it exists
    if($clean["action"] == "CalcArea")
    {
        // Populate the data object to be returned if necessary
        $output["area"] = CalculateArea();
        $output["status"] = "Area calculation successful!";

        // Preserve a value in the session to be made accessible next time
        // the session is joined.  Can be ANY data type, simple or complex.
        $_SESSION["lastAreaCalc"] = $output["area"];
    }
    else if($clean["action"] == "CalcVol")
    {
        $output["volume"] = CalculateVolume();
        $output["status"] = "Volume calculation successful!";
    }
    else if($clean["action"] == "GetLastArea")
    {
        // Check if a particular session variable exists
        if (isset($_SESSION["lastAreaCalc"]))
        {
            // Retrieve the session and load it into the object to be returned
            // You could of course do other things with the retrieved session value
            $output["area"] = $_SESSION["lastAreaCalc"];
            $output["status"] = "Last area retrieved successfully!";
        }
        else
        {
            $output["status"] = "No previous area calculation available!";
        }
    }
    else
    {
        $output["status"] = "The requested action is not supported!";
    }
}

// JSON encode the output data for the client and echo it as the return to the AJAX call
echo json_encode($output);
die();  // This command will ensure that no further executable code is reached, but 
        // function definitions below this line are permitted.


/**
 * FunctionName:    CalculateArea
 * Inputs:          None
 * Outputs:         Area of a circle
 * Decription:      Calculates the area of a circle using the radius supplied in the included
 *                  global clean data array.
 */
function CalculateArea()
{
    global $clean, $output;

    return pi() * pow($clean["radius"], 2);
}

/**
 * FunctionName:    CalculateVolume
 * Inputs:          None
 * Outputs:         Area of a circle
 * Decription:      Calculates the area of a circle using the radius supplied in the included
 *                  global clean data array.
 */
function CalculateVolume()
{
    global $clean, $output;

    return 4 * pi() * pow($clean["radius"], 3) / 3;
}




