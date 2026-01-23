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
        error_log("Connectiom created successfully");
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

$output = NULL;
$query = "SELECT * FROM titles";
if ($output = mySqlQuery($query))
    error_log(json_encode($output->fetch_all()));
else
    error_log("Something went wrong with the query!");