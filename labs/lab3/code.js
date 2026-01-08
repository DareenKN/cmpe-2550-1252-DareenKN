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
$(() => {
    PreloadDice()
    PositionElements()

    // Create the load properties button
    LoadPropertyBtn()

    // Load the properties
    $("#LoadProperties").click(LoadProperties)


    $("#RollDice").click(RollDice)
    UpdatePlayerBalance()

    // To set the initial border on the player
    highlightCurrentPlayer(currentPlayer)
})


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
        $(`#player${i + 1}amt`).html(`$${players[i].money}`)
    }
}

function PositionElements() {
    // Position each tiles based on the 'suite' attribute
    $("#gameboard > section").each((index, tile) => {
        // console.log(tile)
        let posnStr = $(tile).attr("suite")
        let rowNo = parseInt(posnStr.substring(0, 2))
        let colNo = parseInt(posnStr.substring(2, 4))

        // Set grid position
        $(tile).css("grid-row", `${rowNo} / ${rowNo + 1}`)
        $(tile).css("grid-column", `${colNo} / ${colNo + 1}`)

        // Set background colour to another colour for fun
        $(tile).css("background-color", "rgba(249, 221, 187, 1)")
    })

    // Display PlayerS' Balance
    UpdatePlayerBalance()

    // Position Players' Title
    $("#player1").append("<p>Player 1</p>")
    $("#player2").append("<p>Player 2</p>")

    // Position Players' profile pictures
    let player1PP = $("<img>")
    player1PP.prop({ src: "images/player1.png", id: "player1PP" })
    $("#player1").append(player1PP)

    let player2PP = $("<img>")
    player2PP.prop({ src: "images/player2.png", id: "player2PP" })
    $("#player2").append(player2PP)

    // Position both players in the GO tile
    let player1InitialPosn = $(`<img src="images/player1.png">`)
    let player2InitialPosn = $(`<img src="images/player2.png">`)

    // Assigning new IDs to this pp because the shall dissapear when moving
    player1InitialPosn.prop({ id: "pplayer1" })
    player2InitialPosn.prop({ id: "pplayer2" })

    // Place the players PP in the GO case at the begining of the game
    $("#go").html(`<img id="pplayer2" src="images/player2.png"><img id="pplayer1" src="images/player1.png">`)
}

// Generic AJAXCall 
function CallAJAX(data, succesFunction) {

    // I will directly include type = "POST" and dataType = "JSON" in the ajaxOptions
    let url = 'https://thor.cnt.sast.ca/~aulakhha/filesAssLab/lab3.php'
    let type = 'POST'
    let dataType = 'json'

    let ajaxOptions = {}

    ajaxOptions['url'] = url
    ajaxOptions['type'] = type
    ajaxOptions['data'] = data
    ajaxOptions['dataType'] = dataType
    ajaxOptions['success'] = succesFunction
    ajaxOptions['error'] = errorHandler

    return $.ajax(ajaxOptions)
}

function errorHandler(jqXHR, status, errorThrown) {
    let message = `Error: ${status} - ${errorThrown} - ${jqXHR.status}`
    console.log(message)
    alert(message)
}


function RollDice() {
    if (rolling)
        return

    rolling = true

    // AJAXCall
    CallAJAX({ "action": "diceroll" }, RollDiceSuccess)
}

function RollDiceSuccess(data, status) {
    console.log("status: " + status)
    console.log(data)

    let dice1 = data['dice1']
    let dice2 = data['dice2']

    let totalPts = dice1 + dice2

    UpdateStepsFromDicePoints(dice1, dice2, totalPts)
}

