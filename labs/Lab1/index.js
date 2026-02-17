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

    // Clicking a cell
    $(document).on('click', '.cell', CellClicked);

    // Highlight valid moves when mouse enters board
    $('#board').mouseenter(HighlightValidMoves);
});


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

function StartGame() {

    CallAJAX("gameplay.php", "post", "json",
        {
            action: "init",
            player1: $('input[name="Player1"]').val(),
            player2: $('input[name="Player2"]').val()
        }, GameInitSuccess, ErrorMethod);
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

    CallAJAX("gameplay.php", "post", "json",
        {
            action: "move",
            row: $(this).data("row"),
            col: $(this).data("col")
        },
        function (data) {
            console.log("MOVE:", data);

            if (!data.board) return;

            UpdateBoard(data.board);
            UpdateStatus(data.message);

            HighlightValidMoves();
            if (data.validMoves)
                console.log("Valid moves after move:", data.validMoves);

            if (data.gameOver) {
                GameOver(data.message);
            }
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

    CallAJAX("gameplay.php", "post", "json",
        { action: "showValidMoves" },
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

            default: $(this).val(""); break;
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

    CallAJAX("gameplay.php", "post", "json",
        { action: "quit" },
        function (data) {
            gameOver = true;

            $('input[name="Player1"]').val('');
            $('input[name="Player2"]').val('');
            $('#game-area').fadeOut(200);
            $('.board').addClass('locked');
            $('.cell').removeClass('valid-move');

            UpdateStatus(data.message);
        }, ErrorMethod);
}

function GameOver(data) {
    console.log("GAME OVER:", data);
    $('.cell').removeClass('valid-move');
    $('.board').addClass('locked');
    UpdateStatus(data);
    gameOver = true;
}


/**
 * FunctionName:    CallAJAX
 * Description:     Utility function to make AJAX calls with jQuery
 * Input:           url, method, data, dataType, success callback, error callback
 * Output:          performs the AJAX request and calls the appropriate callback on success or error
 */
function CallAJAX(url, method, dataType, data, successMethod, errorMethod) {
    $.ajax({ url: url, method: method, dataType: dataType, data: data, success: successMethod, error: errorMethod });
}

/**
 * FunctionName:    ErrorMethod
 * Description:     Handles AJAX errors by logging them to the console
 * Input:           request object, status text, error message
 * Output:          logs the error details to the console for debugging
 */
function ErrorMethod(req, status, error) {
    console.log("AJAX ERROR:", status, error);
    console.log("Request:", req);
}
