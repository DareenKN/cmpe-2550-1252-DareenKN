<?php
//strip_tags();

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

    <form action="index.php" method="get"></form>
</body>
</html>