// Function to update the steps of the current player based on the values obtained from the rolled dices
function UpdateStepsFromDicePoints(dice1, dice2, totalPts) {
    // Clearing the previous dice in the "die" div
    $("#die1").html("")
    $("#die2").html("")

    // Creating new dices based on the values assigned to the dices
    let newDice1 = $(`<img src="images/dice${dice1}.png">`)
    let newDice2 = $(`<img src="images/dice${dice2}.png">`)
    // Adding the new dices to the "die" divs
    $("#die1").append(newDice1)
    $("#die2").append(newDice2)

    // Alert Here!!! State which Player rolled what and got How many points
    alert(`🎲 Player ${currentPlayer + 1} rolled ${dice1} and ${dice2} → Total: ${totalPts}`);

    MovePlayer(currentPlayer, totalPts, dice1 == dice2)
}


// Function For easy testing by sending a player directly where i want through the nuber of steps I gve them in the console log
function MoveStepsToTile(playerIndex, slotsToMove) {
    // Validate playerIndex
    if (isNaN(parseInt(playerIndex)) || playerIndex < 0 || playerIndex >= players.length + 1) {
        console.error("SendToTile: invalid playerIndex:", playerIndex)
        return
    }

    // Validate slotsToMove
    if (isNaN(slotsToMove) || slotsToMove <= 0) {
        console.error("SendToTile: invalid slotsToMove:", slotsToMove)
        return
    }

    MovePlayer(playerIndex - 1, slotsToMove, false)
}

// It moves current player step by step
function MovePlayer(index, steps, doubles) {
    let playerMoving = players[index]
    let data = { count: 0 }

    let timer = setInterval(() => AnimatePlayer(playerMoving, steps, doubles, timer, data), 200)
}


// It animates current player based on the timer
function AnimatePlayer(playerMoving, steps, doubles, timer, data) {
    $(`#pplayer${playerMoving.id}`).each((index, el) => { $(el).remove() })
    playerMoving.position++

    // If the playerPP position exceeds the total number of cells restart its position and add its balance
    if (playerMoving.position > 39) {
        playerMoving.position = 0
        playerMoving.money += 200
        // alert here to say the player has crossed GO and updated his money***
        alert(`Player${playerMoving.id} has crossed Go and recieved 200$`)
        UpdatePlayerBalance()
    }

    // Placing a new marker with the IDs of the pngs playing on the board
    let currentSquare = $("section")[playerMoving.position]
    // console.log(currentSquare)
    let marker = $(`<img src="images/player${playerMoving.id}.png">`)
    marker.prop({ id: `pplayer${playerMoving.id}` })
    $(currentSquare).append(marker)

    data.count++

    if (data.count == steps) {
        clearInterval(timer)
        rolling = false

        HandleLandingOnCmdTile(playerMoving, currentSquare, doubles)
    }
}


// Go to Jail function to send a player to jail if he lands on the the Goto Jail
function GoToJail(player) {
    let JailTileIndex = 10
    player.position = JailTileIndex

    let JailTile = $("#jail")
    let currentPlayerID = $(`#pplayer${player.id}`)
    JailTile.append(currentPlayerID)
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
]
const takeAChanceMoney = [10, 50, -250, -15, 100, -100]

function TakeAChance(player, type) {
    let index = Math.floor(Math.random() * takeAChanceText.length)
    alert(`${type == "cc" ? "Community Chest" : "Chance"}: ${takeAChanceText[index]}`)

    // Updating the players balance
    player.money += takeAChanceMoney[index]
}

