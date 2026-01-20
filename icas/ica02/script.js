document.addEventListener("DOMContentLoaded", () => {
    fetch("gameFlow.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "init" })
    })
    .then(r => r.json())
    .then(d => {
        if (d.board) {
            updateBoard(d.board);
        }
    });

    document.querySelectorAll(".cell").forEach(cell => {
        cell.onclick = () => {
            const [r, c] = cell.id.split("_");

            fetch("gameFlow.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "move", row: r, col: c })
            })
            .then(r => r.json())
            .then(d => {
                if (d.board) {
                    updateBoard(d.board);
                }
            });
        };
    });
});

function updateBoard(board) {
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            document.getElementById(`${r}_${c}`).value = board[r][c];
        }
    }
}
