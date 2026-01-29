/**
 * CMPE2550 – ICA 04 – MySQL Data Manipulation via AJAX
 * Name: Dareen Kinga Njatou
 * dataRetrieval.js
 * Description: JavaScript file to retrieve authors and their books from MySQL database via AJAX
 * Date: January 20, 2026
 */

let currentAuthorId = null;

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
$(document).on('click', '.btn-delete', DeleteTitle);
//$(document).on('click', '.btn-edit', EditTitle);


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
                <td>
                    <button class="btn btn-delete" data-title="${book[0]}">Delete</button>
                    <button class="btn btn-edit" data-title="${book[0]}">Edit</button>
                </td>
                <td>${book[0]}</td>
                <td>${book[1]}</td>
                <td>${book[2]}</td>
                <td>${book[3]}</td>
            </tr>
        `;

        tbody.append(row);
    });
    // Update status message
    $('#book-status').html(returnedData.message);
}

/**
 * FunctionName:    DeleteTitle
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
 * FunctionName:    ErrorMethod
 * Description:     Generic error method for AJAX calls
 */
function ErrorMethod(req, status, error) {
    console.log("AJAX ERROR", status, error);

    $('#status').html(`An error occurred.`);
}


