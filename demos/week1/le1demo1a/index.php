<?php
//strip_tags();
// require_once "stuff.php";

$var = 98 + 54 + 100;
error_log(json_encode($_GET));
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    This is plain text as part of HTML 

    <?php echo "<br />The value is $var";?>
    <br />

    <input type="text"/>

    <form action="index.php" method="get"></form>
</body>
</html>