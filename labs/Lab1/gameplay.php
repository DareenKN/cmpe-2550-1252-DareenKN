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

    case "showValidMoves":
        ShowValidMoves();
        break;

    case "quit":
        QuitGame();
        break;

    default:
        echo json_encode(["message" => "Invalid action"]);
        break;
}

/* ===================================================== */
/* ================= INITIALIZATION ===================== */
/* ===================================================== */

function InitGame()
{
    $p1 = trim($_POST["player1"] ?? "");
    $p2 = trim($_POST["player2"] ?? "");

    if ($p1 == "" || $p2 == "") {
        echo json_encode([
            "board" => [],
            "message" => "Both player names are required."
        ]);
        return;
    }

    $_SESSION["player1"] = htmlspecialchars($p1);
    $_SESSION["player2"] = htmlspecialchars($p2);

    $_SESSION["current"] = rand(1, 2);

    $board = array_fill(0, 8, array_fill(0, 8, 0));

    // Required initial 4 pieces (ICA requirement)
    $board[3][3] = 2;
    $board[3][4] = 1;
    $board[4][3] = 1;
    $board[4][4] = 2;

    $_SESSION["board"] = $board;

    echo json_encode([
        "board" => ConvertBoard($board),
        "message" => CurrentPlayerMessage()
    ]);
}

/* ===================================================== */
/* ====================== MOVE ========================== */
/* ===================================================== */

function ProcessMove()
{
    if (!isset($_SESSION["board"])) {
        echo json_encode(["message" => "Game not initialized."]);
        return;
    }

    $row = intval($_POST["row"] ?? -1);
    $col = intval($_POST["col"] ?? -1);

    $board = $_SESSION["board"];
    $current = $_SESSION["current"];
    $opponent = ($current == 1) ? 2 : 1;

    if (!InBounds($row, $col)) {
        Respond($board, "Invalid cell.");
        return;
    }

    if ($board[$row][$col] != 0) {
        Respond($board, "Cell already occupied.");
        return;
    }

    $validMoves = GetValidMoves($board, $current);

    if (!in_array([$row, $col], $validMoves)) {
        Respond($board, "Invalid move.");
        return;
    }

    // Apply recursive flips in all directions
    $directions = Directions();

    foreach ($directions as [$dr, $dc]) {
        $path = [];
        RecursiveFlip($board, $row, $col, $dr, $dc, $current, $opponent, $path);
    }

    $board[$row][$col] = $current;

    $_SESSION["board"] = $board;
    $_SESSION["current"] = $opponent;

    Respond($board, CurrentPlayerMessage());
}

/* ===================================================== */
/* ================= VALID MOVES ======================== */
/* ===================================================== */

function ShowValidMoves()
{
    if (!isset($_SESSION["board"])) {
        echo json_encode(["validMoves" => []]);
        return;
    }

    $board = $_SESSION["board"];
    $current = $_SESSION["current"];

    $validMoves = GetValidMoves($board, $current);

    echo json_encode([
        "validMoves" => $validMoves
    ]);
}

/* ===================================================== */
/* ================= CORE LOGIC ========================= */
/* ===================================================== */

function GetValidMoves($board, $player)
{
    $opponent = ($player == 1) ? 2 : 1;
    $valid = [];
    $directions = Directions();

    for ($r = 0; $r < 8; $r++) {
        for ($c = 0; $c < 8; $c++) {

            if ($board[$r][$c] != 0)
                continue;

            foreach ($directions as [$dr, $dc]) {
                if (RecursiveCheck($board, $r, $c, $dr, $dc, $player, $opponent, false)) {
                    $valid[] = [$r, $c];
                    break;
                }
            }
        }
    }

    return $valid;
}

/* ===================================================== */
/* =============== RECURSIVE CHECK ====================== */
/* ===================================================== */

function RecursiveCheck($board, $r, $c, $dr, $dc, $current, $opponent, $foundOpponent)
{
    $r += $dr;
    $c += $dc;

    if (!InBounds($r, $c))
        return false;

    if ($board[$r][$c] == $opponent) {
        return RecursiveCheck($board, $r, $c, $dr, $dc, $current, $opponent, true);
    }

    if ($board[$r][$c] == $current && $foundOpponent)
        return true;

    return false;
}

/* ===================================================== */
/* =============== RECURSIVE FLIP ======================= */
/* ===================================================== */

function RecursiveFlip(&$board, $r, $c, $dr, $dc, $current, $opponent, &$path)
{
    $r += $dr;
    $c += $dc;

    if (!InBounds($r, $c))
        return false;

    if ($board[$r][$c] == $opponent) {
        $path[] = [$r, $c];
        return RecursiveFlip($board, $r, $c, $dr, $dc, $current, $opponent, $path);
    }

    if ($board[$r][$c] == $current && count($path) > 0) {
        foreach ($path as [$rr, $cc]) {
            $board[$rr][$cc] = $current;
        }
        return true;
    }

    return false;
}

/* ===================================================== */
/* ================= HELPER METHODS ===================== */
/* ===================================================== */

function Directions()
{
    return [
        [-1,0],[1,0],[0,-1],[0,1],
        [-1,-1],[-1,1],[1,-1],[1,1]
    ];
}

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

function InBounds($r, $c)
{
    return $r >= 0 && $c >= 0 && $r < 8 && $c < 8;
}

function Respond($board, $message)
{
    echo json_encode([
        "board" => ConvertBoard($board),
        "message" => $message
    ]);
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
