/*  CMPE2000 - Lab 2: Implementing Monopoly Game
    Author: Dareen Njatou
    Description: Core Game Logic

    Game Setup
*/
// An array of dce images to store the images of dice during the preload
let diceArray = []

let players = [
    { id: 1, position: 0, money: 3000, color: "lightgreen", jail: false },
    { id: 2, position: 0, money: 3000, color: "pink", jail: false }
]

let currentPlayer = 0
let rolling = false


// call this after PositionElements() in onload
onload = function () {
    PreloadDice()
    PositionElements()
    this.document.querySelector("#RollDice").onclick = RollDice
    UpdatePlayerBalance()

    // To set the initial border on the player
    highlightCurrentPlayer(currentPlayer)
}


function PreloadDice() {
    for (let i = 1; i <= 6; i++) {
        var imageName = "images/dice" + i + ".png"
        var myImage = new Image()
        myImage.src = imageName
        diceArray.push(myImage)
    }
}

// Updating Player's Money Balance
function UpdatePlayerBalance() {
    for (let i = 0; i < players.length; i++) {
        document.querySelector(`#player${i + 1}amt`).innerHTML = `$${players[i].money}`
    }
}

function PositionElements() {
    // Position each tiles based on the 'suite' attribute
    let nodeList = document.querySelectorAll("#gameboard > section")

    nodeList.forEach(tile => {
        console.log(tile)
        let posnStr = tile.getAttribute("suite")
        let rowNo = parseInt(posnStr.substring(0, 2))
        let colNo = parseInt(posnStr.substring(2, 4))

        // Set grid position
        tile.style.setProperty("grid-row", `${rowNo} / ${rowNo + 1}`)
        tile.style.setProperty("grid-column", `${colNo} / ${colNo + 1}`)

        let hasTopOrBottomColor = tile.classList.contains("lightblue") || tile.classList.contains("brown") || tile.classList.contains("red") || tile.classList.contains("yellow")

        // Create price tag dynamically if value exists
        let val = tile.getAttribute("val")
        let valDiv = document.createElement("p")
        if (val > 0 && !hasTopOrBottomColor) {
            if (!tile.querySelector(".priceTag")) {
                valDiv.className = "priceTag"
                valDiv.textContent = `${val}`
                tile.appendChild(valDiv)
            }
        }

        if (val > 0 && hasTopOrBottomColor) {
            if (!tile.querySelector(".priceTag")) {
                valDiv.className = "priceTag"
                valDiv.textContent = `${val}`
                tile.innerHTML += "<br>" + val
            }
        }
    })

    // Display PlayerS' Balance
    UpdatePlayerBalance()

    // Position Players' Title
    document.querySelector("#player1").innerHTML += "<p>Player 1</p>"
    document.querySelector("#player2").innerHTML += "<p>Player 2</p>"

    // Position Players' profile pictures
    let player1PP = document.createElement("img")
    player1PP.src = "images/player1.png"
    player1PP.id = "player1PP"
    document.querySelector("#player1").append(player1PP)

    let player2PP = document.createElement("img")
    player2PP.src = "images/player2.png"
    player2PP.id = "player2PP"
    document.querySelector("#player2").append(player2PP)

    // Position both players in the GO tile
    let player1InitialPosn = document.createElement("img")
    player1InitialPosn.src = "images/player1.png"
    let player2InitialPosn = document.createElement("img")
    player2InitialPosn.src = "images/player2.png"

    // Assigning new IDs to this pp because the shall dissapear when moving
    player1InitialPosn.id = "pplayer1"
    player2InitialPosn.id = "pplayer2"

    document.querySelector("#go").innerHTML += `<img id="pplayer2" src="images/player2.png"><img id="pplayer1" src="images/player1.png">`
}



function RollDice() {
    if (rolling)
        return

    rolling = true

    // Assigning random values from 1 to 6 to the dices
    let dice1 = Math.floor(Math.random() * 6) + 1
    let dice2 = Math.floor(Math.random() * 6) + 1

    let totalPts = dice1 + dice2

    UpdateStepsFromDicePoints(dice1, dice2, totalPts)
}


