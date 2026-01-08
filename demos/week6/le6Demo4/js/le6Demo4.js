

onload = function(){
    document.querySelector("#mybutton1").onclick = buildParagraph
    document.querySelector("#mybutton2").onclick = buildSection 
    document.querySelector("#mybutton3").onclick = buildBigSection 
}

function buildParagraph(){
    let str = "<p> First Paragraph </p>"
    document.querySelector("#placeHolder1").innerHTML = str
}



function buildSection() {
    let str = "";
    str = "<section id='newSection'>"
    str = str + "<p> Hello Friends - How are you? <\p>";
    str = str + "<p>This is Exiting<\p>";
    str = str + "</section>";
    let elem = document.querySelector("#placeHolder2");
    elem.innerHTML = str;
}



function buildBigSection() {
    let str = "";
    let counter = 0;
    str = "<section>"

    while (counter < 10) {
        str = str + "<p> paragraph " + (counter + 1) + "</p>";
        counter++;
    }

    str = str + "</section>";
    let elem = document.getElementById("placeHolder3");
    elem.innerHTML = str;
}

