<?php
session_start();
header("Content-Type: application/json");

$action = $_POST["action"] ?? "";

switch ($action) {

    case "init":
        InitGame();
        break;

    case "move":
        ProcessMove();
        break;

    case "quit":
        QuitGame();
        break;

    default:
        echo json_encode(["message" => "Invalid action"]);
        break;
}

/* ============================= */

function InitGame()
{
    $p1 = trim($_POST["player1"] ?? "");
    $p2 = trim($_POST["player2"] ?? "");

    if ($p1 == "" || $p2 == "") {
        echo json_encode([
            "board" => [],
            "message" => "Names must be at least one character!"
        ]);
        return;
    }

    $_SESSION["player1"] = htmlspecialchars($p1);
    $_SESSION["player2"] = htmlspecialchars($p2);

    // Random first player
    $_SESSION["current"] = rand(1, 2);

    $board = [];

    for ($r = 0; $r < 8; $r++) {
        for ($c = 0; $c < 8; $c++) {
            $board[$r][$c] = 0;
        }
    }

    // Initial 4 stones (required pattern from PDF page 3)
    $board[3][3] = 2;
    $board[3][4] = 1;
    $board[4][3] = 1;
    $board[4][4] = 2;

    $_SESSION["board"] = json_encode($board);

    echo json_encode([
        "board" => ConvertBoard($board),
        "message" => CurrentPlayerMessage()
    ]);
}

/* ============================= */

function ProcessMove()
{
    if (!isset($_SESSION["board"])) {
        echo json_encode(["message" => "No game in progress"]);
        return;
    }

    $row = intval($_POST["row"]);
    $col = intval($_POST["col"]);

    $board = json_decode($_SESSION["board"], true);
    $current = $_SESSION["current"];
    $opponent = ($current == 1) ? 2 : 1;

    if ($board[$row][$col] != 0) {
        echo json_encode([
            "board" => ConvertBoard($board),
            "message" => "Invalid move!"
        ]);
        return;
    }

    $flippedAny = false;

    $directions = [
        [-1,0],[1,0],[0,-1],[0,1],
        [-1,-1],[-1,1],[1,-1],[1,1]
    ];

    foreach ($directions as $dir) {
        $flipped = FlipDirection($board, $row, $col, $dir[0], $dir[1], $current, $opponent);
        if ($flipped) $flippedAny = true;
    }

    if ($flippedAny) {
        $board[$row][$col] = $current;
        $_SESSION["current"] = $opponent;
    }

    $_SESSION["board"] = json_encode($board);

    echo json_encode([
        "board" => ConvertBoard($board),
        "message" => CurrentPlayerMessage()
    ]);
}

/* ============================= */

function FlipDirection(&$board, $r, $c, $dr, $dc, $current, $opponent)
{
    $r += $dr;
    $c += $dc;

    $stones = [];

    while ($r >= 0 && $r < 8 && $c >= 0 && $c < 8) {

        if ($board[$r][$c] == $opponent) {
            $stones[] = [$r, $c];
        }
        elseif ($board[$r][$c] == $current) {
            foreach ($stones as $s) {
                $board[$s[0]][$s[1]] = $current;
            }
            return count($stones) > 0;
        }
        else {
            break;
        }

        $r += $dr;
        $c += $dc;
    }

    return false;
}

/* ============================= */

function ConvertBoard($board)
{
    $display = [];

    foreach ($board as $r => $row) {
        foreach ($row as $c => $val) {
            if ($val == 1) $display[$r][$c] = "❁";
            elseif ($val == 2) $display[$r][$c] = "✪";
            else $display[$r][$c] = "";
        }
    }

    return $display;
}

function CurrentPlayerMessage()
{
    $p = $_SESSION["current"];
    $name = ($p == 1) ? $_SESSION["player1"] : $_SESSION["player2"];
    return "$name's turn.";
}

function QuitGame()
{
    session_unset();
    session_destroy();

    echo json_encode([
        "board" => [],
        "message" => "Game quit."
    ]);
}
