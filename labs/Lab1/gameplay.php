<?php
/* CMPE2550 - Web Applications
 * Name: Dareen Kinga Njatou
 * ICA2 - Tic Tac Toe
 * gameFlow.php
 * Description: Backend logic for Tic Tac Toe game
 * Date: January 20, 2026 */

session_start();

// Cleaning data
$clean = [];
foreach ($_POST as $key => $value) {
    $clean[trim(strip_tags($key))] = trim(strip_tags($value));
}

// Determine action
$action = $clean["action"] ?? "";

// Default response
$response = [
    "board" => [],
    "message" => "",
    "gameOver" => false
];


// Handle init action
switch ($action) {

    case "init": initGame($clean, $response);   break;
    case "move": handleMove($clean, $response); break;
    case "quit": quitGame($response);                  break;

    default:
        $response["message"] = "Invalid action.";
        $response["board"] = [];
        break;
}

echo json_encode($response);
die();


/**
 * FunctionName: initGame
 * Description: Initializes the game session
 */
function initGame($clean, &$response)
{
    $p1 = $clean["player1"] ?? "";
    $p2 = $clean["player2"] ?? "";

    if (!validateNames($p1, $p2, $response))
        return;

    $_SESSION["players"] = assignPlayers($p1, $p2);
    $_SESSION["board"]   = NewBoard();
    $_SESSION["current"] = "X";

    $response["board"] = $_SESSION["board"];
    $starterName = $_SESSION["players"]["X"];
    $response["message"] = "$starterName goes first (X)";
}

/**
 * FunctionName: handleMove
 * Description: Processes a player's move
 */
function handleMove($clean, &$response)
{
    if (!isset($_SESSION["board"], $_SESSION["current"], $_SESSION["players"])) {
        $response["message"] = "Game not initialized. Please start a new game.";
        $response["board"] = [];
        return;
    }

    $r = intval($clean["row"] ?? -1);
    $c = intval($clean["col"] ?? -1);

    if ($r < 0 || $r > 7 || $c < 0 || $c > 7) {
        $response["message"] = "Invalid cell.";
    }
    elseif ($_SESSION["board"][$r][$c] != 0) {
        $response["message"] = "Cell already taken.";
    }
    else {
        $mark = $_SESSION["current"];
        $_SESSION["board"][$r][$c] = $mark;

        $hasAWinner = CheckWin($_SESSION["board"], $mark);

        if ($hasAWinner !== "") {
            $name = $_SESSION["players"][$mark];
            $response["message"] = "$name wins with $mark" . "s on the $hasAWinner!";
            $response["gameOver"] = true;
        }
        elseif (BoardFull($_SESSION["board"])) {
            $response["message"] = "CATS! (means board full. No winner)";
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

/**
 * FunctionName: quitGame
 * Description: Handles quitting the game
 */
function quitGame(&$response)
{
    session_unset();
    session_destroy();

    $response["board"] = NewBoard();
    $response["message"] = "Game quit. Enter names to start a new game.";
    $response["gameOver"] = true;
}


/**
 * FunctionName: assignPlayers
 * Description: Randomly assigns X and O to players
 */
function assignPlayers($p1, $p2)
{
    $marks = ["X", "O"];
    shuffle($marks);

    return [
        $marks[0] => $p1,
        $marks[1] => $p2
    ];
}

/**
 * FunctionName: NewBoard
 * Description:  Initializes a new board
 */
function NewBoard($size = 8)
{
    $board = [];

    for ($r = 0; $r < $size; $r++) {
        $row = [];

        for ($c = 0; $c < $size; $c++) 
            $row[] = 0;        

        $board[] = $row;
    }

    return $board;
}



/**
 * FunctionName: validateNames
 * Description: Validates player names
 */
function validateNames($p1, $p2, &$response)
{
    if ($p1 === "" && $p2 === "") {
        $response["message"] = "Player 1 and Player 2 must enter their names.";
        return false;
    }

    if ($p1 === "") {
        $response["message"] = "Player 1 must enter a name.";
        return false;
    }

    if ($p2 === "") {
        $response["message"] = "Player 2 must enter a name.";
        return false;
    }

    return true;
}

/**
 * FunctionName:    CheckWin
 * Description:     Checks if the given mark has won the game
 */
function CheckWin($b, $m)
{
    $rowNames = ["top", "middle", "bottom"];
    $colNames = ["left", "center", "right"];

    for ($i = 0; $i < 3; $i++) {

        // Check rows
        if ($b[$i][0] == $m && $b[$i][1] == $m && $b[$i][2] == $m)
            return "{$rowNames[$i]} row";

        // Check columns
        if ($b[0][$i] == $m && $b[1][$i] == $m && $b[2][$i] == $m)
            return "{$colNames[$i]} column";

    }

    // Diagonals
    if ($b[0][0] == $m && $b[1][1] == $m && $b[2][2] == $m)
        return "main diagonal";
    if ($b[0][2] == $m && $b[1][1] == $m && $b[2][0] == $m)
        return "anti-diagonal";

    return "";
}

/**
 * FunctionName: BoardFull
 * Description: Checks if the board is full (no empty cells)
 */
function BoardFull($b)
{
    foreach ($b as $row)
        foreach ($row as $cell)
            if ($cell == 0)
                return false;
    return true;
}


