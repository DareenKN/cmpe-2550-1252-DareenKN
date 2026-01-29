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
    if ($clean["action"] == "GetAllAuthors")
        GetAllAuthors();
    if ($clean["action"] == "DeleteTitle")
        DeleteTitle();

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

function GetAllAuthors()
{
    global $output;

    $query = "SELECT * FROM authors";
    $queryOutput = null;
    if ($queryOutput = mySqlQuery($query)) {
        $output["authors"] = $queryOutput->fetch_all();
        error_log(json_encode($output["authors"]));
    } else
        error_log("Something went wrong with the query!");
}

function DeleteTitle()
{
    global $clean, $output;

    if (!isset($clean["titleID"]))
        $output["status"] = "No title ID was supplied! ";
    else {
        $query = "DELETE FROM titles WHERE title_id = '" . $clean['titleID'] . "'";
        error_log($query);

        $result = -1;
        if ($result = mySqlNonQuery(($query)) >= 0) {
            error_log("$result records were successfully deleted");
            $output["status"] = "$result records were succesfully deleted";
        } else{
            error_log("There was a problem with the query!");
            $output["status"] = "There was a problem with the query!";
        }
    }
}