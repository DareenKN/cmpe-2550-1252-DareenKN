let gameOver = false;

$(document).ready(function () {

    $('#newGame').click(function (e) {
        e.preventDefault();
        StartGame();
    });

    $('#quit').click(function (e) {
        e.preventDefault();
        QuitGame();
    });

    $('.cell').click(CellClicked);
});

/**
 * FunctionName: StartGame
 */
function StartGame() {

    console.log("Starting new game...");

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
 */
function CellClicked() {

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
 */
function GameSuccess(returnedData) {

    console.log(returnedData);

    if (returnedData.board && returnedData.board.length === 3) {
        UpdateBoard(returnedData.board);
    }

    UpdateStatus(returnedData.message);

    // 🔒 lock game if over
    gameOver = returnedData.gameOver === true;

    if (gameOver) {
        $('.board').addClass('locked');
    } else {
        $('.board').removeClass('locked');
    }

}


/**
 * FunctionName: UpdateBoard
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
 */
function UpdateStatus(message) {
    $('.status-message').html(message);
}

/**
 * FunctionName: ErrorMethod
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

function QuitSuccess(returnedData) {

    location.reload();

}
