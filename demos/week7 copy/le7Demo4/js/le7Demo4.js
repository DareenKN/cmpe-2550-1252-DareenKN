
//le7Demo4.js- Illustrating different ways to 

window.onload = () => {


    //Binding an event handler to all radio buttons with the name "contact"
    let elem = document.querySelectorAll("[name=contact]");
    for (i = 0; i < elem.length; i++)
        elem[i].onclick = DisplayContactMethod;


    //Binding an event handler to all radio buttons with name beverage. This time we'll use the forEach() method
    let elem1 = document.querySelectorAll("[name=beverage]");
    elem1.forEach(beverageClickAction);


    //Using an arrow function as parameter to the forEach method, for binding the radio buttons with name sport 
    //to the event handler

    document.querySelectorAll("[name==sport]").forEach((item) => {
        item.onclick = DisplayPreferredSport;

    }
    )



}



function DisplayContactMethod() {

    document.querySelector("#preferredContact").innerHTML = "The preferred contact method is: " + this.value;
}


//This function performs the binding of the event handler for each of the beverage radio buttons
function beverageClickAction(item) {
    item.onclick = DisplayPreferredBeverage;
}


//Event handler for the beverage Radio buttons

function DisplayPreferredBeverage() {

    document.querySelector("#preferredBeverage").innerHTML = "The preferred beverage is: " + this.value;
}

//Event handler for the sport Radio buttons

function DisplayPreferredSport() {

    document.querySelector("#preferredSport").innerHTML = "The preferred sport is: " + this.value;
}

