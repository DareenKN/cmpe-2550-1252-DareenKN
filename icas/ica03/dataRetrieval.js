/**
 * CMPE2550 – ICA 3 / Assignment 03
 * MySQL Data Retrieval – Next Level
 */

$(document).ready(function () {
    $('.data-section').hide();

    GetAllAuthors();
    //$('.btn-retrieve').on('click', GetBooksByAuthor); 
});


/**
 * Get all authors
 */
function GetAllAuthors() {

    let data = {};
    data["action"] = "GetAllAuthors";

    CallAJAX(
        "service.php",
        "get",
        data,
        "json",
        GetAllAuthorsSuccess,
        ErrorMethod
    );
}

$(document).on('click', '.btn-retrieve', GetBooksByAuthor);

/**
 * Button click → get books for one author
 */
function GetBooksByAuthor() {

    let au_id = $(this).data("author");

    let data = {};
    data["action"] = "GetBooksByAuthor";
    data["au_id"] = au_id;

    CallAJAX(
        "service.php",
        "get",
        data,
        "json",
        GetBooksByAuthorSuccess,
        ErrorMethod
    );
}


/**
 * Generic AJAX call
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
 * Populate authors table
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
        $('.status').html(`Retrieved: ${returnedData.authors.length} author records`);
    });

}


/**
 * Populate books table (filtered)
 */
function GetBooksByAuthorSuccess(returnedData) {

    console.log(returnedData);

    let tbody = $("#books-body");
    tbody.empty();

    if (!returnedData.books || returnedData.books.length === 0) {
        $('.data-section').hide();
        return;
    }

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

    $('.book-status').html(`Retrieved: ${returnedData.books.length} title records`);
}


/**
 * Error handler
 */
function ErrorMethod(req, status, error) {
    console.log("AJAX ERROR", status, error);
    
    $('.status').html(`An error occurred.`);
}
