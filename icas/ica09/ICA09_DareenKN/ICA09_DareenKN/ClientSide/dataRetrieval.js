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
    CallAJAX("https://localhost:7131/EFStudents", "get", "json",
        {},
        GetEFStudentsSuccess, ErrorMethod);
}

// Event delegation for dynamically created buttons

/** 
*FunctionName:    CallAJAX
*Description:     Generic AJAX call function 
*/
function CallAJAX(url, method, dataType, data, successHandler, errorHandler) {
    console.log("Inside MakeAjaxCall function ");

    let options = {};

    options.url = url;                              // Destination URL
    options.method = method;          // GET/POST

    if (method.toLowerCase() == "get") options.data = data;// Client data   -- NEW for ASP PART
    else if (method.toLowerCase() == "post" || method.toLowerCase() == "put") {
        options.data = JSON.stringify(data);
        options.contentType = "application/json";   // NEW for ASP PART
    }
    options.dataType = dataType;                    // HTML/JSON 
    options.success = successHandler;               // Callback function to handle successful case
    options.error = errorHandler;                   // Callback function to handle error 

    // actually make ajax call
    $.ajax(options);
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
                <td class="fn">${st[1]}</td>
                <td class="ln">${st[2]}</td>
                <td class="schId">${st[3]}</td>
                <td id="btn-${st[0]}" class="action">
                    <button class="btn btn-delete" data-id="${st[0]}" onclick="DeleteStudent(${st[0]})">Delete</button>
                    <button class="btn btn-edit" data-id="${st[0]}" onclick="EditStudent(this,${st[0]})">Edit</button>
                </td>
            </tr>`;

            tbody.append(row);
            $('#status').html(data.message);
        }
    });
}

function DeleteStudent(st_id) {
    //if (!confirm("Are you sure you want to delete this student?")) return;
    console.log("Deleting student:", st_id);
    CallAJAX(`https://localhost:7131/DeleteStudent/${st_id}`, "delete", "json",
        {},
        function (data) {
            console.log(data);
            // If no titles returned, show message and hide table
            if (data.error) {
                $('.data-section').hide();
                $('#error_status').html(data.error);
                return;
            }
            $('#error_status').html(data.message);
            GetEFStudents();
        }, ErrorMethod);
}

function EditStudent(btn, st_id) {
    console.log("Editing student:", st_id);

    let row = $(btn).closest("tr");
    let action = row.find(".action");
    let fn = row.find(".fn");
    let ln = row.find(".ln");
    let schId = row.find(".schId");

    action.data("Original", action.html())
    fn.data("Original", fn.html())
    ln.data("Original", ln.html())
    schId.data("Original", schId.html())

    action.html(`<button class="btn btn-delete" data-id="${st_id}" onclick="UpdateStudent(this,${st_id})">Update</button>
                    <button class="btn btn-edit" data-id="${st_id}" onclick="CancelUpdate(this)">Cancel</button>`)
    fn.html(`<input type="text" value="${fn.data("Original")}">`)
    ln.html(`<input type="text" value="${ln.data("Original")}">`)
    schId.html(`<input type="text" value="${schId.data("Original")}">`)
}

function CancelUpdate(btn) {
    console.log("ECanceling");

    let row = $(btn).closest("tr");
    let action = row.find(".action");
    let fn = row.find(".fn");
    let ln = row.find(".ln");
    let schId = row.find(".schId");

    action.html(action.data("Original"));
    fn.html(fn.data("Original"));
    ln.html(ln.data("Original"));
    schId.html(schId.data("Original"));
}

function UpdateStudent(btn, st_id) {
    console.log("Updating student:", st_id);

    let row = $(btn).closest("tr");
    let action = row.find(".action");
    let fn = row.find(".fn");
    let ln = row.find(".ln");
    let schId = row.find(".schId");

    let fn_input = row.find(".fn input").val();
    let ln_input = row.find(".ln input").val();
    let schId_input = row.find(".schId input").val();

    console.log(`${fn_input}, ${ln_input}, ${schId_input}`);

    CallAJAX(`https://localhost:7131/UpdateStudent/${st_id}`, "put", "json",
        {
            id: parseInt(st_id),
            fn: fn_input,
            ln: ln_input,
            schId: schId_input
        },
        function (data) {
            console.log(data);
            // If error, hide table and display error
            if (data.error) {
                $('.data-section').hide();
                $('#error_status').html(data.error);
                return;
            }

            $('#error_status').html(data.message);
            action.html(action.data("Original"));
            fn.html(fn_input);
            ln.html(ln_input);
            schId.html(schId_input);
            // GetStudClassInfoSuccess(data, st_id);
        }, ErrorMethod);
}

/**
 * FunctionName:    GetStudClassInfo
 * Description:     Retrieves all books by a specific author via AJAX call
 */
function GetStudClassInfo(st_id) {
    console.log("Student ID:", st_id);

    CallAJAX("https://localhost:7131/StudentClassInfo?stid=" + parseInt(st_id), "get", "json",
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
    $('#error_status').html(`An error occurred.`);
}
