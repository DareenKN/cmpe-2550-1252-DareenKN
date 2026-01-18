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
            <h1> Week 5: Day 03 :Demo 04: DML Operations </h1> 
        </header>

        <main>
            <?php
                // Direct query to do this one
                
                // Step 1: Establish connection
                mySQLConnection();

                // Step 2: Prepare your query 
                $query = "delete from Students ";  // make sure to add space at the end of every line when you split your query across multiple lines
                $query .= "where Sid = 1";
                // SPECIAL NOTE:
                // FOR Delete/ update without where clause it will delete/ update everything 

                // Pattern search
               // $query .= "where SFirstName like '_i%'";

                error_log("Query " . $query);

                // Step 3: Run your query 

                $response = mysqlNonQuery($query);
                
                if($response== false)
                {
                    echo $mysql_response;
                }
                else
                {
                    echo "Delete Operation has affected $response rows";
                }
                

            ?>
        </main>

    </body>
</html>