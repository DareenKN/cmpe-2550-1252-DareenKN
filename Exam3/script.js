// Remember:  Do NOT modify this template file unless directed to do so.

function AJAX(method, url, dataType, data, successCallback, errorCallback) {

    var options = {};
    options["method"] = method;
    options["url"] = url;
    options["dataType"] = dataType;
    options["data"] = data;
    options["success"] = successCallback;
    options["error"] = errorCallback;
    $.ajax(options);

};

var ajaxURL = "LabExamService.php";
$().ready(function() {

    $("#btnGetTag").click(function(e) {
        var getData = {};
        getData["getTag"] = $("#tagID").val();
        AJAX("GET", ajaxURL, "json", getData, successGetTag, Bad);
    });

    $("#btnManipulateTag").click(function(e) {
        var postData = {};
        postData["tagManipID"] = $("#tagIDManip").val();
        postData["tagManipOP"] = $("input[name='rTagManip']:checked").val();
        AJAX("POST", ajaxURL, "json", postData, successManipulateTag, Bad);
    });
});

// Success callback functions
function successGetTag(returnedData) {
    $("#tbodyGetTag").html(returnedData["getTag"]);
}

function successManipulateTag(returnedData) {
    console.log(returnedData);
    $("#divManipulateTag").html(returnedData["ManipulateTagResponse"]);
}

// Shared error callback function
function Bad(d, s) {
    console.log(d);
    console.log(s);
}