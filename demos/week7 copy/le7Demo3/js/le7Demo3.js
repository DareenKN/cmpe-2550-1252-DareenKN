/*le7Demo3.js
   Author: Oveeyen Moonian
   Date: 28 February 2022

   This file is used to demonstrate how we can dynamically add a picture to an image element
   and also how we can dynamically style an element to the same style as another element

*/

onload = () => {

  document.querySelector("#adjustImage").onclick = adjustImageHeight;
  document.querySelector("#addPicBtn").onclick = addPicture;

}


/*
  This function sets the height of the img element with id 
  to be the same as that of the element with id 
*/


function adjustImageHeight() {
  let elem = document.querySelector("#country");
  let elemStyle = window.getComputedStyle(elem);
  let elemHeight = elemStyle.getPropertyValue("height");
  let myImage = document.querySelector("#myPic");
  myImage.setAttribute("height", elemHeight);
}


/*This function adds a picture to an image element by setting its src attribute*/

function addPicture() {
  let myImage = document.querySelector("#pic2");
  myImage.setAttribute("src", "images/AmericanNaked.jpg");
  myImage.src = "images/AmericanNaked.jpg";
}

