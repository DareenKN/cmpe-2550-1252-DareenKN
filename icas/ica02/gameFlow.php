<?php
/* CMPE2550 - Web Applications
 * Name: Dareen Kinga Njatou
 * ICA2 - Tic Tac Toe - gameFlow.php
 * Description: Utility functions for ICA02
 * Date: January 20, 2026 
 * gameFlow.php
 */

session_start();

/*
    gameFlow.php
    Handles ALL game logic.
    Client only sends row + col.
*/

// Read JSON sent from JS
$data = json_decode(file_get_contents("php://input"), true);

// Sanitize incoming data
$clean = [];
if (is_array($data)) {
    foreach ($data as $key => $value) {
        if (is_string($value)) {
            $clean[trim(strip_tags($key))] = trim(strip_tags($value));
        } else {
            $clean[$key] = $value; // numbers (row, col)
        }
    }
}

$return = [];

/* ---------- INIT GAME ---------- */
if ($clean['action'] ?? "" === "init") {

    // Create empty 3x3 board
    $_SESSION['board'] = array_fill(0, 3, array_fill(0, 3, ""));

    // X always starts for now
    $_SESSION['turn'] = "X";

    $return['board'] = $_SESSION['board'];
    $return['message'] = "Game initialized. X starts.";
}

/* ---------- PLACE MARK ---------- */
if ($clean['action'] ?? "" === "move") {

    $row = (int) ($clean['row'] ?? -1);
    $col = (int) ($clean['col'] ?? -1);

    // Validate coordinates
    if ($row < 0 || $row > 2 || $col < 0 || $col > 2) {
        $return['message'] = "Invalid move.";
    }
    // Cell already taken
    elseif ($_SESSION['board'][$row][$col] !== "") {
        $return['message'] = "Cell already used.";
    } else {
        // Place X (for now)
        $_SESSION['board'][$row][$col] = "X";
        $return['board'] = $_SESSION['board'];
        $return['message'] = "X placed at $row,$col";
    }
}

echo json_encode($return);

