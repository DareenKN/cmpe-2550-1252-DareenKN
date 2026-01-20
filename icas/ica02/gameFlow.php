<?php
/* CMPE2550 - Web Applications
 * Name: Dareen Kinga Njatou
 * ICA2 - Tic Tac Toe - gameFlow.php
 * Description: Utility functions for ICA02
 * Date: January 20, 2026 
 * gameFlow.php
 */

session_start();

$data = json_decode(file_get_contents("php://input"), true);

$clean = [];
foreach ($data ?? [] as $k => $v) {
    $clean[$k] = is_string($v) ? trim(strip_tags($v)) : $v;
}

$return = [];

if (($clean['action'] ?? '') === 'move') {
    $r = (int) ($clean['row'] ?? -1);
    $c = (int) ($clean['col'] ?? -1);

    if ($r >= 0 && $r <= 2 && $c >= 0 && $c <= 2) {
        if ($_SESSION['board'][$r][$c] === "") {

            $mark = $_SESSION['turn'];
            $_SESSION['board'][$r][$c] = $mark;

            // switch turn
            $_SESSION['turn'] = ($mark === "X") ? "O" : "X";

            $return['board'] = $_SESSION['board'];
            $return['message'] = "$mark placed at $r,$c";
        }
    }
}

if (isset($_SESSION['board'])) {
    $return['board'] = $_SESSION['board'];
}

echo json_encode($return);

