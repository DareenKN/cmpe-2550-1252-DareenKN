//Registering the event handler
$(function () {
    $('#button1').click(processAjaxCall)
});

function processAjaxCall() {
    let myurl = 'https://thor.cnt.sast.ca/~dkinganjatou1251/CMPE2000/demos/week11/week11/le11Demo2/week11A.php';
    
    $.ajax({
        url: myurl,
        type: "GET",
        dataType: "json",
        success: function (result, status) //Anonymous callback for on successful completion
        {
            console.log("successful completion");
            console.log("result", result);
            $("#placeHolder").html("Name: " + result["name"] + "  Address:" + result.address);
        },
        error: function (xhr, ajaxOptions, thrownError) //Anonymous callback on error
        {
            alert("error returned");
            console.log(xhr.status);
            console.log(thrownError);
        }
    });
}   
