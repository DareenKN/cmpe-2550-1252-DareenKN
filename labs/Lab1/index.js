/* CMPE2550 - Web Applications
 * Name: Dareen Kinga Njatou
 * ICA2 - Tic Tac Toe
 * index.js - 
 * Description: Handling frontend logic and AJAX calls
 * Date: January 20, 2026 */
let gameOver = false; // Global variable to track game state
const BOARD_SIZE = 8; // Size of the 2d board

$(document).ready(function () {

    CreateBoard(BOARD_SIZE);
    $('.board').addClass('locked');
    $('#game-area').hide();

    $('#newGame').click(StartGame);
    $('#quit').click(QuitGame);

    // if cell is hovered, show valid moves 
    $(document).on('mouseenter', '.cell', ShowValidMoves)

    // Clicking a cell
    $(document).on('click', '.cell', CellClicked);

    // Highlight valid moves when mouse enters board
    $('#board').mouseenter(HighlightValidMoves);
});

/**
 * FunctionName:    ShowValidMoves
 * Description:     Shows valid moves for the hovered cell
 * Input:           none (uses data attributes of hovered cell)
 * Output:          highlights valid move cells on the board
 */
function ShowValidMoves() {
    if (gameOver) return;

    let r = $(this).data("row");
    let c = $(this).data("col");

    // Show valid moves for this cell
    ValidMoves(r, c);
}

/**
 * FunctionName:    ValidMoves
 * Description:     Makes an AJAX call to get valid moves for a cell
 * Input:           row and column of the cell
 * Output:          calls ValidMovesSuccess on success, ErrorMethod on failure
 */
function ValidMoves(r, c) {

    CallAJAX(
        "gameplay.php",
        "post",
        { action: "showValidMoves", row: r, col: c },
        "json",
        ValidMovesSuccess,
        ErrorMethod
    );
}

/**
 * FunctionName:    ValidMovesSuccess
 * Description:     Handles the response from the server for valid moves
 * Input:           JSON object with valid moves and game status
 * Output:          highlights valid move cells, updates game state if game over
 */
function ValidMovesSuccess(returnedData) {
    if (returnedData.validMoves && returnedData.validMoves.length > 0) {
        console.log("VALID MOVES RESPONSE:", returnedData);

        returnedData.validMoves.forEach(pos => {
            let r = pos[0];
            let c = pos[1];
            $(`.cell[data-row=${r}][data-col=${c}]`).addClass('valid-move');
        });

    }
    if (returnedData.gameOver) {
        gameOver = true;
        $('.board').addClass('locked');
        UpdateStatus(returnedData.message);
    }
}

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

/**
 * FunctionName:    ShowValidMoves
 * Description:     Shows valid moves for the hovered cell
 * Input:           none (uses data attributes of hovered cell)
 * Output:          highlights valid move cells on the board
 */
function StartGame() {

    CallAJAX("gameplay.php", "post", {
        action: "init",
        player1: $('input[name="Player1"]').val(),
        player2: $('input[name="Player2"]').val()
    }, "json",
        GameInitSuccess, ErrorMethod);
}

/**
 * FunctionName:    CellClicked
 * Description:     Handles the click event on a cell to make a move
 * Input:           none (uses data attributes of clicked cell)
 * Output:          makes an AJAX call to process the move, updates game state
 */
function CellClicked() {
    $('.cell').removeClass('valid-move');

    if (gameOver) {
        return;
    }

    CallAJAX("gameplay.php", "post", {
        action: "move",
        row: $(this).data("row"),
        col: $(this).data("col")
    }, "json",
        function (data) {
            console.log("MOVE:", returnedData);

            if (!returnedData.board) return;

            UpdateBoard(returnedData.board);
            UpdateStatus(returnedData.message);

            HighlightValidMoves();
        }, ErrorMethod);
}

/**
 * FunctionName:    HighlightValidMoves
 * Description:     Highlights valid moves on the board when mouse enters
 * Input:           none
 * Output:          makes an AJAX call to get valid moves, highlights them on success
 */
function HighlightValidMoves() {

    if (gameOver) return;

    CallAJAX("gameplay.php", "post",
        { action: "showValidMoves" }, "json",
        function (data) {

            $('.cell').removeClass('valid-move');

            if (!data.validMoves) return;

            data.validMoves.forEach(pos => {
                let r = pos[0];
                let c = pos[1];
                $(`.cell[data-row=${r}][data-col=${c}]`)
                    .addClass('valid-move');
            });

            // Test log to verify valid moves are received
            console.log("Valid Moves:", data.validMoves);
        },
        ErrorMethod
    );
}

/**
 * FunctionName:    GameInitSuccess
 * Description:     Handles the response from the server when initializing a new game
 * Input:           JSON object with initial board state and message
 * Output:          creates the game board, updates the status message, and shows valid moves
 */
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


/**
 * FunctionName:    UpdateBoard
 * Description:     Updates the game board UI based on the current board state
 * Input:           2D array representing the board state with symbols for pieces
 * Output:          updates the cell values and classes to reflect the current board
 */
function UpdateBoard(board) {

    const size = board.length;

    $('.cell').each(function () {

        let r = $(this).data("row");
        let c = $(this).data("col");

        if (r >= size || c >= size) return;

        const value = board[r][c];

        $(this).removeClass("x-cell o-cell");

        switch (value) {
            case "❁": $(this).val("❁").addClass("x-cell"); break;
            case "✪": $(this).val("✪").addClass("o-cell"); break;

            default:   $(this).val("");                     break;
        }
    });
}

/**
 * FunctionName:    UpdateStatus
 * Description:     Updates the status message displayed to the user
 * Input:           message string to display
 * Output:          updates the status message element and changes color if it indicates a win
 */
function UpdateStatus(message) {

    $('.status-message').html(message);

    if (message.toLowerCase().includes("wins")) {
        $('.status-message').css("color", "green");
    } else {
        $('.status-message').css("color", "black");
    }
}

/**
 * FunctionName:    QuitGame
 * Description:     Handles the quit game action, sends a request to end the game session
 * Input:           none
 * Output:          makes an AJAX call to quit the game, updates UI on success
 */
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

/**
 * FunctionName:    CallAJAX
 * Description:     Utility function to make AJAX calls with jQuery
 * Input:           url, method, data, dataType, success callback, error callback
 * Output:          performs the AJAX request and calls the appropriate callback on success or error
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
 * FunctionName:    ErrorMethod
 * Description:     Handles AJAX errors by logging them to the console
 * Input:           request object, status text, error message
 * Output:          logs the error details to the console for debugging
 */
function ErrorMethod(req, status, error) {
    console.log("AJAX ERROR:", status, error);
}
