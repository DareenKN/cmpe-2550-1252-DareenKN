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

    case "init":
        initGame($clean, $response);
        break;
    case "move":
        handleMove($clean, $response);
        break;
    case "showValidMoves":
        showValidMoves($clean, $response);
        break;
    case "quit":
        quitGame($response);
        break;

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
    $_SESSION["board"] = NewBoard(8);
    $_SESSION["current"] = array_key_first($_SESSION["players"]);

    $starter = $_SESSION["players"][$_SESSION["current"]];
    $response["board"] = $_SESSION["board"];
    $response["message"] = "$starter plays first (" . $_SESSION["current"] . ").";
}

/**
 * FunctionName: showValidMoves
 * Description: Shows valid moves for the current player
 */
function showValidMoves($clean, &$response)
{
    $r = intval($clean["row"] ?? -1);
    $c = intval($clean["col"] ?? -1);


    $_SESSION["validMoves"] = getValidMoves($_SESSION["board"], $_SESSION["current"]);
    $response["validMoves"] = $_SESSION["validMoves"];
    if (!(empty($_SESSION["validMoves"]))) {
        if ($r >= 0 && $c >= 0) {
            if (in_array([$r, $c], $_SESSION["validMoves"])) {
                $response["valid"] = true;
            } else {
                $response["valid"] = false;
            }
        }
    }
    if (empty($_SESSION["validMoves"])) {
        $response["gameOver"] = true;
        handleMove($clean, $response);
    }
}

/**
 * FunctionName:    getValidMoves
 * Description:     Gets valid moves for the current player
 * Inputs:          board, player
 * Outputs:         array of valid moves (row, col)
 * Logic:           For each empty cell, temporarily apply the move and check if it flips any
 *                  opponent pieces. If it does, add to valid moves list.    
 */
function getValidMoves($board, $player)
{
    $opponent = ($player === "❁") ? "✪" : "❁";
    $validMoves = [];

    if (BoardFull($board)) {
        $_SESSION["gameOver"] = true;
        return $validMoves; // No valid moves if board is full
    }

    for ($r = 0; $r < count($board); $r++) {
        for ($c = 0; $c < count($board[$r]); $c++) {
            if ($board[$r][$c] == 0) {
                // Temporarily apply move to check validity
                $tempBoard = $board;
                if (applyMove($tempBoard, $r, $c, $player, $opponent)) {
                    $validMoves[] = [$r, $c];
                }
            }
        }
    }

    return $validMoves;
}

/**
 * FunctionName: handleMove
 * Description: Processes a player's move
 */
function handleMove($clean, &$response)
{
    if (!isset($_SESSION["board"], $_SESSION["current"], $_SESSION["players"])) {
        $response["message"] = "Game not initialized. Start a new game.";
        return;
    }

    $r = intval($clean["row"] ?? -1);
    $c = intval($clean["col"] ?? -1);

    $player   = $_SESSION["current"];
    $opponent = ($player === "❁") ? "✪" : "❁";
    $playerName = $_SESSION["players"][$player];

    $response["board"] = $_SESSION["board"];

    if (!inBounds($r, $c)) {
        $response["message"] = "$playerName's turn ({$player}).<br>Invalid cell.";
        return;
    }

    if ($_SESSION["board"][$r][$c] !== 0) {
        $response["message"] = "$playerName's turn ({$player}).<br>Cell already occupied.";
        return;
    }

    $validMoves = getValidMoves($_SESSION["board"], $player);

    if (empty($validMoves)) {
        // Player cannot move → check game result
        $result = CheckWin($_SESSION["board"], $player, $opponent);

        if ($result === "win") {
            $response["message"] = "{$playerName} wins!";
        } elseif ($result === "lose") {
            $response["message"] = $_SESSION["players"][$opponent] . " wins!";
        } else {
            $response["message"] = "It's a draw!";
        }

        $response["gameOver"] = true;
        return;
    }

    // ─────────────────────────────────────────────
    // 3️⃣ Validate move (must flip something)
    // ─────────────────────────────────────────────
    $didFlip = applyMove($_SESSION["board"], $r, $c, $player, $opponent);

    if (!$didFlip) {
        $response["message"] = "$playerName's turn ({$player}).<br>Invalid move.";
        return;
    }

    // Place the piece AFTER flipping
    $_SESSION["board"][$r][$c] = $player;

    // ─────────────────────────────────────────────
    // 4️⃣ Switch turn
    // ─────────────────────────────────────────────
    $_SESSION["current"] = $opponent;
    $nextName = $_SESSION["players"][$opponent];

    $response["board"] = $_SESSION["board"];
    $response["message"] = "$nextName's turn ({$opponent}).";
}


