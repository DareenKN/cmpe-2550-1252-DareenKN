<?php
require_once "util.php";

$status = "";
$formResult = "";

/* ---------- PART IV : FORM PROCESSING ---------- */
if (
    isset($_GET['name'], $_GET['hobby']) &&
    strlen($_GET['name']) > 0 &&
    strlen($_GET['hobby']) > 0
) {
    $name = strip_tags($_GET['name']);
    $hobby = strip_tags($_GET['hobby']);
    $like = strip_tags($_GET['like']);

    $formResult = "$name really really really likes $hobby (Level: $like)";
    $status .= "+ProcessForm";
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Link for google font preconnect -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <!-- Link for google fonts -->

    <!-- Link for Style Sheet -->
    <link rel="stylesheet" type="text/css" href="css/style.css">

    <!-- Link for JQuery file -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>

    <!-- Link for Script File -->
    <script src="js/script.js"></script>

    <title>ICA01_PHP</title>
</head>

<body>
    <header>
        <h1><a href="../index.html">ICA1</a> - PHP</h1>
    </header>

    <div id="centerContent">
        <div class="innerPanel">
            <!-- Part I - Server Info -->
            <b class="fullspan">Part I : Server Info</b>
            Your IP Address is:
            <p>
                <?= $_SERVER['REMOTE_ADDR']; ?>
            </p>

            $_GET Evaluation:
            <p>
                <?= "Found: " . count($_GET) . " entry in \$_GET"; ?>
            </p>

            $_POST Evaluation:
            <p>
                <?= "Found: " . count($_POST) . " entry in \$_POST"; ?>
            </p>
            <?php $status .= "+ServerInfo"; ?>
        </div>

        <div class="innerPanel">
            <!-- Part II - Form Processing -->
            <b class="fullspan">Part II : Form Processing</b>
            $_GET Contents:
            <p>
            <ul>
                <?php
                foreach ($_GET as $key => $value) {
                    echo "<li>[$key] = $value</li>";
                }
                $status .= "+GETData";
                ?>
            </ul>
            </p>

        </div>

        <div class="innerPanel">
            <!-- Part III – Array Generation -->
            <b class="fullspan">Part III : Array Generation</b>
            Array Generated:
            <p>
                <?php
                $nums = GenerateNumbers();
                echo MakeList($nums);
                $status .= "+GenerateNumbers+MakeList+ShowArray";
                ?>
            </p>

        </div>

        <div class="innerPanel">
            <!-- Part IV - Form Processing -->
            <b class="fullspan">Part IV : Form Processing</b>
            <form method="get" action="">
                <label class="right-align">Name:</label>
                <input type="text" name="name" id="nameInput">

                <label class="right-align">Hobby:</label>
                <input type="text" name="hobby" id="hobbyInput">

                <label class="right-align">How Much I like it:</label>
                <input type="range" name="like" value="8" min="1" max="13">

                <input type="submit" value="Go Now !" class="fullspan">
            </form>
        </div>

        <div class="innerPanel">
            <center class="fullspan"><?= $formResult ?></center>
        </div>

        <div class="innerPanel">
            <center class="fullspan">
                Status :
                <?= $status ?>
            </center>
        </div>
       
    </div>


    <footer>
        <p>&copy Copyright 2026 by Dareen Njatou <br>
            Last modified on
            <script>document.write(document.lastModified)</script>
        </p>
    </footer>
</body>

</html>