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

switch ($action) {

    case "init": InitGame();    break;
    case "move": ProcessMove(); break;
    case "quit": QuitGame();    break;

    case "showValidMoves": ShowValidMoves(); break;

    default:
        echo json_encode(["message" => "Invalid action"]);
        break;
}


/**
 * FunctionName:    initGame
 * Description:     Initializes the game session
 * Input:           players names
 * Output:          initial board state and current player message
 */
function InitGame()
{
    $p1 = $clean["player1"] ?? "";
    $p2 = $clean["player2"] ?? "";

    if ($p1 == "" || $p2 == "") {
        echo json_encode([
            "board" => [],
            "message" => "Both player names are required."
        ]);
        return;
    }

    $_SESSION["player1"] = $p1;
    $_SESSION["player2"] = $p2;

    $_SESSION["current"] = rand(1, 2);

    $board = array_fill(0, 8, array_fill(0, 8, 0));

    // Required initial 4 pieces in the center
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

/**
 * FunctionName:    processMove
 * Description:     Validates and processes a player's move
 * Input:           row and column of the move
 * Output:          updated board state and next player's turn message
 */
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

/**
 * FunctionName:    showValidMoves
 * Description:     Returns valid moves for the current player
 * Input:           none
 * Output:          list of valid moves in row-column format
 */
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

/**
 * FunctionName:    getValidMoves
 * Description:     Computes valid moves for a given board and player
 * Input:           board state and player number
 * Output:          list of valid moves in row-column format
 */
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

/**
 * FunctionName:    recursiveCheck
 * Description:     Recursively checks if a move is valid in a given direction
 * Input:           board state, starting row and column, direction deltas, current player, opponent player, flag for found opponent
 * Output:          true if valid move found, false otherwise
 */
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

/**
 * FunctionName:    recursiveFlip
 * Description:     Recursively flips opponent pieces in a given direction
 * Input:           board state, starting row and column, direction deltas, current player, opponent player, path of pieces to flip
 * Output:          true if pieces flipped, false otherwise
 */
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

/**
 * FunctionName:    directions
 * Description:     Returns all 8 possible directions for move checking
 * Input:           none
 * Output:          list of direction deltas for row and column
 */
function Directions()
{
    return [
        [-1,0],[1,0],[0,-1],[0,1],
        [-1,-1],[-1,1],[1,-1],[1,1]
    ];
}

/**
 * FunctionName:    convertBoard
 * Description:     Converts internal board representation to display format
 * Input:           board state with numeric values
 * Output:          board state with symbols for display
 */
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

/**
 * FunctionName:    currentPlayerMessage
 * Description:     Returns a message indicating whose turn it is
 * Input:           none
 * Output:          string message with current player's name
 */
function CurrentPlayerMessage()
{
    $p = $_SESSION["current"];
    $name = ($p == 1) ? $_SESSION["player1"] : $_SESSION["player2"];
    return "$name's turn.";
}

/**
 * FunctionName:    inBounds
 * Description:     Checks if given row and column are within board limits
 * Input:           row and column indices
 * Output:          true if within bounds, false otherwise
 */
function InBounds($r, $c)
{
    return $r >= 0 && $c >= 0 && $r < 8 && $c < 8;
}

/**
 * FunctionName:    respond
 * Description:     Sends a JSON response with the current board and message
 * Input:           board state and message string
 * Output:          JSON object with board and message 
 */
function Respond($board, $message)
{
    echo json_encode([
        "board" => ConvertBoard($board),
        "message" => $message
    ]);
}

/**
 * FunctionName:    quitGame
 * Description:     Ends the game session and clears data
 * Input:           none
 * Output:          JSON object confirming game quit and empty board
 */
function QuitGame()
{
    session_unset();
    session_destroy();

    echo json_encode([
        "board" => [],
        "message" => "Game quit."
    ]);
}
