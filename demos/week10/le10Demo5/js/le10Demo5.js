let changeVal=0;

$(function(){

//Initially hide the picture element and 2 buttons
  $("#mypicture").hide();
  $("#changePicture").hide();
  $("#pictureOut").hide();
  




//Picture fades in with a 5 sec (5000 ms) duration
$("#pictureIn").click(function(){
  $("#mypicture").fadeIn(5000);
  $("#changePicture").show();
  $("#pictureOut").show();
  $('#pictureIn').hide();
})
//Picture fades out with a 5 sec (5000 ms) duration
$("#pictureOut").click(function(){
$("#mypicture").fadeOut(5000);
$("#changePicture").hide();
$("#pictureOut").hide();
$('#pictureIn').show();
   })

/*The function changePicture() illustrates the asynchronous nature
  of fadeOut() and fadeIn().
  While we expected the old picture to fade out completely then the new picture
  fades in, this doesn't happen.
  The attribute of the picture changes before the picture fades 
  out
  */
 
$("#changePicture").click(function(){
  if (changeVal==0){
     $("#mypicture").fadeOut(5000);//Asynchronous
     $("#mypicture").prop("src","images/picture2.jpg").fadeIn(5000); 
         changeVal=1;
  } 
  else{
    $("#mypicture").fadeOut(5000);
     $("#mypicture").prop("src","images/picture1.jpg").fadeIn(5000); 
     changeVal=0;
  }
})

$("#changePicture2").click(function(){
  if (changeVal==0){
     $("#mypicture").fadeOut(5000, function(){
     $("#mypicture").prop("src","images/picture2.jpg").fadeIn(5000);}); 
         changeVal=1;
  } 
  else{
    $("#mypicture").fadeOut(5000, function(){
      $("#mypicture").prop("src","images/picture1.jpg").fadeIn();}); 
     changeVal=0;
  }
})

})



