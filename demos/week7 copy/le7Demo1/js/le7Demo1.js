/* Javascript file week7_1.js
   written by Oveeyen Moonian on 16 February 2022
   The functions in this file are being called from
   the HTML file week7demo1/index.html */

//We first register the different event handlers
onload = function () {
    this.document.querySelector("#displayDrinkBtn").onclick = displayDrinkStall;
    this.document.querySelector("#chosenRadioBtn").onclick = displayChosenRadio;
    this.document.querySelector("#nonChosenRadioBtn").onclick = displayNonChosenRadio;
    this.document.querySelector("#displayContactBtn").onclick = displayContactMethods;
    this.document.querySelector("#Grade").onchange = displayGradeMessage;
    this.document.querySelector("#uncheckRadioBtn").onclick = uncheckRadioButtons;
    this.document.querySelector("#uncheckCheckBoxesBtn").onclick = uncheckCheckboxes;
    this.document.querySelector("#checkOptionsBtn").onclick = checkOptions;

}


/*Function displayDrinkStall() accesses the radiobutton group
named "drink". It checks which one of the buttons
is checked (through the value assigned to the name "drink") 
and accordingly places a message in the output element of the form*/
function displayDrinkStall() {
    let chosenDrink = document.querySelector(".radio1:checked")
    let message;

    switch (chosenDrink.value) {
        case 'Coffee': message = "great"; break;
        case 'Tea': message = "okay"; break;
        case 'Juice': message = "Nice"; break;
    }
    document.querySelector("#drinkStall").innerHTML = message;
}

function displayChosenRadio() {
    let drinks = document.querySelectorAll(".radio1");
    let message = "The chosen radio button is: ";

    for (i = 0; i < drinks.length; i++) {
        if (drinks[i].checked)
            message += drinks[i].value
    }
    document.querySelector("#chosenRadioDisplay").innerHTML = message
}

function displayNonChosenRadio() {
    let drinks = document.querySelectorAll(".radio1");
    let message = "The NON chosen radio button were: <br>";

    for (i = 0; i < drinks.length; i++) {
        if (!(drinks[i].checked))
            message += drinks[i].value + "<br>"
    }
    document.querySelector("#nonChosenRadioDisplay").innerHTML = message
}

function displayContactMethods() {
    let contactMethods = document.querySelectorAll("[type=checkbox]")
    let message = "The chosen contact methods were: <br>"

    for (i = 0; i < contactMethods.length; i++) {
        if (contactMethods[i].checked)
            message += contactMethods[i].value + "<br>"
    }
    document.querySelector("#contactMethods").innerHTML = message
}

function uncheckRadioButtons() {
    let radios = document.querySelectorAll("[type=radio]")

    for (i = 0; i < radios.length; i++)
        radios[i].checked = false
}

function uncheckCheckboxes() {
    let checkbox = document.querySelectorAll("[type=checkbox]")

    for (i = 0; i < checkbox.length; i++)
        checkbox[i].checked = false
}

function checkOptions() {
    let checkbox = document.querySelectorAll("[type=checkbox]")
    let radio = document.querySelectorAll("[type=radio]")

    for (i = 0; i < checkbox.length; i++) {
        checkbox[0].checked = true
        checkbox[1].checked = true
    }

    for (i = 0; i < radio.length; i++)
        radio[1].checked = true
}

function displayGradeMessage(){
    let message;

    switch(this.value){
        case 'A': message = "Gooooooood"; break;
        case 'D': message = "Purfection"; break;
    }

    document.querySelector("#gradeOutput").innerHTML = message
}