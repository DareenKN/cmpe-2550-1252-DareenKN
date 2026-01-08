/*
CMPE 2000 - Winter 2022

Javascript file for week9-demo1

This demo illustrates the different ways we can handle substrings in Javascript

The file is used by the index.html of week9-demo1

*/

window.onload = () => {

    //The Arrow function provided here is an onclick event handler for the button with id "button1"
    //The purpose of the event handler is to display the substring between positions 0 and 3 inclusive 
    //of the string with id "paragraph1"
    //Since we want position 3 included - We have to take the substring(0,4)
    document.querySelector("#button1").onclick = () => {
        let str = document.querySelector("#paragraph1").innerHTML;
        alert("The substring between positions 0 and 3 (inclusive): " + str.substring(0, 4));
    }



    //The Arrow function provided here is an onclick event handler for the button with id "button2"
    //The purpose of the event handler is to display the substring between positions 4 and 7 (inclusive)
    //of the string with id "paragraph1"- Since we also want positin 7, we take the substring(0,8)
    document.querySelector("#button2").onclick = () => {
        let str = document.querySelector("#paragraph1").innerHTML;
        alert("The substring between positions 4 and 7 (inclusive): " + str.substring(4, 8));

    }


    //The onclick event handler for the button with id "button3" is the named function 
    //DisplaySelected substring. The way the function works is explained in the comment block preceeding
    //the function
    document.querySelector("#button3").onclick = DisplaySelectedSubstring;


}


/*The function DisplaySelectedSubstring_1 allows the user to input 2 
positions for the string with id "paragraph1" in the html and displays the substring
For simplicity, no validation is being performed here. It's assumed that the user
will input valid numerical values within the range of positions of the string
*/

function DisplaySelectedSubstring() {

    let p1 = prompt("Give the starting position for the substring", "0");
    let p2 = prompt("Give the last position for the substring", "0");
    let posn1 = parseInt(p1);
    let posn2 = parseInt(p2);
    let str = document.querySelector("#paragraph1").innerHTML;
    //In the alert() method below, we use the back-tick ` ` instead of quote " ". This allows
    //us to create a template string and use ${} to embed variables or expressions
    alert(`The substring between positions ${posn1} and ${posn2} (inclusive): ${str.substring(posn1, posn2 + 1)}`);
}
