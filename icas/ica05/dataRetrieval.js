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
});


/**
 * FunctionName:    GetAllAuthors
 * Description:     Retrieves all authors from the database via AJAX call
 */
function GetAllAuthors() {
    let data = {};
    data["action"] = "GetAllAuthors";

    CallAJAX("service.php", "get", data, "json", GetAllAuthorsSuccess, ErrorMethod);
}

// Event delegation for dynamically created buttons
$(document).on('click', '.btn-retrieve', GetTitlesByAuthor);
$(document).on('click', '.btn-delete', DeleteTitle);
$(document).on('click', '.btn-edit', EditTitle);
$(document).on('click', '.btn-update', UpdateTitle);
$(document).on('click', '.btn-cancel', CancelUpdate);


/** 
*FunctionName:    CallAJAX
*Description:     Generic AJAX call function 
*/
function CallAJAX(url, method, data, dataType, successMethod, errorMethod) {
    $.ajax({ url: url, method: method, data: data, dataType: dataType, success: successMethod, error: errorMethod });
}

/** 
*FunctionName:    GetAllAuthorsSuccess
*Description:     Success method for GetAllAuthors AJAX call 
*/
function GetAllAuthorsSuccess(returnedData) {
    console.log(returnedData);

    let tbody = $("#authors-body");
    tbody.empty();

    if (!returnedData.authors || returnedData.authors.length === 0) {
        $('.data-section').hide();
        return;
    }

    returnedData.authors.forEach(author => {
        // Create table row for each author
        let row = `<tr>
                <td>
                    <button class="btn btn-retrieve" data-author="${author[0]}">
                        Retrieve
                    </button>
                </td>
                <td>${author[0]}</td>
                <td>${author[1]}</td>
                <td>${author[2]}</td>
                <td>${author[3]}</td>
            </tr>`;

        tbody.append(row);
        $('#status').html(returnedData.message);
    });
}

/**
 * FunctionName:    GetTitlesByAuthor
 * Description:     Retrieves all books by a specific author via AJAX call
 */
function GetTitlesByAuthor() {
    let au_id = $(this).data("author");
    currentAuthorId = au_id;

    console.log("Author ID:", au_id);

    let data = {};
    data["action"] = "GetTitlesByAuthor";
    data["au_id"] = au_id;

    CallAJAX("service.php", "get", data, "json", GetTitlesByAuthorSuccess, ErrorMethod);
}

/**
 * FunctionName:    GetTitlesByAuthorSuccess
 * Description:     Success method for GetTitlesByAuthor AJAX call
 */
function GetTitlesByAuthorSuccess(returnedData) {
    console.log(returnedData);

    let tbody = $("#books-body");
    tbody.empty();

    // If no titles returned, show message and hide table
    if (!returnedData.titles || returnedData.titles.length === 0) {
        $('.data-section').hide();
        $('#error_status').html(returnedData.message);
        return;
    }
    // Populate titles table
    $('#error_status').empty();
    $('.data-section').show();
    returnedData.titles.forEach(book => {

        let row = `<tr>
                <td id="btn-${book[0]}">
                    <button class="btn btn-delete" data-title="${book[0]}">Delete</button>
                    <button class="btn btn-edit" data-title="${book[0]}">Edit</button>
                </td>
                <td>${book[0]}</td>
                <td id="title-${book[0]}">${book[1]}</td>
                <td id="type-${book[0]}">${book[2]}</td>
                <td id="price-${book[0]}">${book[3]}</td>
            </tr>`;

        tbody.append(row);
    });
    // Update status message
    $('#book-status').html(returnedData.message);
}

/**
 * FunctionName:    DeleteTitleAuthor
 * Description:     Deletes a specific book via AJAX call
 */
function DeleteTitle() {
    let title_id = $(this).data("title");
    console.log("Title ID to delete:", title_id);

    let data = {};
    data["action"] = "DeleteTitle";
    data["title_id"] = title_id;
    CallAJAX("service.php", "get", data, "json", DeleteTitleSuccess, ErrorMethod);
}

/**
 * FunctionName:    DeleteTitleSuccess
 * Description:     Success method for DeleteTitle AJAX call
 */
function DeleteTitleSuccess(returnedData) {
    console.log(returnedData);

    $('#book-status').html(returnedData.message);

    // Refresh the titles table after deletion
    let au_id = currentAuthorId;

    let data = {};
    data["action"] = "GetTitlesByAuthor";
    data["au_id"] = au_id;

    console.log("Refreshing titles for author ID:", au_id);
    CallAJAX("service.php", "get", data, "json", GetTitlesByAuthorSuccess, ErrorMethod);
}

/**
 * FunctionName:    EditTitle
 * Description:     Edits a specific book via AJAX call
 */