// To decide the value of the dice manually from the console (for testing or control)
function RollDiceManually(dice1, dice2) {
    if (rolling) 
         return
       
    rolling = true;

    // Validate input — if not a number, reroll randomly
    if (isNaN(dice1))
        dice1 = Math.floor(Math.random() * 6) + 1;
    if (isNaN(dice2))
        dice2 = Math.floor(Math.random() * 6) + 1;
    // Normalize dice values using modulo to keep them between 1–6
    if (!isNaN(dice1) && dice1 < 1 || dice1 > 6)
        dice1 = ((parseInt(dice1) - 1) % 6 + 6) % 6 + 1;
    if (!isNaN(dice2) && dice2 < 1 || dice2 > 6)
        dice2 = ((parseInt(dice2) - 1) % 6 + 6) % 6 + 1;

    let totalPts = dice1 + dice2;

    UpdateStepsFromDicePoints(dice1, dice2, totalPts)
}


// Function For easy testing by sending a player directly where i want through the nuber of steps I gve them in the console log
function MoveStepsToTile(playerIndex, slotsToMove) {
    // Validate playerIndex
    if (isNaN(playerIndex) || playerIndex < 0 || playerIndex >= players.length + 1) {
        console.error("SendToTile: invalid playerIndex:", playerIndex);
        return;
    }

    // Validate slotsToMove
    if (isNaN(slotsToMove) || slotsToMove <= 0) {
        console.error("SendToTile: invalid slotsToMove:", slotsToMove);
        return;
    }

    MovePlayer(playerIndex - 1, slotsToMove, false)
}

// Function to update the steps of the current player based on the values obtained from the rolled dices
function UpdateStepsFromDicePoints(dice1, dice2, totalPts) {
    // Clearing the previous dice in the "die" div
    document.querySelector("#die1").innerHTML = ""
    document.querySelector("#die2").innerHTML = ""

    // Creating new dices based on the values assigned to the dices
    let newDice1 = document.createElement("img")
    newDice1.src = "images/dice" + dice1 + ".png"
    let newDice2 = document.createElement("img")
    newDice2.src = "images/dice" + dice2 + ".png"

    // Adding the new dices to the "die" divs
    document.querySelector("#die1").append(newDice1)
    document.querySelector("#die2").append(newDice2)

    // Alert Here!!! State which Player rolled what and got How many points
    alert(`🎲 Player ${currentPlayer + 1} rolled ${dice1} and ${dice2} → Total: ${totalPts}`);

    MovePlayer(currentPlayer, totalPts, dice1 === dice2)
}


// It moves current player step by step
function MovePlayer(index, steps, doubles) {
    let playerMoving = players[index]
    let data = { count: 0 }

    let interval = setInterval(() => AnimatePlayer(playerMoving, steps, doubles, interval, data), 200)
}


// It animates current player based on the timer
function AnimatePlayer(playerMoving, steps, doubles, interval, data) {
    document.querySelectorAll(`#pplayer${playerMoving.id}`).forEach(el => el.remove())
    playerMoving.position++

    // If the playerPP position exceeds the total number of cells restart its position and add its balance
    if (playerMoving.position > 39) {
        playerMoving.position = 0
        playerMoving.money += 200
        // alert here to say the player has crossed GO and updated his money***
        UpdatePlayerBalance()
    }

    // Placing a new marker with the IDs of the pngs playing on the board
    let currentSquare = document.querySelectorAll("section")[playerMoving.position]
    let marker = document.createElement("img")
    marker.id = `pplayer${playerMoving.id}`
    marker.src = "images/player" + playerMoving.id + ".png"
    currentSquare.appendChild(marker)

    data.count++

    if (data.count === steps) {
        clearInterval(interval)
        rolling = false

        HandleLandingOnCmdTile(playerMoving, currentSquare, doubles)    }
}


