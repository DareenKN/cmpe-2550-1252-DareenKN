


onload = function(){
document.querySelector("#test").onclick = modifyText
}

function inputName() {
    var myname;
    myname = window.prompt('Input Your Name', "No Name");
    if (isNaN(myname))
        alert("Name input was;  " + myname);
    else
        alert("You were asked for a name, but you gave a number")
}


/*We note that if we try to access the "this" object from this function, 
    "this" refers to the window rather than the button*/
function modifyText() {
    var str, previousprompt;
    console.log("this=", this);

    previousPrompt = this.innerHTML;
    str = prompt("Give the new text", previousPrompt);
    this.innerHTML = str;
}
