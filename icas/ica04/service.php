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
    case "GetAllAuthors":
        GetAllAuthors();
        break;
    case "GetTitlesByAuthor":
        GetTitlesByAuthor();
        break;
    case "DeleteTitleAuthor":
        DeleteTitleAuthor();
        break;
    case "EditTitle":
        EditTitle();
        break;
    case "UpdateTitle":
        UpdateTitle();
        break;

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

    $query = "SELECT * FROM authors
              ORDER BY au_lname";
    $queryOutput = null;
    if ($queryOutput = mySqlQuery($query)) {
        $output["authors"] = $queryOutput->fetch_all();
        error_log(json_encode($output["authors"]));
    } else
        error_log("Something went wrong with the query!");

    // Set message based on number of authors retrieved
    switch (count($output["authors"])) {
        case 0:
            $output["message"] = "No author records found.";
            break;
        case 1:
            $output["message"] = "Retrieved: 1 author record.";
            break;
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
        case 0:
            $output["message"] = "No titles found for the specified author.";
            break;
        case 1:
            $output["message"] = "Retrieved: 1 title record.";
            break;
        default:
            $output["message"] = "Retrieved: " . count($output["titles"]) . " title records.";
            break;
    }
}

/**
 * FunctionName:    DeleteTitleAuthor
 * Description:     Deletes a title based on provided title ID
 * Input:           Expects 'titleID' parameter in GET request
 * Output:          Populates $output with status message
 */
function DeleteTitleAuthor()
{
    global $clean, $output;

    if (!isset($clean["title_id"]))
        $output["message"] = "No title ID was supplied! ";
    elseif (!isset($clean["au_id"]))
        $output["message"] = "No author ID was supplied! ";
    else {
        $query = "DELETE FROM titleauthor 
                  WHERE title_id = '" . $clean['title_id'] . "' 
                  AND au_id = '" . $clean['au_id'] . "'";
        error_log($query);
        $result = -1;

        if ($result = mySqlNonQuery(($query)) >= 0) {
            switch ($result) {
                case 0:
                    $output["message"] = "No records were deleted.";
                    error_log("No records were deleted.");
                    break;
                case 1:
                    $output["message"] = "1 record was successfully deleted.";
                    error_log("1 record was successfully deleted.");
                    break;
                default:
                    $output["message"] = "$result records were successfully deleted.";
                    error_log("$result records were successfully deleted.");
                    break;
            }
        } else {
            error_log("There was a problem with the query!");
            $output["message"] = "There was a problem with the query!";
        }
    }
}

function EditTitle()
{
    global $clean, $output;

    if (!isset(($clean["title_id"]))) {
        $output["error"] = "No title ID was supplied!";
        return;
    }

    // Retrieve title details
    $title_id = $clean["title_id"];
    $query_title = "SELECT title, type, price FROM titles WHERE title_id = '$title_id'";
    if($queryOutput = mySqlQuery($query_title)) {
        $titleData = $queryOutput->fetch_assoc();
        $output["title"] = $titleData["title"];
        $output["type"] = $titleData["type"];
        $output["price"] = $titleData["price"];
    } else {
        $output["error"] = "Failed to retrieve title details";
        return;
    }

    $query_types = "SELECT DISTINCT type FROM titles";
    if($queryOutput = mySqlQuery($query_types)) {
        $output["types"] = $queryOutput->fetch_all();
    } else {
        $output["error"] = "Failed to retrieve types";
    }
}

function UpdateTitle()
{
    global $clean, $output;

    if (!isset($clean["title_id"]) || !isset($clean["title"]) || !isset($clean["type"]) || !isset($clean["price"])) {
        $output["error"] = "Missing parameters for updating title!";
        return;
    }

    $title_id = $clean["title_id"];
    $title = $clean["title"];
    $type = $clean["type"];
    $price = $clean["price"];

    // Ensure price is a valid number, zero or positive
    if (!is_numeric($price) || $price < 0) {
        $output["error"] = "Price must be a valid number greater than or equal to zero!";
        return;
    }

    // Update title details
    $query = "UPDATE titles 
              SET title = '$title', type = '$type', price = '$price' 
              WHERE title_id = '$title_id'";

    $result = mySQLNonQuery($query);
    if ($result >= 0) {
        $output["message"] = "Title updated successfully.";
    } else {
        $output["error"] = "Failed to update title.";
    }
}