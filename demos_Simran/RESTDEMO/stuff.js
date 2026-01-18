$(document).ready(function() {

    $("#testGET").click(TestGET);
    $("#testPOST").click(TestPOST);
    $("#testPUT").click(TestPUT);
    $("#testDELETE").click(TestDELETE);

});


// HTTP/1.1 methods:    POST    GET        PUT      DELETE
// CRUD Operation:      Create  Retrieve   Update   Delete
// SQL Operation:       insert  select     update   delete

function TestDELETE() {

    var getData = {};
    getData["DELETEtest"] = "My Test DELETE data.";

    var options = {};
    options["method"] = "DELETE";
    options["url"] = "Rest/example1/place/10/";
    options["dataType"] = "json";
    options["data"] = getData;
    options["success"] = successCallback;
    options["error"] = errorCallback;
    $.ajax(options);

};

function TestPUT() {

    var getData = {};
    getData["PUTtest"] = "My Test PUT data.";

    var options = {};
    options["method"] = "PUT";
    options["url"] = "Rest/example/place/20";
    options["dataType"] = "json";
    options["data"] = getData;
    options["success"] = successCallback;
    options["error"] = errorCallback;
    $.ajax(options);

};

function TestPOST() {

    var getData = {};
    getData["POSTtest"] = "This is data in the POST object.";

    var options = {};
    options["method"] = "POST";
    options["url"] = "Rest/example/place/30";
    options["dataType"] = "json";
    options["data"] = getData;
    options["success"] = successCallback;
    options["error"] = errorCallback;
    $.ajax(options);

};

function TestGET() {

    var getData = {};
    getData["GETtest"] = "This is data in the GET object.";

    var options = {};
    options["method"] = "GET";
    options["url"] = "Rest/example/place/40";
    options["dataType"] = "json";
    options["data"] = getData;
    options["success"] = successCallback;
    options["error"] = errorCallback;
    $.ajax(options);

};



function successCallback(returnedData) {

    console.log(returnedData);
    $("#output").html(returnedData);
};



function errorCallback(jqObject, returnedStatus, errorThrown) {
    console.log(returnedStatus + " : " + errorThrown);


};