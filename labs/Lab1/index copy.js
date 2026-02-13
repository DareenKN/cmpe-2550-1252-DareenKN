let gameOver = false;   // Global variable to track game state

const BOARD_SIZE = 8; // Size of the 2d board

/**
 * Document Ready
 */

$(document).ready(function () {
    CreateBoard(BOARD_SIZE);
    $('.board').addClass('locked');
    $('#game-area').hide();

    $('#newGame').click(StartGame);
    $('#quit').click(QuitGame);

    // if cell is hovered, show valid moves (if any)
    $(document).on('mouseenter', '.cell', ShowValidMoves)

    // Event delegation (important!)
    $(document).on('click', '.cell', CellClicked);
});

function ShowValidMoves() {
    if (gameOver) return;

    let r = $(this).data("row");
    let c = $(this).data("col");

    // Show valid moves for this cell
    ValidMoves(r, c);
}

function ValidMoves(r, c) {

    let data = {};
    data["action"] = "showValidMoves";
    data["row"] = r;
    data["col"] = c;

    CallAJAX(
        "gameplay.php",
        "post",
        data,
        "json",
        ValidMovesSuccess,
        ErrorMethod
    );
}

function ValidMovesSuccess(returnedData) {
    if (returnedData.validMoves && returnedData.validMoves.length == 0) {
        gameOver = true;
        return;
    }
    if (returnedData.validMoves && returnedData.validMoves.length > 0) {
        if (returnedData.valid == true) {
            console.log("VALID MOVES RESPONSE:", returnedData);

            returnedData.validMoves.forEach(pos => {
                let r = pos[0];
                let c = pos[1];
                $(`.cell[data-row=${r}][data-col=${c}]`).addClass('valid-move');
            });
        }
    }
    if(gameOver){
        $('.board').addClass('locked');
        UpdateStatus(returnedData.message);
    }
}

function CreateBoard(size) {

    const board = $('#board');
    board.empty(); // clear previous board

    $('.board').css("grid-template-columns", "repeat(" + size + ", 60px)");
    $('.board').css("grid-template-rows", "repeat(" + size + ", 60px)");

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

/**
 * FunctionName: StartGame
 * Description: Initializes a new game
 */
function StartGame() {
    console.log("Starting new game...");

    let data = {};
    data["action"] = "init";
    data["player1"] = $('input[name="Player1"]').val();
    data["player2"] = $('input[name="Player2"]').val();

    CallAJAX(
        "gameplay.php",
        "post",
        data,
        "json",
        GameInitSuccess,
        ErrorMethod
    );
}

/**
 * FunctionName: CellClicked
 * Description: Handles cell click events
 */
function CellClicked() {
    // Clear previous valid move highlights
    $('.cell').removeClass('valid-move');
    // Prevent moves if game is over
    if (gameOver) {
        return;
    }

    let data = {};
    data["action"] = "move";
    data["row"] = $(this).data("row");
    data["col"] = $(this).data("col");

    CallAJAX(
        "gameplay.php",
        "post",
        data,
        "json",
        GameSuccess,
        ErrorMethod
    );
}


/**
 * FunctionName: CallAJAX
 * Description: Generic AJAX call function
 */
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

function GameInitSuccess(returnedData) {

    console.log("INIT RESPONSE:", returnedData);

    // Just message
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
}


/**
 * FunctionName: GameSuccess
 * Description: Handles successful game actions 
 */
function GameSuccess(returnedData) {

    console.log(returnedData);

    if (returnedData.board && returnedData.board.length === BOARD_SIZE) {
        UpdateBoard(returnedData.board);
        UpdateStatus(returnedData.message);
    }

    // Lock game if over
    gameOver = returnedData.gameOver === true;

    if (gameOver) {
        $('.board').addClass('locked');
    } else {
        $('.board').removeClass('locked');
    }

    UpdateStatus(returnedData.message);

}


/**
 * FunctionName: UpdateBoard
 * Description: Updates the game board UI
 */
function UpdateBoard(board) {

    const size = board.length;

    $('.cell').each(function () {
        let r = $(this).data("row");
        let c = $(this).data("col");

        // safety guard
        if (
            r === undefined || c === undefined ||
            r < 0 || c < 0 ||
            r >= size || c >= size
        ) return;

        const value = board[r][c];

        // reset
        $(this).removeClass("x-cell o-cell");

        switch (value) {
            case "❁": $(this).val("❁").addClass("x-cell"); break;
            case "✪": $(this).val("✪").addClass("o-cell"); break;
            default: $(this).val(""); break;
        }
    });
}

/**
 * FunctionName: UpdateStatus
 * Description: Updates the status message UI
 */
function UpdateStatus(message) {
    $('.status-message').html(message);
    if (message.includes("wins")) {
        $('.status-message').css("color", "green");
    }
    else if (message.includes("CATS")) {
        $('.status-message').css("color", "yellow");
    }
    else {
        $('.status-message').css("color", "black");
    }
}

/**
 * FunctionName: ErrorMethod
 * Description: Handles AJAX errors
 */
function ErrorMethod(req, status, error) {
    console.log("AJAX ERROR");
    console.log(status);
    console.log(error);
}

/**
 * FunctionName: QuitGame
 * Description: Sends a quit game request
 */
function QuitGame() {

    let data = {};
    data["action"] = "quit";

    CallAJAX("gameplay.php", "post", data, "json", QuitSuccess, ErrorMethod);
}

/**
 * FunctionName: QuitSuccess
 * Description: Handles successful quit action
 */
function QuitSuccess(returnedData) {

    gameOver = true;

    $('input[name="Player1"]').val('');
    $('input[name="Player2"]').val('');

    $('#game-area').fadeOut(200);
    $('.board').addClass('locked');

    UpdateStatus("Game quit. Enter names to start a new game.");
}


