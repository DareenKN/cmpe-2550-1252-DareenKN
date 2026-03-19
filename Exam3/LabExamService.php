<?php
require_once 'db.php';  // Copy your db.php into your exam folder 


$output = array();


// Cleaning data
$clean_get = CleanCollection($_GET);
$clean_post = CleanCollection($_POST);

//  Function    :   GetTag
//  Accepts     :   Tag value to retrieve
//  Description :   The function will query for the tag that has been specified by the input 
//                      from the user.  If found, details are returned as a string encoded table body
//                  Note:  Tag value should be exactly 6 characters long.

if (isset($_GET["getTag"]) && strlen($_GET["getTag"]) == 6) {
    echo json_encode(GetTag($_GET["getTag"]));
    die();
}


// NOTE: YOU MAY NEED TO CHAGE THE NAME(S) OF VARIABLES IN THE FOLLOWING FUNCTION TO MATCH 
// 		YOUR db.php FILE!
function GetTag($inputData)
{
    global $mysql_connection, $mysql_response;
    //$cleanedData = $mysql_connection->real_escape_string(strip_tags(trim($inputData)));
    $cleanedData = $inputData;

    $query = "SELECT tagID, tagMin, tagMax from tags where tagID = '$cleanedData'";

    $respData["getTag"] = "";
    if ($results = mysqlQuery($query)) {
        while ($row = $results->fetch_assoc()) {
            $respData["getTag"] .= "<tr><td>" . $row['tagID']
                . "</td><td>" . $row['tagMin']
                . "</td><td>" . $row['tagMax']
                . "</td></tr>";
        }
    } else
        return $mysql_response[0];

    return $respData;
}


if (isset($_POST["tagManipOP"]) && isset($_POST["tagManipID"])) {
    $val = $clean_post['tagManipID'];
    $mode = $clean_post['tagManipOP'];
    ManipulateTagData($val, $mode);
}

// Return output as JSON
error_log("Output: " . print_r($output, true));
echo (json_encode($output));
die();






// Follow the service pattern that has been demo'd and enforced in class!  Clean data, perform operation, echo output...
//
// REST operations are not permitted!                 
//
// die(); the page after you echo back to the user!




//  Function    :   ManipulateTagData
//  Accepts     :   The tag modification operation (an insert, update or delete will be requested)
//                  The tagID to be manipulated
//  Description :   This function will cause a data modification of a specified tag to occur
//
//                  Note:   An insert may only take place if the tagID does not already exist.  You will check for this,
//                          and return an error message if the insert is unsuccessful.  For update and delete, the 
//                          operation will return an error message if the tag does not exist.  For any operation to 
//                          occur, the entered tag must be exactly 6 characters long.
//
//                  When inserting or updating a tag, you shall generate a random tagMin value between 30000 and 35000,
//                  and a random tagMax value between 40000 and 45000.
//
//                  All operations shall return a proper status message back to the user.  See the "working solution" for sample 
//                  messages, remembering to test out more than one path of operation.
//                  ie. Insert then update then update then update then delete
//                      Delete then delete then update then insert then insert
//                      etc.
//                  Basically make sure you are able to hit all of your status messages.
//
//                  Upon completion of the data modification, construct and return the following result string as an 
//                  associative data element : 
//                  $respData["ManipulateTagResponse"] = "Your_data_manipulation_status_message : # row(s) affected"
//                  See the functioning page for examples of expected messages.  Remember to test all permutations.
//
function ManipulateTagData($tagManipID, $tagManipOP)
{

    global $mysql_connection, $mysql_response, $clean_post, $output, $clean_post;

    $cleanedData = $tagManipID;

    //$cleandata = 
    $tagManipID = $cleanedData;

    if (empty($tagManipID) || $tagManipID == "") {
        return;
    }
    if (strlen($tagManipID) != 6) {
        $output["ManipulateTagResponse"] = "TagID must be exactly 6 characters long : 0 rows affected";
        return;
    }

    $output["mode"] = $tagManipOP;

    switch ($tagManipOP) {
        case 'insert':
            $exists = mySqlQuery($query = "SELECT tagID, tagMin, tagMax from tags where tagID = '$cleanedData'");

            if (!$exists || $exists->num_rows === 0) {

                $tagMin = rand(30000, 35000);
                $tagMax = rand(40000, 45000);

                $query = "INSERT INTO tags (tagID, tagMin, tagMax)
                    VALUES ('$cleanedData', '$tagMin', '$tagMax')";

                if (mySqlNonQuery($query) < 1) {
                    $output["error"] = "Failed to insert tag.";
                    return;
                }

                $output["ManipulateTagResponse"] = "Inserted $cleanedData with Min = $tagMin and Max = $tagMax : $exists->num_rows row affected";
            } else {
                $output["ManipulateTagResponse"] = "Insert failed! $cleanedData tag already exists : 0 row affected";
            }


            break;

        case 'delete':
            $exists = mySqlQuery($query = "SELECT tagID, tagMin, tagMax from tags where tagID = '$cleanedData'");

            if (!$exists || $exists->num_rows === 0) {
                $output["ManipulateTagResponse"] = "$cleanedData tag not found for Delete : 0 rows affected";
            } else {
                $query1 = "DELETE FROM tags where tagID = '$cleanedData'";
                $result1 = -1;


                if ($result1 = mysqlNonQuery($query1) >= 0) {
                    $output["ManipulateTagResponse"] = "Deleted $cleanedData tag: $result1 row affected";
                } else {
                    $output["error"] = "Was not able to delete in tags table!";
                }
            }
            break;

        case 'update':
            $exists = mySqlQuery($query = "SELECT tagID, tagMin, tagMax from tags where tagID = '$cleanedData'");

            if (!$exists || $exists->num_rows === 0) {

                $output["ManipulateTagResponse"] = "$cleanedData tag not found for Update : 0 rows affected";
            } else {

                $tagMin = rand(30000, 35000);
                $tagMax = rand(40000, 45000);

                $query = "UPDATE tags SET tagMin = '$tagMin', tagMax = '$tagMax' 
                            WHERE tagID = '$cleanedData'";

                $result = mySQLNonQuery($query);
                if ($result >= 0) {
                    $output["ManipulateTagResponse"] = "Updated $cleanedData with Min = $tagMin and Max = $tagMax : $result row affected";
                } else {
                    error_log("Error updating tag: " . $result . "");
                }

            }

            break;
    }
}




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








// THE FOLLOWING SHOULD NOT OCCUR IF YOU HAVE COMPLETED THE ABOVE CORRECTLY.
// No Match condition, return whatcha got/get
$out["status"] = "LabExamService:Error - no match, see parameters";
$out["get"] = $_GET;
$out["post"] = $_POST;
echo json_encode($out);
die();