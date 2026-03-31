/**
 * CMPE2550 – ICA 06 – ASP
 * Name: Dareen Kinga Njatou
 * script.js
 * Description: JavaScript file 
 * Date: February 05, 2026
 */

$(document).ready(function () {
    console.log("On page onload");
    $(".order-box").hide();
    $(".order").hide();
    Welcome();
    LoadInfo();
    $("#place-order").click(ProcessOrder);
});

/**
 * FunctionName:    Welcome
 * Description:     Retrieves Welcome message
 */
function Welcome() {
    CallAJAX("https://localhost:7137/Welcome", "get", "html",
        {},
        function (data) {
            console.log(data);
            $('#welcome-message').html(data);
        }, ErrorMethod);
}

/**
 * FunctionName:    LoadInfo
 * Description:     Retrieves location and menu info
 */
function LoadInfo() {
    CallAJAX("https://localhost:7137/Location", "post", "json",
        {},
        function (data) {
            console.log(data);
            data.locations.forEach(l => {
                $("#location").append(`<option value="${l}">${l}</option>`);
            });
            $("#location").on("change", function () { GetMenu($(this).val()); })
        }, ErrorMethod);
}

/**
 * FunctionName:    LoadInfo
 * Description:     Retrieves location and menu info
 */
function GetMenu(location) {
    console.log("In Get Menu")
    CallAJAX("https://localhost:7137/Menu", "post", "json",
        { location: location },
        function (data) {
            console.log(data);
            $("#menu").empty();
            $("#message").empty();
            $("#item").empty();
            $(".order-box").hide();
            $(".order").hide();

            // if (location == $("#location option:first").val())
            //     return;

            if (!location)
                return;

            if (data.menu.length === 0) {
                $("#menu-title").html(data.message);
                return;
            }
            $(".order-box").show();
            $(".order").show();
            $("#menu-title").html(data.message);
            $("#item").append(`<option disabled selected>Select an item</option>`);
            data.menu[location].forEach(m => {
                $("#menu").append(`<li>${m}</li>`);
                item = m.split(":")[0].trim();
                $("#item").append(`<option value="${m}">${item}</option>`);
            });
        }, ErrorMethod);
}

function ProcessOrder() {
    data = {};

    data.location = $("#location").val();
    data.name = $("#name").val();
    data.item = $("#item").val();
    data.itemsNum = $("#quantity").val();
    data.payment = $("#payment").val();

    console.log(data);

    CallAJAX("https://localhost:7137/Order", "post", "json",
        data,
        function (data) {
            console.log(data);

            $("#order_status").empty();
            $("#order-details").empty();            

            if (data.message) {
                $("#order_status").html(data.message);
                return;
            }

            data.order.forEach(o => {
                $("#order-details").append(`<li>${o}</li>`);
            });

            $("#time").html(data.time);


        }, ErrorMethod);
}

// Event delegation for dynamically created buttons
//$(document).on('click', '.btn-retrieve', GetTitlesByAuthor);



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

/** 
*FunctionName:    CallAJAX
*Description:     Generic AJAX call function 
*/
function CallAJAX(serverURL, reqMethod, serverResponse, data, successHandler, errorHandler) {
    console.log("Inside MakeAjaxCall function ");

    let ajaxOptions = {};
    ajaxOptions['url'] = serverURL;                // Destination URL
    ajaxOptions['type'] = reqMethod;               // GET/POST
    ajaxOptions['dataType'] = serverResponse;      // HTML/JSON 
    ajaxOptions['data'] = JSON.stringify(data);    // Client data   -- NEW for ASP PART
    ajaxOptions['success'] = successHandler;       // Callback function to handle successful case
    ajaxOptions['error'] = errorHandler;           // Callback function to handle error 

    ajaxOptions['contentType'] = "application/json"; // NEW for ASP PART

    // actually make ajax call
    $.ajax(ajaxOptions);

}