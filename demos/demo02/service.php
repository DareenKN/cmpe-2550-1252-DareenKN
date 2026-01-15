<?php

error_log(json_encode($_GET));

// Clean all input data
$clean = array();
foreach ($_GET as $key => $value)
    $clean[trim(strip_tags(htmlspecialchars($key)))] =
        trim(strip_tags(htmlspecialchars($value)));

$output = array();  // Create an array for output data to be send to the client

// Perform the action requested by the client if it exist
if (isset($clean["action"])) {
    if ($clean["action"] == "CalcArea") 
    {
        $output["area"] = CalculateArea();
        $output["status"] = "Area calculation successful";
    } 
    else if ($clean["action"] == "CalcVol") 
    {
        $output["volume"] = CalculateVolume();
        $output["status"] = "Volume calculation successful";
    } 
    else 
    {
        $output["status"] = "The requested action is not supported";
    }
}

echo json_encode($output);
die();

/**
 * FunctionName:    CalculateArea
 * Inputs:          None
 * Outputs:         Area of a circle
 * Description:     Calculates the area of a circle using the radius supplied in the included
 *                  global clean data array
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
 * Description:     Calculates the area of a circle using the radius supplied in the included
 *                  global clean data array
 */
function CalculateVolume()
{
    global $clean, $output;
    return 4.0 /3 * pi() * pow($clean["radius"], 2);
}

?>