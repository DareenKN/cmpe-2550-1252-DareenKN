<?php
/* CMPE2550 - Web Applications
 * Name: Dareen Kinga Njatou
 * ICA2 - Tic Tac Toe
 * gameFlow.php
 * Description: Backend logic for Tic Tac Toe game
 * Date: January 20, 2026 */

session_start();

// Cleaning data
$clean_get = CleanCollection($_GET);
$clean_post = CleanCollection($_POST);

// Determine action from GET or POST parameters
$action = isset($clean_get["action"]) ? $clean_get["action"] :
    (isset($clean_post["action"]) ? $clean_post["action"] : "");

$output = [
    "board" => [],
    "message" => "",
    "gameOver" => false
];

switch ($action) {
    case "init":
        initGame($clean_post, $output);
        break;
    case "move":
        ProcessMove($clean_post, $output);
        break;
    case "showValidMoves":
        ShowValidMoves();
        break;
    case "quit":
        quitGame($output);
        break;
    default:
        $output["message"] = "Invalid action.";
}
error_log(json_encode($output));
echo json_encode($output);
die();


/**
 * FunctionName:    initGame
 * Description:     Initializes the game session
 * Input:           players names
 * Output:          initial board state and current player message
 */
function initGame($clean_post, &$output)
{
    $p1 = $clean_post["player1"] ?? "";
    $p2 = $clean_post["player2"] ?? "";

    if (!validateNames($p1, $p2, $output))
        return;

    $_SESSION["current"] = rand(1, 2);

    //$board = array_fill(0, 8, array_fill(0, 8, 0));

    $board = [
        ['0', '1', '1', '1', '1', '1', '1', '1'],
        ['1', '1', '2', '2', '0', '2', '1', '1'],
        ['1', '1', '2', '2', '1', '1', '2', '1'],
        ['1', '2', '1', '0', '1', '2', '1', '1'],
        ['1', '1', '1', '1', '2', '0', '2', '1'],
        ['1', '1', '1', '2', '1', '2', '1', '1'],
        ['1', '1', '1', '1', '1', '1', '1', '1'],
        ['0', '2', '2', '2', '0', '2', '2', '2']
    ];


    // Required initial 4 pieces in the center
    $board[3][3] = 2;
    $board[3][4] = 1;
    $board[4][3] = 1;
    $board[4][4] = 2;

    $_SESSION["board"] = $board;

    $output["board"] = ConvertBoard(board: $board);
    $output["message"] = CurrentPlayerMessage();
}


/**
 * FunctionName:    processMove
 * Description:     Validates and processes a player's move
 * Input:           row and column of the move
 * Output:          updated board state and next player's turn message
 */
function ProcessMove($clean_post, &$output)
{
    if (!isset($_SESSION["board"])) {
        $output["message"] = "Game not initialized.";
        return;
    }

    $row = intval($clean_post["row"] ?? -1);
    $col = intval($clean_post["col"] ?? -1);

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

    // If current player has no valid moves, skip turn
    if (empty($validMoves)) {
        $_SESSION["current"] = $opponent;
        $validMovesOpponent = GetValidMoves($board, $opponent);
        if (empty($validMovesOpponent)) {
            $_SESSION["gameOver"] = true;
            $output["gameOver"] = true;
            $message = GetWinner($board, "Game over!");
            respond($board, $message);
            return;
        }
        Respond($board, "No valid moves. Turn skipped. <br>" . CurrentPlayerMessage() . "");
        return;
    }

    // Apply recursive flips in all directions
    $directions = Directions();

    foreach ($directions as [$dr, $dc]) {
        $path = [];
        RecursiveFlip($board, $row, $col, $dr, $dc, $current, $opponent, $path);
    }
    // Apply move
    $board[$row][$col] = $current;

    $_SESSION["board"] = $board;

    // Switch player
    $_SESSION["current"] = $opponent;

    // Check opponent valid moves
    $validMovesOpponent = GetValidMoves($board, $opponent);

    if (empty($validMovesOpponent)) {

        // Check if current player also has no moves
        $validMovesCurrent = GetValidMoves($board, $current);

        if (empty($validMovesCurrent)) {
            $_SESSION["gameOver"] = true;
            $output["gameOver"] = true;
            $message = GetWinner($board, "Game over!");
            Respond($board, $message);
            return;
        }

        // Opponent skips turn
        $_SESSION["current"] = $current;
        Respond($board, "No valid moves for opponent. Turn skipped.<br>" . CurrentPlayerMessage());
        return;
    }

    // Normal turn switch
    $message = CurrentPlayerMessage();
    Respond($board, $message);

}

