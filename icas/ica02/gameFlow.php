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

if (($clean['action'] ?? '') === 'init') {
    $_SESSION['board'] = array_fill(0, 3, array_fill(0, 3, ""));
    $return['board'] = $_SESSION['board'];
}

if (($clean['action'] ?? '') === 'move') {
    $r = (int) $clean['row'];
    $c = (int) $clean['col'];

    if ($_SESSION['board'][$r][$c] === "") {
        $_SESSION['board'][$r][$c] = "X";
        $return['board'] = $_SESSION['board'];
    }
}

echo json_encode($return);
