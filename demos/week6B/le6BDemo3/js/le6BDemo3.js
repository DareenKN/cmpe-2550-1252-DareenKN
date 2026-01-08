
onload=()=>{
     document.querySelector("#organizeButton").onclick=positionElements;
}




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