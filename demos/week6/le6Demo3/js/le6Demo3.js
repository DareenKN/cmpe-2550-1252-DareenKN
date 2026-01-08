/*le6Demo3.js
   Author: Oveeyen Moonian
   Date: February 14, 2022
  This Javascript file is used together with le6Demo3.html

*/



//The Window.onload is assigned an anonymous function.
//We register all event handlers through this function

onload = function(){
   document.querySelector("#mybutton1").onclick = setTextPar1
   document.querySelector("#mybutton2").onclick = setTextPar2
   document.querySelector("#mybutton3").onclick =  setTextAny
}

function setTextPar1(){
    let p = document.querySelector("#p1")
    let str = prompt("Give the string you want for paragraph 1", "none")
    p.innerHTML = str
}

function setTextPar2(){
    let p = document.querySelector("#p2")
    let str = prompt("Give the string you want for paragraph 2", "none")
    p.innerHTML = str
}

function setTextAny() {
    var str = prompt("give the paragraph number", "3");
    if (isNaN(str)) {
        alert("The value input is not valid");
    } else {
        var num = parseInt(str);
        if ( num < 0 || num > 4){
            alert("Invalid input, not in range")
            return
        }
        var elem = document.querySelector("#p" + num);
        var str1 = prompt("give the string you want to display", "None");
        elem.innerHTML = str1;
    }
}
