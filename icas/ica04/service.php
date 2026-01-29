<?php
/* CMPE2550 - Web Applications
 * Name: Dareen Kinga Njatou
 * ICA3 - MySQL Data Retrieval 
 * service.php
 * Description: Backend service to retrieve authors and their Titles from MySQL database
 * Date: January 20, 2026 */

// Include database functions
require_once "db.php";

// Global output array
$output = array();

// Cleaning data
$clean = array();
foreach ($_GET as $key => $value)
    $clean[trim($connection->real_escape_string(strip_tags(htmlspecialchars($key))))]
        = trim($connection->real_escape_string(strip_tags(htmlspecialchars($value))));

// Determine action 
$action = $clean["action"] ?? "";

// Default message
$output = ["message" => ""];

// Handle actions
switch ($action) {
    case "GetAllAuthors":       GetAllAuthors();        break;
    case "GetTitlesByAuthor":   GetTitlesByAuthor();    break;
    case "DeleteTitle":         DeleteTitle();          break;
    //case "EditTitle":           EditTitle();            break;

    default:
        $output["error"] = "Invalid action specified";
        break;
}

// Return output as JSON
echo (json_encode($output));
die();


/**
 * FunctionName:    GetAllAuthors
 * Description:     Retrieves all authors from the database
 * Input:           Gets data from 'authors' table
 * Output:          Populates $output with authors data and message
 */
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

    // Set message based on number of authors retrieved
    switch (count($output["authors"])) {
        case 0: $output["message"] = "No author records found.";    break;
        case 1: $output["message"] = "Retrieved: 1 author record."; break;
        default:
            $output["message"] = "Retrieved: " . count($output["authors"]) . " author records.";
            break;
    }
}

/**
 * FunctionName:    GetTitlesByAuthor
 * Description:     Retrieves titles for a specific author
 * Input:           Expects 'au_id' parameter in GET request
 * Output:          Populates $output with titles data and message
 */
function GetTitlesByAuthor()
{
    global $output, $clean;

    if (!isset($clean["au_id"])) {
        $output["error"] = "Missing author ID";
        return;
    }
    
    // Get author ID
    $au_id = $clean["au_id"];

    // Query to get titles by author ID
    $query = "
        SELECT t.title_id, t.title, t.type, t.price
        FROM titles t
        JOIN titleauthor ta ON t.title_id = ta.title_id
        WHERE ta.au_id = '$au_id'
    ";

    // Execute query and fetch results
    if ($queryOutput = mySqlQuery($query)) {
        $output["titles"] = $queryOutput->fetch_all();
    } else {
        $output["error"] = "Failed to retrieve titles";
    }

    // Set message based on number of titles retrieved
    switch (count($output["titles"])) {
        case 0: $output["message"] = "No titles found for the specified author.";   break;
        case 1: $output["message"] = "Retrieved: 1 title record.";                  break;
        default:
            $output["message"] = "Retrieved: " . count($output["titles"]) . " title records.";
            break;
    }
}

/**
 * FunctionName:    DeleteTitle
 * Description:     Deletes a title based on provided title ID
 * Input:           Expects 'titleID' parameter in GET request
 * Output:          Populates $output with status message
 */
function DeleteTitle()
{
    global $clean, $output;

    if (!isset($clean["title_id"]))
        $output["message"] = "No title ID was supplied! ";
    else {
        $query = "DELETE FROM titles WHERE title_id = '" . $clean['title_id'] . "'";
        error_log($query);

        $result = -1;
        if ($result = mySqlNonQuery(($query)) >= 0) {
            error_log("$result records were successfully deleted");
            $output["message"] = "$result records were successfully deleted";
        } else{
            error_log("There was a problem with the query!");
            $output["message"] = "There was a problem with the query!";
        }
    }
}

