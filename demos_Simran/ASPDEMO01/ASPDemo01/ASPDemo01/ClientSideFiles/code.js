// Js file
$().ready(()=>{

    console.log("On Page Load");

    $("[name=postSubmit]").click(PostSubmit);
});

function PostSubmit()
{
    console.log("In post Submit function");

    let data={};

    data.postName= $("[name=postName]").val();
    data.postAge= $("[name=postAge]").val();

    console.log(data);

    MakeAjaxCall("https://localhost:7019/registerPost", "POST", data, "JSON", SuccessPost, ErrorHandler);

}

function SuccessPost(serverData, status)
{
    console.log(serverData);

}

function ErrorHandler(ajRes, status, errorThrown)
{
    console.log(status);
    console.log(errorThrown);
}
// Function MakeAjaxCall is used to make ajax call
function MakeAjaxCall(serverURL, reqMethod, data, serverResponse, successHandler, errorHandler)
{
    console.log("Inside MakeAjaxCall function ");

    let ajaxOptions= {};
    ajaxOptions['url']          = serverURL;                // Destination URL
    ajaxOptions['type']         = reqMethod;                // GET/POST
    ajaxOptions['dataType']     = serverResponse;           // HTML/JSON 
    ajaxOptions['data']         = JSON.stringify(data);     // Client data   -- NEW for ASP PART
    ajaxOptions['success']      = successHandler;           // Callback function to handle successful case
    ajaxOptions['error']        = errorHandler;             // Callback function to handle error 

    ajaxOptions['contentType']  = "application/json";       // NEW for ASP PART

    // actually make ajax call
    $.ajax(ajaxOptions);

}