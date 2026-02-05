<?php
/* CMPE2550 - Web Applications
 * Name: Dareen Kinga Njatou
 * ICA3 - MySQL Data Retrieval
 * db.php
 * Description: Database connection and query functions
 * Date: January 20, 2026 */

$connection = null;
mySQLConnect();

function mySQLConnect()
{
    global $connection;

    $connection = new mysqli(
        "localhost",
        "dkinganjatou1251_Tester",
        "NaitSQLKid181",
        "dkinganjatou1251_Test"
    );

    if ($connection->error)
        error_log("Error {$connection->errno} : {$connection->error}");
    else
        error_log("Connection created successfully");
}

function mySqlQuery($query)
{
    global $connection;
    if ($connection == null) {
        error_log("mySqlQuery : No connection established");
        return false;
    }

    $results = false;
    if (!($results = $connection->query($query))) {
        error_log("mySqlQuery : $connection->errno : $connection->errno");
        error_log($query);
        return false;
    }

    return $results;
}

function mySQLNonQuery($query)
{
    global $connection;

    if ($connection == null) {
        error_log("mySqlQuery : No connection established!");
        return -1;
    }

    $result = 0;

    if (!($result = $connection->query($query))) {
        error_log("mySqlQuery : $connection->errno : $connection->error");
        error_log($query);
        return -1;
    }

    $result = $connection->affected_rows;
    return $result;
}