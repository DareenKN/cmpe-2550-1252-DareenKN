<?php
    error_log("In DB util file");

    // Database connection information
    $mysql_connection= null;

    $mysql_response= "";

/****************************************************
 * mySQLConnection(): Establish connection to DB
 * Inputs           : No
 * Output           : No
 ***************************************************/    
function mySQLConnection()
{
    // Grab hold on to connection variable
    global $mysql_connection;

    // Try to connect to DB
    /*
    mysqli(): Will connect to DB and return connection info
    1. DB SERVER: localhost
    2. Username: 
    3. Password:
    4. DB Name:
    */
                                // DB Server  , Username,          Password,          DB Name
    $mysql_connection = new mysqli("localhost", "aulakhha_2550A01", "zC7D{Fgq9Z&m", "aulakhha_2550A01");

    if($mysql_connection -> connect_errno)
    {
        error_log("Connection error");
        die();
    }
    // if you are here
    error_log("Connection is successful");
}


/****************************************************
 * mySelectQuery(): To execute your select queries 
 * Inputs           : query
 * Output           : Result set or false
 ***************************************************/    
function mySelectQuery($myquery)
{
    // Grab hold on to connection variable
    global $mysql_connection;  

    $results = false;

    // Run the query 
    // query function will return result set or false
    if( !($results = $mysql_connection -> query( $myquery) ) )
    {
        // error 
        error_log("Error while executing query ");
        return false;
    }
    else
    {
        // All good
        // Return the result set back to calling location
        error_log("Inside DBUtil before returning result set");
        
        return $results;
    }

}

// Testing purpose only
//mySQLConnection();

/****************************************************
 * mysqlNonQuery()  : To execute your DML queries 
 * Inputs           : query
 * Output           : true or false
 ***************************************************/    

 function mysqlNonQuery($myDMLQuery)
 {
    // Grab hold on to connection variable
    global $mysql_connection, $mysql_response;  

    $result = 0;
    // Validate your connection that you have an active connection in place

    if($mysql_connection ==null)
    {
        error_log("No active connection");
        $mysql_response = "No active connection. Make to establish a connection first";
        return false;
    }
    if(!($result = $mysql_connection->query($myDMLQuery)))
    {
        error_log("Error while executing query");
        $mysql_response= "Query Error: {$mysql_connection->errno} : {$mysql_connection->error}";
        return false;
    }
    // All good
    error_log("success");
    return $mysql_connection->affected_rows;  // affected_rows will give you the total number of rows affected

 }
?>