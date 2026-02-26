/**
 * CMPE2550 – Demo06
 * Name: Dareen Kinga Njatou
 * Date: February 05, 2026
 */

$(document).ready(function () {
    
    $("#getSubmit").click(GetPost);
    $("#postSubmit").click(PostTest);

});

// Event delegation for dynamically created buttons
//$(document).on('click', '.btn-retrieve', GetTitlesByAuthor);

/** 
*FunctionName:    CallAJAX
*Description:     Generic AJAX call function 
*/
function CallAJAX(url, method, dataType, data, successMethod, errorMethod) {
    let options = {};

    options.url = url;
    options.method = method;

    if (method == "get") options.data = data;
    else if (method == "post") {
        options.data = JSON.stringify(data);
        options.contentType = "application/json";
    }
    options.dataType = dataType;
    options.success = successMethod;
    options.error = errorMethod;

    $.ajax(options);
}

function GetPost() {
    let data = {}
    data.name = $("#name").val();
    data.color = $("#color").val();
    data.age = $("#age").val()

    CallAJAX("https://localhost:7195/register", "get", "html", data,
        function (returnedData) {
            console.log(returnedData);
            $("#output").html(returnedData)
        },
        ErrorMethod
    )
}

function PostTest() {
    let data = {}
    data.name = $("#name").val();
    data.color = $("#color").val();
    data.age = $("#age").val()

    CallAJAX("https://localhost:7195/registerPost", "post", "json", data,
        function (returnedData) {
            console.log(returnedData);
            $("#output").html(returnedData.output)
        },
        ErrorMethod
    )
}

/**
 * FunctionName:    hasError
 * Description:     Checks if returned data contains an error
 * Inputs:          data - Data returned from AJAX call
 * Outputs:         true if error exists, false otherwise
 */
function hasError(data) {
    if (data.error) {
        $('#book-status').html(data.error);
        return true;
    }
    return false;
}


/**
 * FunctionName:    ErrorMethod
 * Description:     Generic error method for AJAX calls
 */
function ErrorMethod(req, status, error) {
    console.log("AJAX ERROR", status, error);
    console.log(req);

    $('#status').html(`An error occurred.`);
}