// Handles Landing on squares with Clear commands, Like landing on Goto Jail
function HandleLandingOnCmdTile(player, tile, doubles) {
    let type = $(tile).attr("class")
    let val = parseInt($(tile).attr("val") || 0)

    console.log("Hello From HandleLandingOnCmdTile")

    // Let's test the GoTo Jail Function
    if (type.includes("goToJail")) {
        // Alert the User
        alert("Player " + player.id + " goes to jail directly to jail! But will have to pay a fine of $50 to move out")

        // Sending the player to jail
        GoToJail(player)
    }
    else if (type.includes("jail")) {
        alert(`Player ${player.id} pays $50 to get out of jail.`)
        player.money -= 50
    }
    else if (type.includes("tax")) {
        alert(`Player ${player.id} pays tax of $${val}`);
        player.money -= val;
    }
    else if (type.includes("cc") || type.includes("chance")) {
        console.log("Hello from chance")
        TakeAChance(player, type.includes("cc") ? "cc" : "chance")
    }

    // Statement to handle the properties and the utilities
    else if (type.includes("rr") || type.includes("utility") || type.includes("brown") || type.includes("purple") || type.includes("orange") || type.includes("red") || type.includes("yellow") || type.includes("green") || type.includes("blue")) {
        HandleProperty(player, tile)
    }

    // Checking for a loser and endng the game if there is
    if (player.money <= 0) {
        alert(`💀 Player ${player.id} loses!`)
        $("#RollDice").prop("disabled", true)
        return
    }

    // Update player's balance for issues with the taxes for example
    UpdatePlayerBalance()

    // Switching players based on having double dice values or not
    if (!doubles)
        currentPlayer = (currentPlayer + 1) % 2

    highlightCurrentPlayer(currentPlayer)
}

function highlightCurrentPlayer(currentPlayer) {
    const panel1 = $(`#player${currentPlayer + 1}PP`)
    const panel2 = $(`#player${((currentPlayer + 1) % 2) + 1}PP`)
    if (panel1) panel1.css("border", "5px dashed red")
    if (panel2) panel2.css("border", "none")
}

// Now, let's handle the properties, buying a house, paying rents and utilities etc

// Handle property
function HandleProperty(player, square) {
    // Add owner property to the square
    let ownerId = parseInt($(square).attr("owner"))

    if (!ownerId) {
        // Buy property
        let cost = parseInt($(square).attr("val"))

        if (player.money >= cost) {
            player.money -= cost
            $(square).attr("owner", player.id)
            $(square).css("background-color", player.color)
            alert(`Player ${player.id} bought ${$(square).text()} for $${cost}`);
        }
    } else if (ownerId != player.id) {
        // Pay rent
        let owner = players[ownerId - 1];
        let rent = Math.floor(parseInt($(square).attr("val")) * 0.1);
        alert(`Player ${player.id} pays $${rent} rent to Player ${owner.id}`);
        player.money -= rent;
        owner.money += rent;
    }

    UpdatePlayerBalance()
}

function LoadPropertyBtn() {
    let LoadPropertyBtn = $(`<br><br><button id="LoadProperties">Load Property</button>`)
    $("#monopoly > h2").append(LoadPropertyBtn)

    // Disable Dice roll
    $("#RollDice").prop("disabled", true)

}

function LoadProperties() {
    CallAJAX({ "action": "propertyPrices" }, LoadPropertiesSuccess)

    // Disable the LoadPropertirs Button
    $("#LoadProperties").prop("disabled", true)

    // Enable the RollDice Button
    $("#RollDice").prop("disabled", false)
}

function LoadPropertiesSuccess(data, status) {
    console.log("POST done: " + status)
    console.log(data)

    $("#gameboard > section").each((index, tile) => {
        // Gettind top and bottm colors for better appends of the playersPP
        let hasTopOrBottomColor = $(tile).hasClass("lightblue") ||
            $(tile).hasClass("brown") ||
            $(tile).hasClass("red") ||
            $(tile).hasClass("yellow")

        //Uctually using the value from the returned data of the AJAXCall
        let val = parseInt(data[index])

        // Updating the "val" attibute for each section
        $(tile).attr("val", val)

        let valDiv = $("<p></p>")   // Creating a paragraph element
        if (val > 0 && !hasTopOrBottomColor) {
            if ($(tile).find(".priceTag").length == 0) {
                valDiv.addClass("priceTag").text(val)
                $(tile).append(valDiv)
            }
        }

        if (val > 0 && hasTopOrBottomColor) {
            if ($(tile).find(".priceTag").length == 0) {
                valDiv.addClass("priceTag")
                valDiv.text(val)
                $(tile).append("<br>" + val)
            }
        }
    })
}