// Go to Jail function to send a player to jail if he lands on the the Goto Jail
function GoToJail(player) {
    let JailTileIndex = 10
    player.position = JailTileIndex

    let JailTile = document.querySelector("#jail")
    let currentPlayerID = document.querySelector(`#pplayer${player.id}`)
    JailTile.appendChild(currentPlayerID)
    player.money -= 50
    UpdatePlayerBalance()
}


// Adding the TakeAChanceText and TakeAChanceMoney from the Lab's PDF for the Chance/ Community Chest
const takeAChanceText = [
    "Second Place in Beauty Contest: $10",
    "Bank Pays You Dividend of $50",
    "Repair your Properties. You owe $250",
    "Speeding Fine: $15",
    "Holiday Fund Matures: Receive $100",
    "Pay Hospital Fees: $100"
];
const takeAChanceMoney = [10, 50, -250, -15, 100, -100];

function TakeAChance(player, type) {
    let index = Math.floor(Math.random() * takeAChanceText.length)
    alert(`${type === "cc" ? "Community Chest" : "Chance"}: ${takeAChanceText[index]}`)

    // Updating the players balance
    player.money += takeAChanceMoney[index]
}

// Handles Landing on squares with Clear commands, Like landing on Goto Jail
function HandleLandingOnCmdTile(player, tile, doubles) {
    let type = tile.classList
    let val = parseInt(tile.getAttribute("val") || 0)

    console.log("Hello From HandleLandingOnCmdTile")

    // Let's test the GoTo Jail Function
    if (type.contains("goToJail")) {
        // Alert the User
        alert("Player " + player.id + " goes to jail directly to jail! But will have to pay a fine of $50 to move out")

        // Sending the player to jail
        GoToJail(player)
    }
    else if (type.contains("jail")) {
        alert(`Player ${player.id} pays $50 to get out of jail.`)
        player.money -= 50
    }
    else if (type.contains("tax")) {
        alert(`Player ${player.id} pays tax of $${val}`);
        player.money -= val;
    }
    else if (type.contains("cc") || type.contains("chance")) {
        console.log("Hello from chance")
        TakeAChance(player, type.contains("cc") ? "cc" : "chance")
    }

    // Statement to handle the properties and the utilities
    else if (type.contains("rr") || type.contains("utility") || type.contains("brown") || type.contains("purple") || type.contains("orange") || type.contains("red") || type.contains("yellow") || type.contains("green") || type.contains("blue")) {
        HandleProperty(player, tile)
    }

    // Checking for a loser and endng the game if there is
    if (player.money <= 0) {
        alert(`💀 Player ${player.id} loses!`)
        document.querySelector("#RollDice").disabled = true
        return
    }

    // Update player's balance for issues with the taxes for example
    UpdatePlayerBalance()

    // Switching players based on having double dice values or not
    if (!doubles)
        currentPlayer = (currentPlayer + 1) % 2

    highlightCurrentPlayer(currentPlayer)

}

function highlightCurrentPlayer(currentPlayer){
    const panel1 = document.querySelector(`#player${currentPlayer + 1}PP`)
    const panel2 = document.querySelector(`#player${((currentPlayer + 1) % 2) +1}PP`)
    if (panel1) panel1.style.border = "5px dashed red"
    if (panel2) panel2.style.border = "none"
}

// Now, let's handle the properties, buying a house, paying rents and utilities etc

// Handle property
function HandleProperty(player, square) {
    if (!square.dataset.owner) {
        // Buy property
        let cost = parseInt(square.getAttribute("val"));
        if (player.money >= cost) {
            player.money -= cost;
            square.dataset.owner = player.id;
            square.style.backgroundColor = player.color;
            alert(`Player ${player.id} bought ${square.textContent} for $${cost}`);
        }
    } else if (square.dataset.owner != player.id) {
        // Pay rent
        let owner = players[square.dataset.owner - 1];
        let rent = Math.floor(parseInt(square.getAttribute("val")) * 0.1);
        alert(`Player ${player.id} pays $${rent} rent to Player ${owner.id}`);
        player.money -= rent;
        owner.money += rent;
    }
}

