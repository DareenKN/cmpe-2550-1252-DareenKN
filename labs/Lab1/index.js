let gameOver = false;
const BOARD_SIZE = 8;

$(document).ready(function () {

    CreateBoard(BOARD_SIZE);
    $('.board').addClass('locked');
    $('#game-area').hide();

    $('#newGame').click(StartGame);
    $('#quit').click(QuitGame);

    $(document).on('click', '.cell', CellClicked);

    // Highlight valid moves when mouse enters board
    $('#board').mouseenter(HighlightValidMoves);
});

/* ===================================================== */

function CreateBoard(size) {

    const board = $('#board');
    board.empty();

    $('.board').css("grid-template-columns", `repeat(${size}, 60px)`);
    $('.board').css("grid-template-rows", `repeat(${size}, 60px)`);

    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {

            const cell = $('<input>', {
                class: 'cell',
                readonly: true
            });

            cell.attr('data-row', r);
            cell.attr('data-col', c);

            board.append(cell);
        }
    }
}

/* ===================================================== */

function StartGame() {

    let data = {
        action: "init",
        player1: $('input[name="Player1"]').val(),
        player2: $('input[name="Player2"]').val()
    };

    CallAJAX("gameplay.php", "post", data, "json",
        GameInitSuccess, ErrorMethod);
}

/* ===================================================== */

function CellClicked() {

    if (gameOver) return;

    // Prevent clicking non-highlighted cells
    if (!$(this).hasClass("valid-move")) {
        UpdateStatus("Invalid move.");
        return;
    }

    let data = {
        action: "move",
        row: $(this).data("row"),
        col: $(this).data("col")
    };

    CallAJAX("gameplay.php", "post", data, "json",
        GameSuccess, ErrorMethod);
}

/* ===================================================== */

function HighlightValidMoves() {

    if (gameOver) return;

    CallAJAX(
        "gameplay.php",
        "post",
        { action: "showValidMoves" },
        "json",
        function (data) {

            $('.cell').removeClass('valid-move');

            if (!data.validMoves) return;

            data.validMoves.forEach(pos => {
                let r = pos[0];
                let c = pos[1];
                $(`.cell[data-row=${r}][data-col=${c}]`)
                    .addClass('valid-move');
            });

            // Optional debug
            console.log("Valid Moves:", data.validMoves);
        },
        ErrorMethod
    );
}

/* ===================================================== */

function GameInitSuccess(returnedData) {

    console.log("INIT:", returnedData);

    if (!returnedData.board || returnedData.board.length === 0) {
        UpdateStatus(returnedData.message);
        $("#game-area").hide();
        $('.board').addClass('locked');
        return;
    }

    CreateBoard(BOARD_SIZE);
    UpdateBoard(returnedData.board);

    gameOver = false;

    $('#game-area').fadeIn(200);
    $('.board').removeClass('locked');

    UpdateStatus(returnedData.message);

    // Immediately show valid moves after start
    HighlightValidMoves();
}

/* ===================================================== */

function GameSuccess(returnedData) {

    console.log("MOVE:", returnedData);

    if (!returnedData.board) return;

    UpdateBoard(returnedData.board);
    UpdateStatus(returnedData.message);

    HighlightValidMoves();
}

/* ===================================================== */

function UpdateBoard(board) {

    const size = board.length;

    $('.cell').each(function () {

        let r = $(this).data("row");
        let c = $(this).data("col");

        if (r >= size || c >= size) return;

        const value = board[r][c];

        $(this).removeClass("x-cell o-cell");

        switch (value) {
            case "❁":
                $(this).val("❁").addClass("x-cell");
                break;

            case "✪":
                $(this).val("✪").addClass("o-cell");
                break;

            default:
                $(this).val("");
                break;
        }
    });
}

/* ===================================================== */

function UpdateStatus(message) {

    $('.status-message').html(message);

    if (message.toLowerCase().includes("wins")) {
        $('.status-message').css("color", "green");
    } else {
        $('.status-message').css("color", "black");
    }
}

/* ===================================================== */

function QuitGame() {

    CallAJAX("gameplay.php", "post",
        { action: "quit" }, "json",
        QuitSuccess, ErrorMethod);
}

function QuitSuccess(returnedData) {

    gameOver = true;

    $('input[name="Player1"]').val('');
    $('input[name="Player2"]').val('');

    $('#game-area').fadeOut(200);
    $('.board').addClass('locked');

    $('.cell').removeClass('valid-move');

    UpdateStatus(returnedData.message);
}

/* ===================================================== */

function CallAJAX(url, method, data, dataType, successMethod, errorMethod) {

    $.ajax({
        url: url,
        method: method,
        data: data,
        dataType: dataType,
        success: successMethod,
        error: errorMethod
    });
}

function ErrorMethod(req, status, error) {
    console.log("AJAX ERROR:", status, error);
}
