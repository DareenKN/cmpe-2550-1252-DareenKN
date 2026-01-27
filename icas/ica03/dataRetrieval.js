/**
 * CMPE2550 – ICA 3 / Assignment 03
 * MySQL Data Retrieval – Next Level
 */

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
$(document).on('click', '.btn-retrieve', GetBooksByAuthor);


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

    let tbody = $("#authors-body");
    tbody.empty();

    if (!returnedData.authors || returnedData.authors.length === 0) {
        $('.data-section').hide();
        return;
    }

    returnedData.authors.forEach(author => {

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
        let record_label = (returnedData.authors.length > 1) ? 'records' : 'record';
        $('#status').html(`Retrieved: ${returnedData.authors.length} author ${record_label}`);
    });

}

/**
 * FunctionName:    GetBooksByAuthor
 * Description:     Retrieves all books by a specific author via AJAX call
 */
function GetBooksByAuthor() {;
    let au_id = $(this).data("author");
    console.log("Author ID:", au_id);
    
    let data = {};
    data["action"] = "GetBooksByAuthor";
    data["au_id"] = au_id;

    CallAJAX("service.php", "get", data, "json", GetBooksByAuthorSuccess, ErrorMethod);
}

/**
 * FunctionName:    GetBooksByAuthorSuccess
 * Description:     Success method for GetBooksByAuthor AJAX call
 */
function GetBooksByAuthorSuccess(returnedData) {

    console.log(returnedData);

    let tbody = $("#books-body");
    tbody.empty();

    if (!returnedData.books || returnedData.books.length === 0) {
        $('.data-section').hide();
        $('#ifnobooks').html(`No books found for this author.`);
        return;
    }
    $('#ifnobooks').empty();
    $('.data-section').show();
    returnedData.books.forEach(book => {

        let row = `
            <tr>
                <td>${book[0]}</td>
                <td>${book[1]}</td>
                <td>${book[2]}</td>
                <td>${book[3]}</td>
            </tr>
        `;

        tbody.append(row);
    });

    let title_label = (returnedData.books.length > 1) ? 'records' : 'record';
    $('#book-status').html(`Retrieved: ${returnedData.books.length} title ${title_label}`);
}

/**
 * FunctionName:    ErrorMethod
 * Description:     Generic error method for AJAX calls
 */
function ErrorMethod(req, status, error) {
    console.log("AJAX ERROR", status, error);

    $('#status').html(`An error occurred.`);
}
