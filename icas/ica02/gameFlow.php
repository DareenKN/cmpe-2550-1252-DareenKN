<?php
/* CMPE2550 - Web Applications
 * Name: Dareen Kinga Njatou
 * ICA2 - Tic Tac Toe
 * gameFlow.php
 * Description: Backend logic for Tic Tac Toe game
 * Date: January 20, 2026 */

session_start();
header("Content-Type: application/json");

/* CLEAN INPUT */
$clean = [];
foreach ($_POST as $key => $value) {
    $clean[trim(strip_tags($key))] = trim(strip_tags($value));
}

// Determine action
$action = $clean["action"] ?? "";

/* DEFAULT RESPONSE */
$response = [
    "board" => [],
    "message" => "",
    "gameOver" => false
];

/* ACTION HANDLING */
// Handle init action
if ($action === "init") {

    $p1 = $clean["player1"] ?? "";  // Player X name
    $p2 = $clean["player2"] ?? "";  // Player O name

    // Validate names
    if ($p1 === "" || $p2 === "") {
        $response["message"] = "Names must be at least one character!";
        echo json_encode($response);
        exit;
    }

    $_SESSION["players"] = ["X" => $p1, "O" => $p2];    // Store player names
    $_SESSION["board"] = NewBoard();                    // Initialize new board
    $_SESSION["current"] = "X";                         // X starts first

    $response["board"] = $_SESSION["board"];            // Return initial board
    $response["message"] = "$p1 goes first (X)";        // Initial message
}

// Handle move action
elseif ($action === "move") {
    // Ensure game is initialized
    if (!isset($_SESSION["board"], $_SESSION["current"])) {
        $_SESSION["board"] = NewBoard();    // Initialize new board
        // Chosing a random player to start
        $players = ["X", "O"];              // Available players   
        $_SESSION["current"] = $players[array_rand($players)];  // Randomly select starting player
    }

    $r = intval($clean["row"] ?? -1);   // Row index
    $c = intval($clean["col"] ?? -1);   // Column index

    // Validate move
    if ($r < 0 || $r > 2 || $c < 0 || $c > 2) {
        $response["message"] = "Invalid cell."; // Out of bounds
    } elseif ($_SESSION["board"][$r][$c] != 0) {
        $response["message"] = "Cell already taken.";   // Cell occupied
    } else {
        $mark = $_SESSION["current"];
        $_SESSION["board"][$r][$c] = $mark; // Place the mark

        // Check for win or draw
        $hasAWinner = CheckWin($_SESSION["board"], $mark);
        if ($hasAWinner !== "") {
            $name = $_SESSION["players"][$mark];    // Get winner's name
            $response["message"] = "$name wins! $hasAWinner";   // Win message
            $response["gameOver"] = true;           // Game over
        } elseif (BoardFull($_SESSION["board"])) {
            $response["message"] = "CATS! Board full. It's a Draw."; // Draw message
            $response["gameOver"] = true;                            // Game over    
        } else {
            $_SESSION["current"] = ($mark === "X") ? "O" : "X";     // Switch turn
            $next = $_SESSION["players"][$_SESSION["current"]];     // Next player's name
            $response["message"] = "$next's turn ({$_SESSION["current"]})"; // Next turn message
        }
    }

    $response["board"] = $_SESSION["board"];    // Return updated board
} elseif ($action === "quit") {

    session_unset();
    session_destroy();

    $response["board"] = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];
    $response["message"] = "Game quit. Enter names to start a new game.";
    $response["gameOver"] = true;
}

echo json_encode($response);
die();

/* HELPERS */
function NewBoard()
{
    return [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];
}

/**
 * FunctionName: CheckWin
 * Description: Checks if the given mark has won the game
 */
function CheckWin($b, $m)
{
    for ($i = 0; $i < 3; $i++) {
        if ($b[$i][0] == $m && $b[$i][1] == $m && $b[$i][2] == $m) {
            return "win on row $i"; // Check rows
        }
        if ($b[0][$i] == $m && $b[1][$i] == $m && $b[2][$i] == $m)
            return "win on column $i"; // Check rows
    }

    if ($b[0][0] == $m && $b[1][1] == $m && $b[2][2] == $m)
        return "win on main diagonal";        // Check main diagonal
    if ($b[0][2] == $m && $b[1][1] == $m && $b[2][0] == $m)
        return "wins on anti diagonal";        // Check anti diagonal

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


