/**
 * CMPE2550 – ICA 11 – ASP
 * Name: Dareen Kinga Njatou
 * script.js
 * Description: JavaScript file 
 * Date: February 05, 2026
*/

$(document).ready(function () {
    console.log("On page onload");
    $("#error").hide();
    $(".data-section").hide();
    $(".order-box").hide();
    $(".order").hide();
    Welcome();
    LoadInfo();

    $("#place-order").click(ProcessOrder);
    $("#cusId").on("input", function () { GetOrders($("#location").val(), $(this).val()); })

});

/**
 * FunctionName:    Welcome
 * Description:     Retrieves Welcome message
 */
function Welcome() {
    CallAJAX("https://localhost:7001/Welcome", "get", "html",
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
    CallAJAX("https://localhost:7001/Location", "post", "json",
        {},
        function (data) {
            console.log(data);
            data.locations.forEach(l => {
                $("#location").append(`<option value="${l}">${l}</option>`);
            });
            $("#location").on("change", function () { GetMenu($(this).val()); })
            $("#location").on("change", function () { GetOrders($(this).val(), $("#cusId").val()); })
            $("#location").on("change", function () { GetPaymentMethods($(this).val()); })
        }, ErrorMethod);
}

function GetOrders(location, cusId) {
    console.log("In Get Orders")
    console.log("Location:", location, "Customer ID:", cusId);
    if (cusId === "") {
        $("#error").show()
        $("#error").removeClass("success")
            .addClass("error")
            .html("Please enter a Customer ID.");
        $("#orders-body").empty();
        $(".data-table").hide();
        // Bring back focus to the customer ID input field
        $("#cusId").focus();
        return;
    }

    if (location === "") return;

    CallAJAX(`https://localhost:7001/GetOrders/${cusId}/${location}`, "get", "json",
        {},
        function (data) {
            console.log(data);

            if (data.error) {
                $("#error").show()
                $("#error").removeClass("success")
                    .addClass("error")
                    .html(data.error);
                $("#orders-body").empty();
                $(".data-table").hide();
                // Bring back focus to the customer ID input field
                $("#cusId").focus();
                return;
            }
            $("#error").hide();
            $("#error").empty();
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
                    // Add a delete button for each order
                    <td><button class="delete-btn" data-order-id="${o.orderId}" onclick="DeleteOrder(${o.orderId})">Delete</button></td>
                </tr>`;
                tbody.append(row);
            });
            $(".data-section").show();

        }, ErrorMethod);
}


function DeleteOrder(orderId) {
    console.log("In Delete Order", orderId);
    CallAJAX(`https://localhost:7001/DeleteOrder/${orderId}`, "delete", "json",
        {},
        function (data) {
            console.log(data);
            if (data.error) {
                $("#error").show()
                $("#error").removeClass("success")
                    .addClass("error")
                    .html(data.error);
                return;
            }
            $("#error").show()
                .removeClass("error")
                .addClass("success")
                .html(data.message);
            // Refresh the orders list after deletion
            GetOrders($("#location").val());
        }, ErrorMethod);
}

/**
 * FunctionName:    LoadInfo
 * Description:     Retrieves location and menu info
 */
function GetMenu(location) {
    console.log("In Get Menu")
    if (location === "") return;
    CallAJAX(`https://localhost:7001/Menu/${location}`, "get", "json",
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
                $("#item").append(`<option value = "${m.item}"> ${m.item}</option>`);
            });
        }, ErrorMethod);
}

function GetPaymentMethods(location) {
    console.log("In Get Payment Methods")
    if (location === "") return;
    CallAJAX(`https://localhost:7001/PaymentMethods/${location}`, "get", "json",
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
    data1 = {};

    data1.location = $("#location").val();
    data1.Cid = parseInt($("#cusId2").val());
    data1.item = $("#item").val();
    data1.itemsNum = $("#quantity").val();
    data1.payment = $("#payment").val();

    console.log(data1);

    CallAJAX("https://localhost:7001/Order", "post", "json",
        data1,
        function (data) {
            console.log(data);

            $("#order_status").empty();
            $("#order-details").empty();

            if (data.error) {
                $("#order_status").show()
                $("#order_status").removeClass("success")
                    .addClass("error")
                    .html(data.error);
                return;
            }

            data.order.forEach(o => {
                $("#order-details").append(`<li> ${o}</li>`);
            });

            $("#order_status").removeClass("error")
                .addClass("success")
                .html(data.time);
            GetOrders(data1.location, data1.Cid);
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