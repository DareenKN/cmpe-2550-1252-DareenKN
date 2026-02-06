<?php
session_start();
header("Content-Type: application/json");

$output = [
    "message" => "",
    "board" => [],
    "gameOver" => false
];

$action = $_POST["action"] ?? "";

/* =========================
   Helpers
========================= */

function emptyBoard($size = 8) {
    $board = [];
    for ($r = 0; $r < $size; $r++) {
        for ($c = 0; $c < $size; $c++) {
            $board[$r][$c] = 0;
        }
    }
    return $board;
}

function inBounds($r, $c, $size = 8) {
    return $r >= 0 && $c >= 0 && $r < $size && $c < $size;
}

/* =========================
   INIT GAME
========================= */

if ($action === "init") {

    $p1 = trim($_POST["player1"] ?? "");
    $p2 = trim($_POST["player2"] ?? "");

    if ($p1 === "" || $p2 === "") {
        $output["message"] = "Both player names are required.";
        echo json_encode($output);
        exit;
    }

    $board = emptyBoard();

    // Initial 4 stones
    $board[3][3] = 2;
    $board[3][4] = 1;
    $board[4][3] = 1;
    $board[4][4] = 2;

    $_SESSION["board"] = $board;
    $_SESSION["players"] = [$p1, $p2];
    $_SESSION["turn"] = rand(1, 2);

    $who = $_SESSION["players"][$_SESSION["turn"] - 1];
    $stone = $_SESSION["turn"] === 1 ? "❁" : "✪";

    $output["board"] = $board;
    $output["message"] = "$who plays first with the $stone stones.";

    echo json_encode($output);
    exit;
}

/* =========================
   PROCESS MOVE
========================= */

if ($action === "move") {

    if (!isset($_SESSION["board"])) {
        $output["message"] = "Game not initialized.";
        echo json_encode($output);
        exit;
    }

    $r = intval($_POST["row"]);
    $c = intval($_POST["col"]);

    $board = $_SESSION["board"];
    $player = $_SESSION["turn"];
    $opponent = $player === 1 ? 2 : 1;

    if ($board[$r][$c] !== 0) {
        $output["board"] = $board;
        $output["message"] = "Invalid move.";
        echo json_encode($output);
        exit;
    }

    $directions = [
        [-1, 0], [1, 0], [0, -1], [0, 1],
        [-1, -1], [-1, 1], [1, -1], [1, 1]
    ];

    $flipped = false;

    foreach ($directions as [$dr, $dc]) {
        $path = [];
        $rr = $r + $dr;
        $cc = $c + $dc;

        while (inBounds($rr, $cc) && $board[$rr][$cc] === $opponent) {
            $path[] = [$rr, $cc];
            $rr += $dr;
            $cc += $dc;
        }

        if (inBounds($rr, $cc) && $board[$rr][$cc] === $player && count($path) > 0) {
            foreach ($path as [$fr, $fc]) {
                $board[$fr][$fc] = $player;
            }
            $flipped = true;
        }
    }

    if (!$flipped) {
        $output["board"] = $board;
        $output["message"] = "Invalid move.";
        echo json_encode($output);
        exit;
    }

    $board[$r][$c] = $player;
    $_SESSION["board"] = $board;

    $_SESSION["turn"] = $opponent;

    $name = $_SESSION["players"][$_SESSION["turn"] - 1];
    $stone = $_SESSION["turn"] === 1 ? "❁" : "✪";

    $output["board"] = $board;
    $output["message"] = "$name's turn with the $stone stones.";

    echo json_encode($output);
    exit;
}

/* =========================
   QUIT GAME
========================= */

if ($action === "quit") {
    session_unset();
    session_destroy();

    $output["gameOver"] = true;
    $output["message"] = "Game quit. Enter names to start a new game.";
    echo json_encode($output);
    exit;
}

/* =========================
   FALLBACK
========================= */

$output["message"] = "Invalid action.";
echo json_encode($output);