/**
 * FunctionName:    showValidMoves
 * Description:     Returns valid moves for the current player
 * Input:           none
 * Output:          list of valid moves in row-column format
 */
function ShowValidMoves()
{
    global $output;
    if (!isset($_SESSION["board"])) {
        $output["validMoves"] = [];
        return;
    }

    $board = $_SESSION["board"];
    $current = $_SESSION["current"];

    $validMoves = GetValidMoves($board, $current);

    $output["validMoves"] = $validMoves;
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
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1]
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
            switch ($val) {
                case 1:
                    $display[$r][$c] = "❁";
                    break;
                case 2:
                    $display[$r][$c] = "✪";
                    break;
                default:
                    $display[$r][$c] = "";
            }
        }
    }

    return $display;
}

/**
 * FunctionName: validateNames
 * Description: Validates player names
 */
function validateNames($p1, $p2, &$output)
{
    if ($p1 === "" && $p2 === "") {
        $output["message"] = "Player 1 and Player 2 must enter their names.";
        return false;
    }

    if ($p1 === "") {
        $output["message"] = "Player 1 must enter a name.";
        return false;
    }

    if ($p2 === "") {
        $output["message"] = "Player 2 must enter a name.";
        return false;
    }

    $_SESSION["player1"] = $p1;
    $_SESSION["player2"] = $p2;
    return true;
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
    $mark = ($p == 1) ? "❁" : "✪";
    $name = ($p == 1) ? $_SESSION["player1"] : $_SESSION["player2"];
    return "$name's turn. ($mark)";
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
    global $output;
    $output["message"] = $message;
    $output["board"] = ConvertBoard($board);
}

function GetWinner($board, $message)
{
    $count1 = 0;
    $count2 = 0;
    $mark1 = "❁";
    $mark2 = "✪";

    foreach ($board as $row) {
        foreach ($row as $cell) {
            if ($cell == 1) {
                $count1++;
            } elseif ($cell == 2) {
                $count2++;
            }
        }
    }



    if ($count1 > $count2) {
        return $_SESSION["player1"] . "(" . $mark1 . ")" . " wins!" . " ($count1 to $count2)";
    } elseif ($count2 > $count1) {
        return $_SESSION["player2"] . "(" . $mark2 . ")" . " wins!" . " ($count2 to $count1)";
    } else {
        return "It's a tie!";
    }
}

/**
 * FunctionName:    quitGame
 * Description:     Ends the game session and clears data
 * Input:           none
 * Output:          JSON object confirming game quit and empty board
 */
function QuitGame()
{
    global $output;
    session_unset();
    session_destroy();

    $output["board"] = [];
    $output["message"] = "Game quit.";
}

/**
 * FunctionName:    CleanCollection
 * Description:     Recursively cleans input data to prevent security issues
 * Input:           array of input data (GET or POST)
 * Output:          cleaned array with sanitized keys and values
 */
function CleanCollection($input)
{
    $clean = array();

    foreach ($input as $key => $value) {
        if (is_array($value)) {
            $clean[trim(strip_tags(htmlspecialchars($key)))]
                = CleanCollection($value);
        } else {
            $clean[trim(strip_tags(htmlspecialchars($key)))]
                = trim(strip_tags(htmlspecialchars($value)));
        }
    }

    return $clean;
}.