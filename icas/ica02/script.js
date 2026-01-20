document.addEventListener("DOMContentLoaded", () => {
    initGame();
    wireCells();
});

/* ---------- INIT GAME ---------- */
function initGame() {
    fetch("gameFlow.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "init" })
    })
        .then(res => res.json())
        .then(data => {
            if (data.board) {
                updateBoard(data.board);
            }
            if (data.message) {
                updateStatus(data.message);
            }
        });
}

/* ---------- CELL CLICK ---------- */
function wireCells() {
    document.querySelectorAll(".cell").forEach(cell => {
        cell.addEventListener("click", () => {
            let parts = cell.id.split("_");
            let row = parts[0];
            let col = parts[1];

            makeMove(row, col);
        });
    });
}

/* ---------- SEND MOVE ---------- */
function makeMove(row, col) {
    fetch("gameFlow.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            action: "move",
            row: row,
            col: col
        })
    })
        .then(res => res.json())
        .then(data => {
            if (data.board) {
                updateBoard(data.board);
            }
            if (data.message) {
                updateStatus(data.message);
            }
        });
}

/* ---------- UPDATE UI ---------- */
function updateBoard(board) {
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            document.getElementById(`${r}_${c}`).value = board[r][c];
        }
    }
}

function updateStatus(msg) {
    document.querySelector(".status-message").innerText = msg;
}
