<?php
require_once "util.php";

error_log(json_encode($_GET));

$clean = array();
foreach($_GET as $key => $value)
    $clean[trim(strip_tags($key))] = trim(strip_tags($value));

$var = 98 + 34 + 1000;

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    This is HTML Text

    <?php echo "<br />This is a PHP string : $var"; ?>

    <form action="index.php" method="get">
        <input type="text" name="Stuff"  value="<?php echo Blah(); ?>"/>
        <button type="submit">Go!</button>
    </form> 
</body>
</html>
