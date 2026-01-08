
let pictureArray = [];//Will store Image() objects

let count = 0; //Will keep trach of current position in the array

let timer = 0;//Will be used for setting and clearing intervals

//We initialize a string to refer to the 
//name of the folder containing the pictures.
let pathname = "images/";

let elem1;

window.onload = () => {


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

    elem1 = document.querySelector("#picture");


    document.querySelector("#displayFirstPicture").onclick = () => {
        //We initialize the image element with the first
        //element in the array
        elem1.src = pictureArray[0].src;
    }

    document.querySelector("#displayNextPicture").onclick = changePicture;
    document.querySelector("#displayPictureOnTimer").onclick = changePictureOnTimer;
    document.querySelector("#stopTimer").onclick = stopTimer;
}



//changPicture() changes the src attribute of the 
//picture element each time it's called
function changePicture() {
    console.log("Count" + count)
    count = (count + 1) % 5;
    elem1.src = pictureArray[count].src;

}

/*changePictureOnTimer()Calls back the function 
changePicture()every 2 seconds. Since 
changePicture() changes the  src attribute of the
picture element each time it’s called,
the function changePictureOnTimer will cause the 
displayed picture to automatically change every 
2 seconds.
*/
function changePictureOnTimer() {
    timer = setInterval(changePicture, 2000);
}

function stopTimer() {
    clearInterval(timer);
}  