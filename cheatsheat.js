
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

var elem = document.querySelector("#p" + num);


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

function addParagraph(){
    let newElement = document.createElement("p")

    let text = prompt("Input a text")
    newElement.append(text)
    newElement.setAttribute("id","myParagraph")

    let parentElement = document.querySelector("#placeHolder")
    parentElement.append(newElement)

}


function RemoveParagraph(){
    let node = document.querySelector("#myParagraph")
    if(node != null)
        node.remove()
}

let str = " Bla bla bla"
    console.log("str size:" + str.length)
    let sliceStr = str.slice(1,4)
    let subStr = str.substring(1, 4)
    console.log("SubString: " + subStr)
    console.log("SliceString: " + sliceStr)


function positionElements(){
   let nodeList=document.querySelectorAll("section");

    for (let count=0; count<nodeList.length; count++){
       let posnStr=nodeList[count].getAttribute("position");
       let rowNo=parseInt(posnStr.substring(0,2));
       let colNo=parseInt(posnStr.substring(2,4));
       nodeList[count].style.setProperty("grid-row",`${rowNo}/${rowNo+1}`);
       nodeList[count].style.setProperty("grid-column",`${colNo}/${colNo+1}`);

    }
}

let toggle = 0
let elem = document.createElement("p")

onload=()=>{
   elem.append("This is a moving text")
   elem.setAttribute("id","myParagraph")
   document.querySelector("#organizeButton").onclick=positionElements;
   document.querySelector("#moveElement").onclick= ()=>{
      let parent = document.querySelector("#section" + toggle)
      parent.append(elem)

      if(toggle == 1)
         toggle = 0
      else{
         toggle = 1
      }
   }

}

function validate() {
  alert("Hi!- Performing Form Validation");
  var elem = document.querySelector("[name=firstName]");
  if (elem.value == "") {
    alert("First Name Cannot be Null");
    return false;
  }
  alert("Valid Value");
  return true;

}


function adjustImageHeight() {
  let elem = document.querySelector("#country");
  let elemStyle = window.getComputedStyle(elem);
  let elemHeight = elemStyle.getPropertyValue("height");
  let myImage = document.querySelector("#myPic");
  myImage.setAttribute("height", elemHeight);
}

//We are here preloading the pictures and placing them in the pictureArray variable
    document.querySelector("#preloadPictures").onclick = () => {
        for (i = 1; i <= 5; i++) {
            //since the pictures are called picture1.jpg,
            //picture2.jpg etc. it's easy to dynamiccally build the
            //full path name.
            var imagename = pathname + "picture" + i + ".jpg";
            var myImage = new Image();
            myImage.src = imagename;
            pictureArray.push(myImage);
        }
    }