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
    $("#cusId").on("input", function () { GetOrders($("#location").val()); })

});

/**
 * FunctionName:    Welcome
 * Description:     Retrieves Welcome message
 */
function Welcome() {
    CallAJAX("https://localhost:7067/Welcome", "get", "html",
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
    CallAJAX("https://localhost:7067/Location", "post", "json",
        {},
        function (data) {
            console.log(data);
            data.locations.forEach(l => {
                $("#location").append(`<option value="${l}">${l}</option>`);
            });
            $("#location").on("change", function () { GetMenu($(this).val()); })
            $("#location").on("change", function () { GetOrders($(this).val()); })
            $("#location").on("change", function () { GetPaymentMethods($(this).val()); })
        }, ErrorMethod);
}

function GetOrders(location) {
    console.log("In Get Orders")
    var cusId = $("#cusId").val();

    if (location === "") return;

    CallAJAX(`https://localhost:7067/GetOrders/${cusId}/${location}`, "get", "json",
        {},
        function (data) {
            console.log(data);

            if (data.error) {
                $("#order-table-title").html(data.error);
                $("#orders-body").empty();
                $(".data-table").hide();
                // Bring back focus to the customer ID input field
                $("#cusId").focus();
                return;
            }


            $(".data-table").show();
            let tbody = $("#orders-body");
            tbody.empty();


            $("#order-table-title").html(data.message);

            data.orders.forEach(o => {
                let row = `<tr>
                    <td>${o.orderId}</td>
                    <td>${o.orderDate}</td>
                    <td>${o.paymentMethod}</td>
                    <td>${o.itemName}</td>
                    <td>${o.itemPrice}</td>
                    <td>${o.itemCount}</td>
                </tr>`;
                tbody.append(row);
            });
            $(".data-section").show();

        }, ErrorMethod);
}


/**
 * FunctionName:    LoadInfo
 * Description:     Retrieves location and menu info
 */
function GetMenu(location) {
    console.log("In Get Menu")
    if (location === "") return;
    CallAJAX(`https://localhost:7067/Menu/${location}`, "get", "json",
        {},
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
            $("#item").append(`<option disabled selected> Select an item</option> `);
            data.menu.forEach(m => {
                $("#menu").append(`<li> ${m.item}</li> `);
                $("#item").append(`<option value = "${m.price}"> ${m.item}</option>`);
            });
        }, ErrorMethod);
}

function GetPaymentMethods(location) {
    console.log("In Get Payment Methods")
    if (location === "") return;
    CallAJAX(`https://localhost:7067/PaymentMethods/${location}`, "get", "json",
        {},
        function (data) {
            console.log(data);
            $("#payment").empty();
            $("#payment").append(`<option disabled selected> Select a payment method</option>`);

            data.paymentMethods.forEach(p => {
                $("#payment").append(`<option value = "${p}"> ${p}</option>`);
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

    CallAJAX("https://localhost:7067/Order", "post", "json",
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
                $("#order-details").append(`< li > ${o}</li > `);
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