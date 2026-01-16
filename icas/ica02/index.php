<!-- CMPE2550 - Web Applications
    Name: Dareen Kinga Njatou
    ICA1 - PHP Intro 
    Description: This is a PHP introduction exercise in which I implement PHP basics
                 such as arrays, loops, and functions
    Date: January 12, 2026 -->

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CMPE2550 - Assignment 02 - Tic Tac Toe</title>

    <link rel="stylesheet" href="style.css" />

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script defer src="script.js"></script>
</head>

<body>
    <main class="app">
        <header class="app__header">
            <h1>CMPE2550 - Assignment 02 - Tic Tac Toe</h1>
        </header>

        <section class="panel">
            <div class="panel__inner">

                <!-- Status / messaging label -->
                <!-- Swap classes: msg--info | msg--error | msg--success -->
                <div id="statusMsg" class="msg msg--info">
                    Enter your names below:
                </div>

                <!-- Player controls (form posts back to index.php in your PHP version) -->
                <form id="playerForm" class="controls" method="post" action="">
                    <div class="controls__row">
                        <input type="text" id="p1Name" name="p1Name" placeholder="Player one name here!"
                            autocomplete="off" />
                        <input type="text" id="p2Name" name="p2Name" placeholder="Player two name here!"
                            autocomplete="off" />
                    </div>
                    <br>
                    <div class="controls__row controls__row--buttons">
                        <button type="submit" id="btnNewGame">New Game</button>
                        <button type="submit" id="btnQuitGame" name="quit" value="1">Quit Game</button>
                    </div>
                </form>

                <hr class="divider" />

                <!-- Gameboard container -->
                <!-- You can hide/show by toggling .is-hidden -->
                <div id="boardWrap" class="board-wrap">
                    <div id="gameBoard" class="board" aria-label="Tic Tac Toe Board">

                        <!-- 3x3 readonly inputs (50x50) -->
                        <input class="cell" id="0_0" type="text" readonly />
                        <input class="cell" id="0_1" type="text" readonly />
                        <input class="cell" id="0_2" type="text" readonly />

                        <input class="cell" id="1_0" type="text" readonly />
                        <input class="cell" id="1_1" type="text" readonly />
                        <input class="cell" id="1_2" type="text" readonly />

                        <input class="cell" id="2_0" type="text" readonly />
                        <input class="cell" id="2_1" type="text" readonly />
                        <input class="cell" id="2_2" type="text" readonly />

                    </div>
                </div>

            </div>
        </section>

        <footer class="app__footer">
            <div class="footer-bar">© 2023</div>
        </footer>
    </main>
</body>

</html>