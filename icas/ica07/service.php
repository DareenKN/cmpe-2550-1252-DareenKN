<?php
/* CMPE2550 - Web Applications
 * Name: Dareen Kinga Njatou
 * ICA3 - MySQL Data Retrieval 
 * service.php
 * Description: Backend service to retrieve authors and their Titles from MySQL database
 * Date: January 20, 2026 */

// Include database functions
require_once "db.php";

function CleanCollection($input)
{
  global $connection;
  $clean = array();

  foreach ($input as $key => $value) {
    if (is_array($value)) {
      $clean[trim($connection->real_escape_string(strip_tags(htmlspecialchars($key))))]
        = CleanCollection($value);
    } else {
      $clean[trim($connection->real_escape_string(strip_tags(htmlspecialchars($key))))]
        = trim($connection->real_escape_string(strip_tags(htmlspecialchars($value))));
    }
  }

  return $clean;
}

// Global output array
$output = array();

// Cleaning data
$clean_get = CleanCollection($_GET);
$clean_post = CleanCollection($_POST);

// Determine action from GET or POST parameters
$action = isset($clean_get["action"]) ? $clean_get["action"] :
  (isset($clean_post["action"]) ? $clean_post["action"] : "");

// Default message
$output = ["message" => ""];

// Handle actions
switch ($action) {

  default:
    $output["error"] = "Invalid action specified";
    break;
}

// Return output as JSON
error_log("Output: " . json_encode($output));
echo (json_encode($output));
die();


