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
    if ($clean["action"] == "GetBooksByAuthor")
        GetBooksByAuthor();
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

function GetAllTitleAuthors()
{
    global $output;

    $query = "SELECT * FROM titleauthor";
    $queryOutput = null;
    if ($queryOutput = mySqlQuery($query)) {
        $output["titleauthor"] = $queryOutput->fetch_all();
        error_log(json_encode($output["titleauthor"]));
    } else
        error_log("Something went wrong with the query!");
}

function GetBooksByAuthor()
{
    global $output, $clean;

    if (!isset($clean["au_id"])) {
        $output["error"] = "Missing author ID";
        return;
    }

    $au_id = $clean["au_id"];

    $query = "
        SELECT t.title_id, t.title, t.type, t.price
        FROM titles t
        JOIN titleauthor ta ON t.title_id = ta.title_id
        WHERE ta.au_id = '$au_id'
    ";

    if ($queryOutput = mySqlQuery($query)) {
        $output["books"] = $queryOutput->fetch_all();
    } else {
        $output["error"] = "Failed to retrieve books";
    }
}

