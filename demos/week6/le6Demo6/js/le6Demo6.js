
onload = function () {
    //Registering the event handlers for the first button   

    document.querySelector("#mybutton1").onclick = changeTextStyle;



    //Using an anonymous function as event handler for the second button
    
    document.querySelector("#mybutton2").onclick = function () {

        var elem = document.querySelector("#mytext3");
        elem.setAttribute("class", "newClass");

    }

}


function changeTextStyle() {
    var elem1 = document.querySelector("#mytext1");
    var elem2 = document.querySelector("#mytext2");

    //Using the style property to set the style of element with id "mytext1"
    elem1.style = "color:blue; font-size:1.5em";

    //Using setAttribute to style th eelemnt with id "mytext2"
    elem2.setAttribute("style", "color:red; font-size:1.5em");
}

