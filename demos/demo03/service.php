<?php
require_once "db.php";

$output = array();

$clean = array();
foreach ($_GET as $key => $value)
    $clean[trim($connection->real_escape_string(strip_tags(htmlspecialchars($key))))]
        = trim($connection->real_escape_string(strip_tags(htmlspecialchars($value))));

// Determine action
if (isset($clean["action"])) {
    if ($clean["action"] == "GetAllTitles")
        GetAllTitles();
}
echo (json_encode($output));
die();

function GetAllTitles()
{
    global $output;

    $query = "SELECT * FROM titles";
    $queryOutput = null;
    if ($queryOutput = mySqlQuery($query)) {
        $output["titles"] = $queryOutput->fetch_all();
        error_log(json_encode($output["titles"]));
    } else
        error_log("Something went wrong with the query!");
}