let gameOver = false;   // Global variable to track game state

const BOARD_SIZE = 3; // change to 8 later 👀

/**
 * Document Ready
 */

$(document).ready(function () {

    $('.board').addClass('locked');

    $('#newGame').click(StartGame);
    $('#quit').click(QuitGame);

    // Event delegation (important!)
    $(document).on('click', '.cell', CellClicked);
});


function CreateBoard(size) {

    const board = $('#board');
    board.empty(); // clear previous board

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
        "gameFlow.php",
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

    // Prevent moves if game is over
    if (gameOver) {
        UpdateStatus("Game over. Start a new game.");
        return;
    }

    let data = {};
    data["action"] = "move";
    data["row"] = $(this).data("row");
    data["col"] = $(this).data("col");

    CallAJAX(
        "gameFlow.php",
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

    // ❌ Init failed → no board, just message
    if (!returnedData.board || returnedData.board.length === 0) {
        UpdateStatus(returnedData.message);
        return;
    }

    // ✅ Init succeeded → NOW we create the board
    CreateBoard(BOARD_SIZE);

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

    if (returnedData.board && returnedData.board.length === 3) {
        UpdateBoard(returnedData.board);
    }

    // Lock game if over
    gameOver = returnedData.gameOver === true;

    if (gameOver) {
        $('.board').addClass('locked');
    } else {
        $('.board').removeClass('locked');
    }

}


/**
 * FunctionName: UpdateBoard
 * Description: Updates the game board UI
 */
function UpdateBoard(board) {

    $('.cell').each(function () {
        let r = $(this).data("row");
        let c = $(this).data("col");

        // reset
        $(this).removeClass("x-cell o-cell");

        if (board[r][c] === "X") {
            $(this).val("X");
            $(this).addClass("x-cell");
        }
        else if (board[r][c] === "O") {
            $(this).val("O");
            $(this).addClass("o-cell");
        }
        else {
            $(this).val("");
        }
    });
}


/**
 * FunctionName: UpdateStatus
 * Description: Updates the status message UI
 */
function UpdateStatus(message) {
    $('.status-message').html(message);
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

function QuitGame() {

    let data = {};
    data["action"] = "quit";

    CallAJAX(
        "gameFlow.php",
        "post",
        data,
        "json",
        QuitSuccess,
        ErrorMethod
    );
}

/**
 * FunctionName: QuitSuccess
 * Description: Handles successful quit action
 */
function QuitSuccess(returnedData) {

    gameOver = true;

    $('#game-area').hide();
    $('.board').addClass('locked');

    UpdateStatus("Game quit. Enter names to start a new game.");
}


