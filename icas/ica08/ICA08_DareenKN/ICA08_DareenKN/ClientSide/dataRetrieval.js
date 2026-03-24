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
    GetEFStudents();
});


/**
 * FunctionName:    GetEFStudents
 * Description:     Retrieves all authors from the database via AJAX call
 */
function GetEFStudents() {
    CallAJAX("https://localhost:7178/EFStudents", "get", "json",
        {},
        GetEFStudentsSuccess, ErrorMethod);
}

// Event delegation for dynamically created buttons

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

/** 
*FunctionName:    GetEFStudentsSuccess
*Description:     Success method for GetEFStudents AJAX call 
*/
function GetEFStudentsSuccess(data) {
    console.log(data);

    let tbody = $("#student-body");
    tbody.empty();

    if (!data.studentsEF || data.studentsEF.length === 0) {
        $('.data-section').hide();
        return;
    }

    data.studentsEF.forEach((st, i) => {
        // Create table row for each author
        if (i > 0) {

            let row = `<tr>
                <td>                
                    <button class="btn btn-retrieve" onclick = "GetStudClassInfo('${st[0]}')">
                        Retrieve Class Info
                    </button>
                </td>
                <td>${st[0]}</td>
                <td>${st[1]}</td>
                <td>${st[2]}</td>
                <td>${st[3]}</td>
            </tr>`;

            tbody.append(row);
            $('#status').html(data.message);
        }
    });
}

/**
 * FunctionName:    GetStudClassInfo
 * Description:     Retrieves all books by a specific author via AJAX call
 */
function GetStudClassInfo(st_id) {
    console.log("Student ID:", st_id);

    CallAJAX("https://localhost:7178/StudentClassInfo?stid=" + parseInt(st_id), "get", "json",
        {},
        function (data) {
            console.log(data);
            // If no titles returned, show message and hide table
            if (data.error) {
                $('.data-section').hide();
                $('#error_status').html(data.error);
                return;
            }
            GetStudClassInfoSuccess(data, st_id);
        }, ErrorMethod);
}

/**
 * FunctionName:    GetStudClassInfoSuccess
 * Description:     Success method for GetStudClassInfo AJAX call
 */
function GetStudClassInfoSuccess(data, st_id) {
    let tbody = $("#books-body");
    tbody.empty();

    // Populate titles table
    $('#error_status').empty();
    $('.data-section').show();

    $('#bookHeading').html(`Class Information for student: ${st_id}`);
    data.studClassInfo.forEach(cl => {

        let row = `<tr>
                <td>${cl[0]}</td>
                <td>${cl[1]}</td>
                <td>${cl[2]}</td>
                <td>${cl[3]}</td>
                <td>${cl[4]}</td>
                <td>${cl[5]}</td>
                <td>${cl[6]}</td>                
            </tr>`;

        tbody.append(row);
    });
    // Update status message
    $('#book-status').html(data.message);
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
    $('#book-status').html("");
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
