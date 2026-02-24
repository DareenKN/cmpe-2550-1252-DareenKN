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
$(document).on('click', '.btn-retrieve', GetTitlesByAuthor);
$(document).on('click', '.btn-delete', DeleteTitle);
$(document).on('click', '.btn-edit', EditTitle);
$(document).on('click', '.btn-update', UpdateTitle);
$(document).on('click', '.btn-cancel', CancelUpdate);
$(document).on("click", "#btn-add", AddTitle);


/** 
*FunctionName:    CallAJAX
*Description:     Generic AJAX call function 
*/
function CallAJAX(url, method, dataType, data, successMethod, errorMethod) {
    $.ajax({ url: url, method: method, dataType: dataType, data: data, success: successMethod, error: errorMethod });
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

    CallAJAX("service.php", "get", "json",
        {
            action: "GetTitlesByAuthor",
            au_id: au_id
        },
        GetTitlesByAuthorSuccess, ErrorMethod);
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

    $('#bookHeading').html(`Books for author: ${currentAuthorId}`);
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

    CallAJAX("service.php", "post", "json",
        {
            action: "DeleteTitle",
            title_id: title_id
        },
        function (data) {
            console.log(data);
            $('#book-status').html(data.message);

            // Refresh the titles table after deletion
            let au_id = currentAuthorId;
            console.log("Refreshing titles for author ID:", au_id);
            CallAJAX("service.php", "get", "json",
                { action: "GetTitlesByAuthor", au_id: au_id },
                GetTitlesByAuthorSuccess, ErrorMethod);
        }, ErrorMethod);
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

    if (title_id !== null && title_id !== undefined)
        edited_title_id = title_id;

    CallAJAX("service.php", "get", "json",
        { action: "EditTitle", title_id: title_id },
        function (returnedData) {
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
        }, ErrorMethod);
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
    $('#error_status').empty();;
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
    $('#error_status').empty();;
    edited_title_id = null;

    let title_id = $(this).data("title");
    console.log(
        "Updated Title ID:", title_id,
        "Title:", $(`#title-input-${title_id}`).val(),
        "Price:", $(`#price-input-${title_id}`).val(),
        "Type:", $(`#types-select-${title_id}`).val()
    );

    CallAJAX("service.php", "post", "json",
        {
            action: "UpdateTitle",
            title_id: title_id,
            title: $(`#title-input-${title_id}`).val(),
            price: $(`#price-input-${title_id}`).val(),
            type: $(`#types-select-${title_id}`).val()
        },
        function (returnedData) {
            $('#error_status').empty();
            console.log(returnedData);

            if (returnedData.error) {
                $('#error_status').html(returnedData.error);
                return;
            }

            $('#book-status').html(returnedData.message);

            // Refresh the titles table after update
            let au_id = currentAuthorId;
            console.log("Refreshing titles for author ID:", au_id);
            CallAJAX("service.php", "get", "json",
                { action: "GetTitlesByAuthor", au_id: au_id },
                GetTitlesByAuthorSuccess, ErrorMethod);
        }, ErrorMethod);
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

function AddTitle() {
    CallAJAX("service.php", "post", "json",
        {
            action: "AddTitle",
            title_id: $("#add-title-id").val().trim(),
            title: $("#add-title").val().trim(),
            type: $("#add-type").val(),
            price: $("#add-price").val(),
            authors: $("#add-authors").val()
        },
        AddTitleSuccess, ErrorMethod);
}


function AddTitleSuccess(data) {
    console.log(data);
    if (data.error) {
        $("#add-status")
            .removeClass("success")
            .addClass("error")
            .html(data.error);
        return;
    }

    $("#add-status")
        .removeClass("error")
        .addClass("success")
        .html(data.message);

    // refresh current author's books
    if (currentAuthorId) {
        // Refresh the titles table after deletion
        let au_id = currentAuthorId;

        console.log("Refreshing titles for author ID:", au_id);
        CallAJAX("service.php", "get", "json",
            { action: "GetTitlesByAuthor", au_id: au_id },
            GetTitlesByAuthorSuccess, ErrorMethod);
    }
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
