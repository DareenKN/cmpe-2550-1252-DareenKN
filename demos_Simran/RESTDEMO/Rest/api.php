<?php
error_log("Inside API.php GET:".json_encode($_GET));
error_log("Inside API.php Request:".json_encode($_REQUEST['request']));

require_once 'apiDef.php';

try
{
    $API = new MyAPI($_REQUEST['request']);  // Pass the information to constructor
    error_log("Inside API.PHP after constructor call");
    
    // Just for testing exception part - Uncomment the following line to test it.
    // throw new Exception("Testing an intentional exception");
    echo $API->processAPI();
}
catch(Exception $e)
{
    echo json_encode(Array('error' => $e->getMessage()));
}