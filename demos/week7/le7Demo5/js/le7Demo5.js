
//lecture7-Demo5.js- Iterating through an array of elements using forEach() method


onload = () => {
  document.querySelector("#changeColors").onclick = changeColors;

}


function changeColors() {
  let tdList = document.querySelectorAll("td");

  tdList.forEach((item, index) => {

    if (index % 2 == 0)
      item.style.setProperty("background-color", "blue");
    else
      item.style.setProperty("background-color", "green");

  });

}
