<!-- CMPE2550 - Web Applications
    Name: Dareen Kinga Njatou
    ICA2 - Tic Tac Toe
    Description: This is a PHP introduction exercise in which I implement PHP basics
                 such as arrays, loops, and functions
    Date: January 12, 2026 -->

<?php
session_start();

// Sanitize GET data
$clean = array();
foreach ($_POST as $key => $value)
    $clean[trim(strip_tags($key))] = trim(strip_tags($value));

$status = "Enter your names below:";
$nameX = $nameO = "";

if (isset($_SESSION['players'])) {
    [$nameX, $nameO] = $_SESSION['players'];
}

if (isset($clean['newGame'])) {
    if ($clean['nameX'] === "" || $clean['nameO'] === "") {
        $status = "Names must be at least one character!";
    } else {
        $_SESSION['players'] = [$clean['nameX'], $clean['nameO']];
        $status = "{$clean['nameX']} will go first (X)";
    }
}

if (isset($clean['quit'])) {
    session_unset();
    session_destroy();
    header("Location: index.php");
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CMPE2550 - Assignment 02 - Tic Tac Toe</title>

    <link rel="stylesheet" href="css/style.css" />

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script defer src="script.js"></script>
</head>

<body>
    <!-- Header -->
    <div class="header">
        CMPE2550 - Assignment 02 - Tic Tac Toe
    </div>

    <!-- Main Container -->
    <div class="outer-container">

        <!-- Status Panel -->
        <form method="post">
            <div class="status-panel">
                <div class="status-message">
                    <?php echo "$status" ?>
                </div>

                <div class="name-inputs">
                    <input type="text" name="nameX" value="<?= $nameX ?>">
                    <input type="text" name="nameO" value="<?= $nameO ?>">
                </div>

                <div class="controls">
                    <button type="submit" name="newGame">New Game</button>
                    <button type="submit" name="quit">Quit Game</button>
                </div>
            </div>
        </form>


        <hr class="divider">

        <!-- Tic Tac Toe Board -->
        <div class="board">
            <!-- 3x3 readonly inputs (50x50) -->
            <input class="cell" id="0_0" type="text" readonly />
            <input class="cell" id="0_1" type="text" readonly />
            <input class="cell" id="0_2" type="text" readonly />

            <input class="cell" id="1_0" type="text" readonly />
            <input class="cell" id="1_1" type="text" readonly />
            <input class="cell" id="1_2" type="text" readonly />

            <input class="cell" id="2_0" type="text" readonly />
            <input class="cell" id="2_1" type="text" readonly />
            <input class="cell" id="2_2" type="text" readonly />

        </div>
    </div>

    <footer>
        &copy Copyright 2026 by Dareen Njatou <br>
        Last modified on
        <script>document.write(document.lastModified)</script>
    </footer>
    </main>
</body>

</html>