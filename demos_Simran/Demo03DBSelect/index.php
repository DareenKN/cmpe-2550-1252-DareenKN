<?php
    require_once('dbUtil.php');
?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Demo 03</title>
    </head>
    <body>
        <header>
            <h1> Week 4: Day 03 :Demo 03: Connecting to DB </h1> 
        </header>

        <main>
            <?php
                // Direct query to do this one
                
                // Step 1: Establish connection
                mySQLConnection();

                // Step 2: Prepare your query 
                $query = "select * from Students ";
                //$query .= "where Sid = 2";

                // Pattern search
                $query .= "where SFirstName like '_i%'";

                error_log("Query " . $query);

                // Step 3: Run your query 

                $myresultset = mySelectQuery($query);
                
                // Header row
                echo "Sid   FirstName    LastName   Email     Phone<br>";
                // fetch_assoc will return one row of data at a time as an object
                while($row = $myresultset -> fetch_assoc() )
                {
                    // Data row
                    echo $row['Sid'] . "  | " . $row['SFirstName'] . "   |   " . $row['SLastName'] ."<br>" ;
                }

                // with Stored Procedure 

                // Step 1: establish the connection

                mySQLConnection();

                $seachPattern= "imr";
                // Step 2: call your SP
                $query = "call Getstudents('$searchPattern')";  // string values should be in single quotes


                /*
                    Create your SP in DB 
                    select * from Students
                    where SFirstName like CONCAT('%', serachPattern, '%')
                */
                $myresultset = mySelectQuery($query);
                
                // Step 3 : Iterate through the result set

                // Header row
                echo "Testing with SP<br>";
                echo "Sid   FirstName    LastName   Email     Phone<br>";
                // fetch_assoc will return one row of data at a time as an object
                while($row = $myresultset -> fetch_assoc() )
                {
                    // Data row
                    echo $row['Sid'] . "  | " . $row['SFirstName'] . "   |   " . $row['SLastName'] ."<br>" ;
                }

            ?>
        </main>

    </body>
</html>