/**
 * FunctionName: quitGame
 * Description: Handles quitting the game
 */
function quitGame(&$response)
{
    session_unset();
    session_destroy();

    $response["board"] = NewBoard(8);
    $response["message"] = "Game quit. Enter names to start a new game.";
    $response["gameOver"] = true;
}


/**
 * FunctionName: assignPlayers
 * Description: Randomly assigns X and O to players
 */
function assignPlayers($p1, $p2)
{
    $marks = ["❁", "✪"];
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
function NewBoard($size)
{
    $board = [];

    for ($r = 0; $r < $size; $r++) {
        for ($c = 0; $c < $size; $c++) {
            $board[$r][$c] = 0;
        }
    }

    $mid = $size / 2;
    $board[$mid - 1][$mid - 1] = "✪";
    $board[$mid - 1][$mid] = "❁";
    $board[$mid][$mid - 1] = "❁";
    $board[$mid][$mid] = "✪";

    return $board;
}

/**
 * FunctionName: inBounds
 * Description:  Checks if the cell chossen is in the bounds
 */
function inBounds($r, $c, $size = 8)
{
    return $r >= 0 && $c >= 0 && $r < $size && $c < $size;
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
 * FunctionName:    applyMove
 * Description:     Checks if the board is full (no empty cells)
 * Inputs:          board, row, column, current player, opponent
 * Outputs:         true if move is valid and pieces flipped, false otherwise
 * Logic:           For each of the 8 directions, check for opponent pieces 
 *                  followed by a player piece. If found, flip all opponent 
 *                  pieces in that direction. Return true if any pieces flipped.
 */
function applyMove(&$board, $r, $c, $player, $opponent)
{
    $directions = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1]
    ];

    $valid = false;

    foreach ($directions as [$dr, $dc]) {

        // Store all the valid moves in this direction
        $_SESSION["validMoves"] = [];

        $path = [];
        $rr = $r + $dr;
        $cc = $c + $dc;

        while (inBounds($rr, $cc) && $board[$rr][$cc] === $opponent) {
            $_SESSION["validMoves"][] = [$rr, $cc];
            $path[] = [$rr, $cc];
            $rr += $dr;
            $cc += $dc;
        }

        if (inBounds($rr, $cc) && $board[$rr][$cc] === $player && count($path) > 0) {

            foreach ($path as [$fr, $fc]) {
                $board[$fr][$fc] = $player;
            }
            $valid = true;

        }
    }

    return $valid;
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

/**
 * FuctionName: CheckWin
 * Description: Checks if a player has won by counting pieces. If a player has more pieces than the opponent, they win.
 * Inputs: board, player, opponent
 * Outputs: "win" if player wins, "lose" if opponent wins, "draw" if tie, "continue" if game should continue
 */
function CheckWin($board, $player, $opponent)
{
    $playerCount = 0;
    $opponentCount = 0;

    foreach ($board as $row) {
        foreach ($row as $cell) {
            if ($cell === $player) {
                $playerCount++;
            } elseif ($cell === $opponent) {
                $opponentCount++;
            }
        }
    }

    if ($playerCount > $opponentCount) {
        return "win";
    } elseif ($opponentCount > $playerCount) {
        return "lose";
    } else if ($playerCount === $opponentCount && BoardFull($board)) {
        return "draw";
    } else {
        return "continue";
    }
}