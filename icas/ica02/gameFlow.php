<?php
session_start();
header("Content-Type: application/json");

/* ---------- CLEAN INPUT ---------- */
$clean = [];
foreach ($_POST as $key => $value) {
    $clean[trim(strip_tags($key))] = trim(strip_tags($value));
}

$action = $clean["action"] ?? "";

/* ---------- DEFAULT RESPONSE ---------- */
$response = [
    "board" => [],
    "message" => "",
    "gameOver" => false
];

/* ---------- HELPERS ---------- */
function NewBoard() {
    return [
        [0,0,0],
        [0,0,0],
        [0,0,0]
    ];
}

function CheckWin($b, $m) {
    for ($i = 0; $i < 3; $i++) {
        if ($b[$i][0] == $m && $b[$i][1] == $m && $b[$i][2] == $m) return true;
        if ($b[0][$i] == $m && $b[1][$i] == $m && $b[2][$i] == $m) return true;
    }

    if ($b[0][0] == $m && $b[1][1] == $m && $b[2][2] == $m) return true;
    if ($b[0][2] == $m && $b[1][1] == $m && $b[2][0] == $m) return true;

    return false;
}

function BoardFull($b) {
    foreach ($b as $row)
        foreach ($row as $cell)
            if ($cell == 0) return false;
    return true;
}

/* ---------- ACTION HANDLING ---------- */
if ($action === "init") {

    $p1 = $clean["player1"] ?? "";
    $p2 = $clean["player2"] ?? "";

    if ($p1 === "" || $p2 === "") {
        $response["message"] = "Names must be at least one character!";
        echo json_encode($response);
        exit;
    }

    $_SESSION["players"] = ["X" => $p1, "O" => $p2];
    $_SESSION["board"] = NewBoard();
    $_SESSION["current"] = "X";

    $response["board"] = $_SESSION["board"];
    $response["message"] = "$p1 goes first (X)";
}

elseif ($action === "move") {

    if (!isset($_SESSION["board"], $_SESSION["current"])) {
        $_SESSION["board"] = NewBoard();
        $_SESSION["current"] = "X";
    }

    $r = intval($clean["row"] ?? -1);
    $c = intval($clean["col"] ?? -1);

    if ($r < 0 || $r > 2 || $c < 0 || $c > 2) {
        $response["message"] = "Invalid cell.";
    }
    elseif ($_SESSION["board"][$r][$c] != 0) {
        $response["message"] = "Cell already taken.";
    }
    else {
        $mark = $_SESSION["current"];
        $_SESSION["board"][$r][$c] = $mark;

        if (CheckWin($_SESSION["board"], $mark)) {
            $name = $_SESSION["players"][$mark];
            $response["message"] = "$name wins!";
            $response["gameOver"] = true;
        }
        elseif (BoardFull($_SESSION["board"])) {
            $response["message"] = "CATS! Board full.";
            $response["gameOver"] = true;
        }
        else {
            $_SESSION["current"] = ($mark === "X") ? "O" : "X";
            $next = $_SESSION["players"][$_SESSION["current"]];
            $response["message"] = "$next's turn ({$_SESSION["current"]})";
        }
    }

    $response["board"] = $_SESSION["board"];
}

echo json_encode($response);
