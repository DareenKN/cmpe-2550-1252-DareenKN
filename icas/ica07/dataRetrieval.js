/**
 * CMPE2550 – ICA 05 – MySQL Data Manipulation via AJAX
 * Name: Dareen Kinga Njatou
 * dataRetrieval.js
 * Description: JavaScript file to retrieve authors and their books from MySQL database via AJAX
 * Date: February 05, 2026
 */

let currentAuthorId = null;
let edited_title_id = null;
let originalRowData = {};

$(document).ready(function () {
    $('.data-section').hide();
    GetAllAuthors();
    AddTypesForm();
    LoadAuthors();
});


/**
 * FunctionName:    GetAllAuthors
 * Description:     Retrieves all authors from the database via AJAX call
 */
function GetAllAuthors() {
    CallAJAX("service.php", "get", "json",
        { action: "GetAllAuthors" },
        GetAllAuthorsSuccess, ErrorMethod);
}

// Event delegation for dynamically created buttons
//$(document).on('click', '.btn-retrieve', GetTitlesByAuthor);

/** 
*FunctionName:    CallAJAX
*Description:     Generic AJAX call function 
*/
function CallAJAX(url, method, dataType, data, successMethod, errorMethod) {
    $.ajax({ url: url, method: method, dataType: dataType, data: data, success: successMethod, error: errorMethod });
}



/**
 * FunctionName:    GetTitlesByAuthor
 * Description:     Retrieves all books by a specific author via AJAX call
 */
function GetTitlesByAuthor() {
    let au_id = $(this).data("author");
    currentAuthorId = au_id;
    console.log("Author ID:", au_id);

    CallAJAX("service.php", "get", "json",
        {
            action: "GetTitlesByAuthor",
            au_id: au_id
        },
        GetTitlesByAuthorSuccess, ErrorMethod);
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


function AddTypesForm() {
    CallAJAX("service.php", "get", "json",
        { action: "GetTypes" },
        function (data) {
            console.log(data);

            data.types.forEach(type => {
                $(`#add-type`).append(`<option value="${type[0]}">${type[0]}</option>`);
            });
        },
        ErrorMethod);
}

function LoadAuthors() {
    CallAJAX("service.php", "get", "json",
        { action: "GetAuthorNames" },
        function (data) {
            data.authors.forEach(a => {
                $("#add-authors").append(
                    `<option value="${a[0]}">${a[1]}</option>`
                );
            });
        },
        ErrorMethod
    );
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
