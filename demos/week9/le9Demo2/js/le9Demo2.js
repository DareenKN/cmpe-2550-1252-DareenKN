
/*

let pictureArray = [];
let picCaptions = ["Traffalgar Square", "Believe It Or Not", "Tower Bridge", "Buckinggham Palace", "The Cruise"]
let count = 0;
let timer = 0;
*/

window.onload = function () {



    //   document.querySelector("#changePicture").onclick = changePicture;
    //  document.querySelector("#displayOnTimer").onclick = changePictureOnTimer;
    //  document.querySelector("#stopTimer").onclick = stopTimer;
    //   createPictureArray();

}

/*
function PicObject(caption) {

    this.caption = caption;
    this.Pic = new Image();

}

PicObject.prototype.assignSource = function (picname) {
    this.Pic.src = picname;
}

function createPictureArray() {

    //We initialize a string to refer to the 
    //name of the folder containing the pictures.
    let pathname = "images/";

    for (i = 1; i <= 5; i++) {
        //since the pictures are called picture1.jpg,
        //picture2.jpg etc. it's easy to dynamically build the
        //full path name.

        let imagename = pathname + "picture" + i + ".jpg";
        let newPic = new PicObject(picCaptions[i - 1]);
        newPic.assignSource(imagename);
        pictureArray.push(newPic);


    }
    let elem1 = document.querySelector("#picture");
    //We initialize the image element with the first
    //element in the array
    elem1.setAttribute("src", pictureArray[0].Pic.src);
    let elem2 = document.querySelector("#figureCaption");
    elem2.innerHTML = pictureArray[0].caption;

}



//changPicture() changes the src attribute of the 
//picture element each time it's called
function changePicture() {
    count = (count + 1) % (pictureArray.length);
    let elem1 = document.querySelector("#picture");
    elem1.setAttribute("src", pictureArray[count].Pic.src);
    let elem2 = document.querySelector("#figureCaption");
    elem2.innerHTML = pictureArray[count].caption;


}
*/
/*changePictureOnTimer()Calls back the function changePicture()every 2 seconds. Since 
changePicture() changes the  src attribute of the picture element each time it’s called,
the function changePictureOnTimer will cause the displayed picture to automatically change every 
2 seconds.
The syntax of the setInterval is:<TimerVariable>= setInterval(<function>,<time in ms>)
*/

/*
function changePictureOnTimer() {
    timer = setInterval(changePicture, 2000);
}

function stopTimer() {
    clearInterval(timer);
}
*/