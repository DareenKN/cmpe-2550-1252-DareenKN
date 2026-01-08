
onload = function(){
    document.querySelector("#mybutton1").onclick = buildTable
    document.querySelector("#myRange").onchange = displayRangeValue 
    document.querySelector("#mybutton2").onclick = addStyling 
}

// ID Styling will conflict with class styling
function displayRangeValue(){
    console.log("this: " + this)
    document.querySelector("#rangeValue").innerHTML = "Range Value: " + this.value
    document.querySelector("#rangeValue").style.color = "blue" 
    document.querySelector("#rangeValue").style.fontSize = "1.5em" 
}

function addStyling(){
    let element = document.querySelector("#rangeValue")
    element.setAttribute("class","newClass")
    element.classList.add("newClass")
}

function buildTable(){
    let str = ""
    str += "<table>"
    str += "<tr> <th> Day </th> <th> Min Temp </th> <th> Max Temp </th> </tr>"
    str += "<tr> <td> Monday </td> <td> -7 </td> <td> -1 </td> </tr>"
    str += "<tr> <td> Tuesday </td> <td> -7 </td> <td> -1 </td> </tr>"
    str += "</table>"
    document.querySelector("#tablePlaceHolder").innerHTML = str
}