function EditTitle() {
    let title_id = $(this).data("title");

    // If another title is being edited, prevent editing a new one
    console.log("Currently edited title ID:", edited_title_id);
    if (edited_title_id !== null) {
        $('#error_status').html("Please finish editing the current title before editing another.");
        return;
    }

    console.log("Title ID to edit:", title_id, "from author ID:", currentAuthorId);

    let data = {};
    data["action"] = "EditTitle";
    data["title_id"] = title_id;

    if (title_id !== null && title_id !== undefined)
        edited_title_id = title_id;

    CallAJAX("service.php", "get", data, "json", EditTitleSuccess, ErrorMethod);
}

/**
 * FunctionName:    EditTitleSuccess
 * Description:     Success method for EditTitle AJAX call
 * Inputs:          returnedData - Data returned from AJAX call
 * Outputs:         Renders edit form for the selected title
 */
function EditTitleSuccess(returnedData) {
    // Clear any previous messages
    $('#error_status').empty();
    console.log(returnedData);

    if (hasError(returnedData)) return;
    if (edited_title_id === null) return;

    const title_id = edited_title_id;

    originalRowData[title_id] = {
        title: returnedData.title,
        price: returnedData.price,
        type: returnedData.type
    };

    console.log("Editing title ID:", title_id);

    // Update status message
    $('#book-status').html(returnedData.message);

    // Render edit form and bind handlers
    renderEdit(title_id, returnedData);
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
 * FunctionName:    ClearErrorStatus
 * Description:     Clears informational messages
 */
function ClearErrorStatus() {
    $('#error_status').empty();
}

/** 
 * FunctionName:    renderEdit
 * Description:     Renders the edit form for a specific title
 */
function renderEdit(title_id, data) {
    $(`#btn-${title_id}`).html(`
        <button class="btn btn-update" data-title="${title_id}">Update</button>
        <button class="btn btn-cancel" data-title="${title_id}">Cancel</button>
    `);

    $(`#title-${title_id}`).html(`<input type="text" id="title-input-${title_id}" value="${data.title}">`);
    $(`#price-${title_id}`).html(`<input type="text" id="price-input-${title_id}" value="${data.price}">`);

    const $typeCell = $(`#type-${title_id}`);
    $typeCell.empty().html(`<select id="types-select-${title_id}"></select>`);

    data.types.forEach(type => {
        $(`#types-select-${title_id}`).append(`<option value="${type[0]}">${type[0]}</option>`);
    });

    $(`#types-select-${title_id}`).val(data.type);
}

/** 
 * FunctionName:    CancelUpdate
 * Description:     Resets the row buttons and infos when cancel is clicked
 */
function CancelUpdate() {
    ClearErrorStatus();
    edited_title_id = null;

    let title_id = $(this).data("title");

    $(`#btn-${title_id}`).html(`
    <button class="btn btn-delete" data-title="${title_id}">Delete</button>
    <button class="btn btn-edit" data-title="${title_id}">Edit</button>`);

    const original = originalRowData[title_id];

    // Resetting title's info
    $(`#title-${title_id}`).html(original.title);
    $(`#price-${title_id}`).html(original.price);
    $(`#type-${title_id}`).html(original.type);
}

/** 
 * FunctionName:    UpdateTitle
 * Description:     Calls update function to update title's infos
 */
function UpdateTitle() {
    ClearErrorStatus();
    edited_title_id = null;

    let title_id = $(this).data("title");
    let data = {};

    data["action"] = "UpdateTitle";
    data["title_id"] = title_id;
    data.title = $(`#title-input-${title_id}`).val();
    data.price = $(`#price-input-${title_id}`).val();
    data.type = $(`#types-select-${title_id}`).val();

    console.log(
        "Updated Title ID:", title_id,
        "Title:", data.title,
        "Price:", data.price,
        "Type:", data.type
    );

    CallAJAX("service.php", "get", data, "json", UpdateTitleSuccess, ErrorMethod);
}

/** 
 * FunctionName:    UpdateTitleSuccess
 * Description:     When Ajax call is successful, updates the title row
 */
function UpdateTitleSuccess(returnedData) {
    $('#error_status').empty();
    console.log(returnedData);

    if (returnedData.error) {
        $('#error_status').html(returnedData.error);
        return;
    }

    $('#book-status').html(returnedData.message);

    // Refresh the titles table after update
    let au_id = currentAuthorId;

    let data = {};
    data["action"] = "GetTitlesByAuthor";
    data["au_id"] = au_id;

    console.log("Refreshing titles for author ID:", au_id);
    CallAJAX("service.php", "get", data, "json", GetTitlesByAuthorSuccess, ErrorMethod);
}

/**
 * FunctionName:    ErrorMethod
 * Description:     Generic error method for AJAX calls
 */
function ErrorMethod(req, status, error) {
    console.log("AJAX ERROR", status, error);

    $('#error_status').html(req.error);
}

function AddTypesForm() {
    CallAJAX("service.php", "get", { action: "GetTypes" }, "json", GetTypesSuccess, ErrorMethod);
}
function GetTypesSuccess(data) {
    console.log(data);

    data.types.forEach(type => {
        $(`#add-type`).append(`<option value="${type[0]}">${type[0]}</option>`);
    });
}