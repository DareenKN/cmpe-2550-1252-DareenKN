/* Javascript file week7_1.js
   written by Oveeyen Moonian on 16 February 2022
   The functions in this file are being called from
   the HTML file week7demo1/index.html */

//We first register the different event handlers
onload = function () {

    // binding the different event handlers to the respective events
    document.querySelector("#displayDrinkBtn").onclick = displayDrinkStall;
    document.querySelector("#chosenRadioBtn").onclick = displayChosenRadio;
    document.querySelector("#nonChosenRadioBtn").onclick = displayNonChosenRadio;
    document.querySelector("#displayContactBtn").onclick = displayContactMethods;
    document.querySelector("#Grade").onchange = displayGradeMessage;
    document.querySelector("#uncheckRadioBtn").onclick = uncheckRadioButtons;
    document.querySelector("#uncheckCheckBoxesBtn").onclick = uncheckCheckboxes;
    document.querySelector("#checkOptionsBtn").onclick = checkOptions;
}


/*Function displayDrinkStall() accesses the radiobutton group
named "drink". It checks which one of the buttons
is checked (through the value assigned to the name "drink") 
and accordingly places a message in the output element of the form*/


function displayDrinkStall() {
    let chosenDrink = document.querySelector(".radio1:checked");
    let message;
    switch (chosenDrink.value) {
        case 'Coffee': message = 'For Coffee go to stall A';
            break;
        case 'Tea': message = 'For Tea go to stall B';
            break;
        case 'Juice': message = 'For Juice go to stall C';
            break;
    }
    document.querySelector("#drinkStall").innerHTML = message;
}



/*The function displayChosenButton() treats the
  radiobutton group as a node list. It iterates through 
  the node list, checks which one of the radio buttons
  is checked, builds a message accordingly and places
  it in the ouput element named "chosenRadioButton"
*/


function displayChosenRadio() {
    let drinks = document.querySelectorAll("[name=drink]");
    let message = "The chosen radio buton is: ";

    for (count = 0; count < drinks.length; count++) {
        if (drinks[count].checked)
            message = drinks[count].value + " was chosen";
    }
    document.querySelector("#chosenRadioDisplay").innerHTML = message;

}




function displayNonChosenRadio() {
    console.log("Enetered event listener");
    let nonChosenDrinks = document.querySelectorAll("[name=drink]:not(:checked)");
    let message = "The non-chosen drinks were: <Br> ";

    for (count = 0; count < nonChosenDrinks.length; count++) {
        message += nonChosenDrinks[count].value + "<Br>";
    }
    document.querySelector("#nonChosenRadioDisplay").innerHTML = message;

}




function displayContactMethods() {
    let contactMethods = document.querySelectorAll(".ckBox1:checked");
    let message = "The chosen contact methods were: <Br>";
    for (count = 0; count < contactMethods.length; count++)
        message = message + contactMethods[count].value + '<Br>'

    document.querySelector("#contactMethods").innerHTML = message;
}


function uncheckRadioButtons() {
    var drinks = document.querySelectorAll(".radio1");
    for (count = 0; count < drinks.length; count++)
        drinks[count].checked = false;
}



function uncheckCheckboxes() {
    var contactMethods = document.querySelectorAll(".ckBox1");
    for (count = 0; count < contactMethods.length; count++)
        contactMethods[count].checked = false;
}



function displayGradeMessage() {


    let message;
    switch (this.value) {
        case 'A': message = 'Well Above Average';
            break;
        case 'B': message = 'Above Average';
            break;
        case 'C': message = 'Average';
            break;
        case 'D': message = 'Below Average';
            break;
        case 'F': message = 'Failing';
            break;
        default: message = 'Invalid Grade';
            break;
    }
    document.querySelector("#gradeOutput").innerHTML = message;
}



function checkOptions() {
    var drinks = document.querySelectorAll(".radio1");
    var contactMethods = document.querySelectorAll(".ckBox1");
    drinks[1].checked = true;
    contactMethods[0].checked = true;
    contactMethods[1].checked = true;

}

