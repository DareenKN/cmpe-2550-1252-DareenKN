<?php
require_once 'db.php';  // Copy your db.php into your exam folder 

//	FOLLOW THE PATTERN INTRODUCED IN CLASS TO HANDLE THE INCOMING DATA AND FUNCTION PROCESSING

// Global output array
$output = array();

// Cleaning data
$clean_get = CleanCollection($_GET);
$clean_post = CleanCollection($_POST);

if(isset($_GET['partA']))
    PartA();

if (isset($_POST['partB']))
    PartB();

// Return output as JSON
error_log("Output: " . json_encode($output));
echo (json_encode($output));
die();

//	ONLY FUNCTION IMPLEMENTATINOS SHOULD OCCUR BELOW THIS LINE OF TEXT 


//  Function    :   PartA
//  Accepts     :   Tag Range Filter value from exam page
//  Description :   The function will query for all tags that have a sum of the 
//                  tagMin and tagMax values that is less than your filter value
//                  ie. tagMax = 120, tagMin = 40 => Sum = 120+40 = 160
//                 
//                  Iterating through the result set, you shall calculate the average of the
//                  differences between the tagMin and tagMax values.
//  
//                  Upon completion, construct and return a result string as an associative data element : 
//                  $respData["partA"].  Format the string as shown in the working copy.
//      
//                  **  No php or sql aggregate functions may be used ( ie. min, max, sum, etc ).
//
//		    Put your PartA code in the blank section following this part of the text
function PartA()
{   
     global $output, $clean_get;
    $val = $clean_get["partA"];

    if ($val == "") {
        $output["error"] = "Missing VAL";
        return;
    }

    $query = "SELECT * FROM `tags` WHERE `tagMin` + `tagMax`<" . $val . "";
    if ($queryOutput = mySqlQuery($query)) {
        $output["titles"] = $queryOutput->fetch_all();
        $output["count"] = count($output["titles"]);
        
        $output["partA"] = "There are ".count($output["titles"])." tags with tagMin+tagMax sum less than 80 : The average difference of tagMin-tagMax is 32.254143646409";
    } else {
        $output["error"] = "Failed to retrieve titles";
    }
}


//  Function    :   PartB
//  Accepts     :   Tag ID filtering value from exam page
//  Description :   The function will query for all tags where the tagID field value ENDS with your filter value
//                  ie.  If the entered filter value is SHOP, then one of the returned tagIDs would be COSHOP
//
//                  You shall retrieve all fields as indicated by the column headers in the exam page.  Note that
//                  the difference squared column does not exist in the table.  You must calculate the expected value
//                  for each row.  This may be accomplished in either the SQL query or in your PHP processing.
//                  ie. For tagID = COSHOP, tagMin = 20, tagMax = 268, Difference Squared = 61504
// 
//                  Process the result set from the query and return the data to the client.
//		    NOTE: Do NOT build a table on the server.  That task is to be completed in the JS file.
//
//                  Upon completion, construct and return the following as an associative data element : 
//                  $respData["partB"] = "Your_result_set_containing_table_rows"
//
//		    Put your PartB code in the blank section following this part of the text
function PartB()
{

    global $output, $clean_post;

    if (!isset($clean_post["partB"])) {
        $output["error"] = "Missing VAL";
        return;
    }

    // Get author ID
    $id_end = $clean_post["partB"];

    if ($id_end == "") {
        $output["error"] = "Missing VAL";
        return;
    }

    // Query to get titles by author ID
    $query = "SELECT * FROM `tags` WHERE `tagID` like '%" . $id_end . "'";

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
 * FunctionName:    CleanCollection
 * Description:     Cleans the collecton retrieved from the AJAX
 * Input:           $_GET or $_POST
 * Output:          The cleaned data
 */
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




// IF THE CONDITIONS DESCRIBED ABOVE HAVE BEEN SATISFIED, YOU SHOULD NOT BE ABLE TO REACH THIS CODE
// No Match condition, return whatcha got/get

$out["status"] = "LabExamService:Error - no match, see parameters";
$out["get"] = $_GET;
$out["post"] = $_POST;
echo json_encode($out);