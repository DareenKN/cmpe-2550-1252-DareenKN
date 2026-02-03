/**
 * CMPE2550 – ICA 04 – MySQL Data Manipulation via AJAX
 * Name: Dareen Kinga Njatou
 * dataRetrieval.js
 * Description: JavaScript file to retrieve authors and their books from MySQL database via AJAX
 * Date: January 20, 2026
 */

let currentAuthorId = null;
let edited_title_id = null;

$(document).ready(function () {
    $('.data-section').hide();

    GetAllAuthors();
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
$(document).on('click', '.btn-delete', DeleteTitleAuthor);
$(document).on('click', '.btn-edit', EditTitle);


/** 
*FunctionName:    CallAJAX
*Description:     Generic AJAX call function 
*/
function CallAJAX(url, method, data, dataType, successMethod, errorMethod) {

    $.ajax({
        url: url,
        method: method,
        data: data,
        dataType: dataType,
        success: successMethod,
        error: errorMethod
    });
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
        let row = `
            <tr>
                <td>
                    <button class="btn btn-retrieve" data-author="${author[0]}">
                        Retrieve
                    </button>
                </td>
                <td>${author[0]}</td>
                <td>${author[1]}</td>
                <td>${author[2]}</td>
                <td>${author[3]}</td>
            </tr>
        `;

        tbody.append(row);
        $('#status').html(returnedData.message);
    });

}

/**
 * FunctionName:    GetTitlesByAuthor
 * Description:     Retrieves all books by a specific author via AJAX call
 */
function GetTitlesByAuthor() {
    ;
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
        $('#ifnobooks').html(returnedData.message);
        return;
    }
    // Populate titles table
    $('#ifnobooks').empty();
    $('.data-section').show();
    returnedData.titles.forEach(book => {

        let row = `
            <tr>
                <td id="btn-${book[0]}">
                    <button class="btn btn-delete" data-title="${book[0]}">Delete</button>
                    <button class="btn btn-edit" data-title="${book[0]}">Edit</button>
                </td>
                <td>${book[0]}</td>
                <td id="title-${book[0]}">${book[1]}</td>
                <td id="type-${book[0]}">${book[2]}</td>
                <td id="price-${book[0]}">${book[3]}</td>
            </tr>
        `;

        tbody.append(row);
    });
    // Update status message
    $('#book-status').html(returnedData.message);
}

/**
 * FunctionName:    DeleteTitleAuthor
 * Description:     Deletes a specific book via AJAX call
 */
function DeleteTitleAuthor() {
    let title_id = $(this).data("title");
    console.log("Title ID to delete:", title_id, "from author ID:", currentAuthorId);

    let data = {};
    data["action"] = "DeleteTitleAuthor";
    data["title_id"] = title_id;
    data["au_id"] = currentAuthorId;
    CallAJAX("service.php", "get", data, "json", DeleteTitleAuthorSuccess, ErrorMethod);
}

/**
 * FunctionName:    DeleteTitleSuccess
 * Description:     Success method for DeleteTitle AJAX call
 */
function DeleteTitleAuthorSuccess(returnedData) {
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
        $('#ifnobooks').html("Please finish editing the current title before editing another.");
        return;
    }

    console.log("Title ID to edit:", title_id, "from author ID:", currentAuthorId);

    let data = {};
    data["action"] = "EditTitle";
    data["title_id"] = title_id;

    if (title_id !== null && title_id !== undefined) {
        edited_title_id = title_id;
    }

    CallAJAX("service.php", "get", data, "json", EditTitleSuccess, ErrorMethod);
}

function EditTitleSuccess(returnedData) {
    $('#ifnobooks').empty();
    console.log(returnedData);

    if (returnedData.error) {
        $('#book-status').html(returnedData.error);
        return;
    }

    if (edited_title_id === null) {
        return;
    }

    let title_id = edited_title_id;
    console.log("Editing title ID:", title_id);

    $(`#btn-${title_id}`).html(`<button class="btn btn-update" data-title="${title_id}">Update</button>
                          <button class="btn btn-cancel" data-title="${title_id}">Cancel</button>`);
    
    $(`#title-${title_id}`).html(`<input type="text" id="title-input" value="${returnedData.title}">`);
    $(`#price-${title_id}`).html(`<input type="text" id="price-input" value="${returnedData.price}">`);

    $(`#type-${title_id}`).empty();
    $(`#type-${title_id}`).html(`<select id="types-select"></select>`);
    for(let i = 0; i < returnedData.types.length; i++) 
        $('#types-select').append(`<option value="${returnedData.types[i][0]}">${returnedData.types[i][0]}</option>`);
    
    // Ensure the current type is selected
    $(`#types-select option[value='${returnedData.type}']`).attr("selected", "selected");

    // If cancel button is clicked, revert changes
    $(document).on('click', '.btn-cancel', function() {
        $('#ifnobooks').empty();
        edited_title_id = null;
        let title_id = $(this).data("title");
        $(`#btn-${title_id}`).html(`<button class="btn btn-delete" data-title="${title_id}">Delete</button>
                              <button class="btn btn-edit" data-title="${title_id}">Edit</button>`);
        // Revert title and price to original values
        $(`#title-${title_id}`).html(returnedData.title);
        $(`#price-${title_id}`).html(returnedData.price);
        $(`#type-${title_id}`).html(returnedData.type);
    });  

    // If update button is clicked, send updated data via AJAX
    $(document).on('click', '.btn-update', function() {
        $('#ifnobooks').empty();
        edited_title_id = null;
        let title_id = $(this).data("title");
        let updatedTitle = $('#title-input').val();
        let updatedPrice = $('#price-input').val();
        let updatedType = $('#types-select').val();
        console.log("Updated Title ID:", title_id, "Title:", updatedTitle, "Price:", updatedPrice, "Type:", updatedType);

        let data = {};
        data["action"] = "UpdateTitle";
        data["title_id"] = title_id;
        data["title"] = updatedTitle;
        data["price"] = updatedPrice;
        data["type"] = updatedType;

        CallAJAX("service.php", "get", data, "json", UpdateTitleSuccess, ErrorMethod);
    });
}

function UpdateTitleSuccess(returnedData) {
    console.log(returnedData);

    if (returnedData.error) {
        $('#book-status').html(returnedData.error);
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

    $('#status').html(`An error occurred.`);
}


