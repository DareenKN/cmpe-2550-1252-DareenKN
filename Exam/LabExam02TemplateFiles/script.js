// Remember:  Do NOT modify this template file except where directed to do so

// Note: Examine the HTML in the index.php file and the JS below to see what is being sent to the server


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

var ajaxURL = "service.php";
$().ready(function () {

    $("#btnPartA").click(function (e) {
        var getData = {};
        getData["partA"] = $("#tagFilter").val();
        AJAX("GET", ajaxURL, "json", getData, successPartA, Bad);
    });

    $("#btnPartB").click(function (e) {
        var getData = {};
        getData["partB"] = $("#tagIDFilter").val();
        console.log(getData)
        AJAX("POST", ajaxURL, "json", getData, successPartB, Bad);
    });

});

// Success callback functions
function successPartA(returnedData) {
    console.log(returnedData);

    $("#divPartA").html(returnedData["partA"]);
}

function successPartB(returnedData) {

    let tbody = $("#tbodyPartB");
    tbody.empty();

    console.log(returnedData);


    // If no titles returned, show message and hide table
    if (!returnedData.titles || returnedData.titles.length === 0) {
        return;
    }
    // Populate titles table
    $('#error_status').empty();
    $('.data-section').show();

    returnedData.titles.forEach(tag => {

        let row = `<tr>
                <td>${tag[0]}</td>
                <td>${tag[2]}</td>
                <td>${tag[3]}</td>
                <td>${(tag[3] - tag[2]) * (tag[3] - tag[2])}</td>
            </tr>`;

        tbody.append(row);
    });

    // Your table must be completed here.  Remember to examine the HTML so you know what to add in.  CSS has been completed for you.
}


// Shared error callback function
function Bad(d, s) {
    console.log(d);
    console.log(s);
}