$(document).ready(function () {

    $('#newGame').click(function (e) {
        e.preventDefault();
        StartGame();
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
}

/**
 * FunctionName: UpdateBoard
 */
function UpdateBoard(board) {

    $('.cell').each(function () {
        let r = $(this).data("row");
        let c = $(this).data("col");

        $(this).val(board[r][c] === 0 ? "" : board[r][c]);
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
