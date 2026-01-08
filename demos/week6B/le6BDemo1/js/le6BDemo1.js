


window.onload = ()=>{

   document.querySelector("#button1").onclick = addParagraph;
    document.querySelector("#button2").onclick = RemoveParagraph;
    document.querySelector("#button3").onclick = ()=>{
        let parent = document.querySelector("#imageHolder")
        let image = document.createElement("img")
        image.setAttribute("src","images/bird1.jfif")
        image.setAttribute("id","myImage")

        parent.append(image)
    };
    document.querySelector("#button4").onclick = ()=>{
        let image = document.querySelector("#myImage")
        if(image != null)
            image.remove()
    };

    let str = " Bla bla bla"
    console.log("str size:" + str.length)
    let sliceStr = str.slice(1,4)
    let subStr = str.substring(1, 4)
    console.log("SubString: " + subStr)
    console.log("SliceString: " + sliceStr)
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


/* The function addParagraph creates a paragraph element, creates a text node, adds the text node to the paragraph element, then adds the paragraph to the element with id placeholder*/







/* The function addPicture creates an img element, sets its src attribute to a provided image file and also set an id attribute for the element*/




