let gameOver = false;   // Global variable to track game state

/**
 * Document Ready
 */

$(document).ready(function () {

    // board disabled on initial load
    $('.board').addClass('locked');

    $('#newGame').click(StartGame());
    $('#quit').click(QuitGame());
    $('.cell').click(CellClicked);
});

/**
 * FunctionName: StartGame
 * Description: Initializes a new game
 */
function StartGame() {

    console.log("Starting new game...");

    if ($('input[name="nameX"]').val().trim() === "" ||
        $('input[name="nameO"]').val().trim() === "") {
        UpdateStatus("Please enter names for both players.");
        $('.board').addClass('locked');
        return;
    }

    let data = {};
    data["action"] = "init";
    data["player1"] = $('input[name="nameX"]').val();
    data["player2"] = $('input[name="nameO"]').val();

    gameOver = false;
    $('.board').removeClass('locked');

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

/**
 * FunctionName: GameSuccess
 * Description: Handles successful game actions 
 */
function GameSuccess(returnedData) {

    console.log(returnedData);

    if (returnedData.board && returnedData.board.length === 3) {
        UpdateBoard(returnedData.board);
    }

    UpdateStatus(returnedData.message);

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
    location.reload();
}
