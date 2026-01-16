<!-- CMPE2550 - Web Applications
    Name: Dareen Kinga Njatou
    ICA1 - PHP Intro 
    Description: This is a PHP introduction exercise in which I implement PHP basics
                 such as arrays, loops, and functions
    Date: January 12, 2026 -->

<?php
require_once "util.php";    // Include utility functions

// Sanitize GET data
$clean = array();
foreach($_GET as $key => $value) 
    $clean[trim(strip_tags($key))] = trim(strip_tags($value));

$status = "";       // To track which parts were executed
$formResult = "";   // To hold form processing result
$hm = "";           // To build "really" string

/* PART IV : FORM PROCESSING */
// Process form data if Name and Hobby are provided
$name  = "";
$hobby = "";
$howm  = 7;     // Default value for HowMuch
if (
    isset($clean['Name'], $clean['Hobby'], $clean['HowMuch']) &&
    strlen($clean['Name']) > 0 &&
    strlen($clean['Hobby']) > 0
) {
    $name  = $clean['Name'];            // Name from form
    $hobby = $clean['Hobby'];           // Hobby from form
    $howm  = (int) $clean['HowMuch'];   // How much from form

    // Build "really" string based on HowMuch value
    for ($i = 0; $i < $howm; $i++) {
        $hm .= " really";
    }

    // Create form result string
    $formResult = "$name $hm likes $hobby";
    $status .= "+ProcessForm";
    }
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Link for Style Sheet -->
    <link rel="stylesheet" type="text/css" href="css/style.css">

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
            <div>
                <ul>
                    <?php
                    foreach ($clean as $key => $value) {
                        echo "<li>[$key] = $value</li>";
                    }
                    $status .= "+GETData";
                    ?>
                </ul>
            </div>
        </div>

        <div class="innerPanel">
            <!-- Part III – Array Generation -->
            <b class="fullspan">Part III : Array Generation</b>
            Array Generated:
            <div>
                <?php
                $nums = GenerateNumbers();
                echo MakeList($nums);
                $status .= "+GenerateNumbers+MakeList+ShowArray";
                ?>
            </div>
        </div>

        <div class="innerPanel">
            <!-- Part IV - Form Processing -->
            <b class="fullspan">Part IV : Form Processing</b>
            <form method="get" action="" class="fullspan innerPanel">
                <label class="right-align">Name:</label>
                <input type="text" name="Name" value="<?php echo $name?>">

                <label class="right-align">Hobby:</label>
                <input type="text" name="Hobby" value="<?php echo $hobby?>">

                <label class="right-align">How Much I like it:</label>
                <input type="range" name="HowMuch" value="<?php echo $howm ?>" min="1" max="13">

                <input type="submit" name="submit" value="Go Now !" id="submit">
            </form>
        </div>

        <div class="innerPanel">
            <center class="fullspan"><?= $formResult ?></center>
        </div>

        <div class="innerPanel">
            <center class="fullspan">Status :<?= $status ?></center>
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