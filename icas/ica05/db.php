<?php

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
    try {
        $results = $connection->query($query);
    } catch (Exception $e) {
        error_log("mySqlQuery : $connection->errno : $connection->error");
        error_log($query);
        error_log($e->getMessage());
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

    try {
        $results = $connection->query($query);
    } catch (Exception $e) {
        error_log("mySqlQuery : $connection->errno : $connection->error");
        error_log($query);
        error_log($e->getMessage());
        return -1;
    }

    return $connection->affected_rows;
}

