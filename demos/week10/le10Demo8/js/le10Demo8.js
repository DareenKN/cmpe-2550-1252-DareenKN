$(function(){
$("#mybutton").on("click",function(e){
  alert("Element is: "+e.target+", PageX: "+e.pageX+", pageY:"+ e.pageY);
 e.target.style.color="red";
 e.target.style.backgroundColor="blue";

});

});



  