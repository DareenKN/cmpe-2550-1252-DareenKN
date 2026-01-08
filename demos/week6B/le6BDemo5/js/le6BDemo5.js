
let timer;
let timeout
let display = 0;


window.onload = () => {
    document.querySelector("#timerDisplayBtn").onclick=()=>{
        console.log("random: " + ((Math.random())))
     timer = setInterval(DisplayPicOnTimer,1000);
        timeout = setTimeout(clearInterval, 5000, timer )
        timeout = setTimeout(()=>{
            console.log("5 seconds have passed, clearing timer")
            clearInterval(timer)
        }, 5000)
   }

    document.querySelector("#timerClearBtn").onclick= ()=> {
        clearInterval(timer)
    }
}



function addPicture() {
    let parentElem = document.querySelector("#imageHolder");
    let newElem = document.createElement("img");
    newElem.setAttribute("src", "images/bird1.jfif");
    newElem.setAttribute("id", "myPic");
    parentElem.append(newElem);
}

function RemovePicture() {
    var reqNode = document.querySelector("#myPic");
    if (reqNode)
        reqNode.remove();
}

function DisplayPicOnTimer() {
    if (display == 0) {
        addPicture()
        display = 1;
    }
    else {
        RemovePicture();
        display = 0;
    }

}
