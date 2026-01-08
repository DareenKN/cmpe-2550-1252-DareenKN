


$(() => {
    
    
    //onclick event handler for the button with id "changeStyle"
    $("#changeStyle").click(function () {
        $(".newStyle").css("color", "red");
        $(".newStyle").css("font-size", "1.5em");
        console.log("my value " + $("#changeStyle").val());
    });


    $("#mypicture").hide();
    $("#changePicture").hide();

});