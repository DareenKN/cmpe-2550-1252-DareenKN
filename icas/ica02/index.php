<!-- CMPE2550 - Web Applications
    Name: Dareen Kinga Njatou
    ICA2 - Tic Tac Toe
    Description: This is a PHP introduction exercise in which I implement PHP basics
                 such as arrays, loops, and functions
    Date: January 12, 2026 -->

<?php
session_start();

// Sanitize POST data
$clean = [];
foreach ($_POST as $key => $value) {
    $clean[trim(strip_tags($key))] = trim(strip_tags($value));
}

$status = "Enter your names below:";
$nameX = $nameO = "";

if (isset($clean["newGame"])) {
    $x = $clean["nameX"] ?? "";
    $o = $clean["nameO"] ?? "";

    if ($x === "" || $o === "") {
        $status = "Names must be at least one character!";
    } else {
        $_SESSION['players'] = ["X" => $x, "O" => $o];
        $nameX = $x;
        $nameO = $o;
        $status = "Game ready — press a cell to begin";
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
        <form method="post" action="index.php">
            <div class="status-panel">
                <div class="status-message">
                    <?php echo "$status" ?>
                </div>

                <div class="name-inputs">
                    <input type="text" name="nameX" placeholder="Player X name" value="<?= $nameX ?>">
                    <input type="text" name="nameO" placeholder="Player O name" value="<?= $nameO ?>">
                </div>

                <div class="controls">
                    <button type="submit" name="newGame" id="newGame">New Game</button>
                    <button type="submit" name="quit">Quit Game</button>
                </div>
            </div>
        </form>

        <hr class="divider">

        <!-- Tic Tac Toe Board -->
        <div class="board">
            <?php
            for ($r = 0; $r < 3; $r++):
                for ($c = 0; $c < 3; $c++): ?>
                    <input class="cell" data-row="<?= $r ?>" data-col="<?= $c ?>" readonly>

                    <?php
                endfor;
            endfor; ?>
        </div>
    </div>

    <footer>
        &copy Copyright 2026 by Dareen Njatou <br>
        Last modified on
        <script>document.write(document.lastModified)</script>
    </footer>
</body>

</html>