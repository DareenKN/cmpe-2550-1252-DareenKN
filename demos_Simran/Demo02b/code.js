// To handle on page load stuff
$().ready(()=>{

    console.log("On page load");
    
    // Bind Onclick event to your button
    $("#b1").on("click", ()=>{
        console.log("B1 has been clicked");
        MakeAjaxCall("server.php", "GET", {}, "HTML", successB1,errorHandler);

    });

    // Bind Onclick event to your button
    $("#b2").on("click", ()=>{
        console.log("B2 has been clicked");
        let data = {};
        data['p1Name'] = "Harsimran";
        data['action'] = "b2"; 

        MakeAjaxCall("server.php", "GET", data, "HTML", successB1,errorHandler);
        
    });
    // Bind Onclick event to your button
    $("#b3").on("click", ()=>{
        console.log("B3 has been clicked");
        let data = {};
        data['p1Name'] = "Harsimran";
        data['action'] = "b3"; 

        MakeAjaxCall("server.php", "GET", data, "JSON", successB3,errorHandler);
        
    });

})

function successB1(serverData, serverStatus)
{
    
    console.log(serverData);
    console.log(serverStatus);

    // adding the response on page
    $("#serverResponse").html(serverData);
}

function successB3(serverData, serverStatus)
{
    
    console.log(serverData);
    console.log(serverStatus);
    var string = serverData['name'] + " <br>" + serverData.currentScore;  
    // adding the response on page
    $("#serverResponse").html(string);
    
}



function errorHandler(ajaxReq, ajaxStatus, errorThrown)
{
    console.log(ajaxStatus);
    console.log(errorThrown);
}

// Function MakeAjaxCall is used to make ajax call
function MakeAjaxCall(serverURL, reqMethod, data, serverResponse, successHandler, errorHandler)
{
    console.log("Inside MakeAjaxCall function ");

    let ajaxOptions= {};
    ajaxOptions['url']      = serverURL;        // Destination URL
    ajaxOptions['type']     = reqMethod;        // GET/POST
    ajaxOptions['dataType'] = serverResponse;   // HTML/JSON 
    ajaxOptions['data']     = data;             // Client data
    ajaxOptions['success']  = successHandler;   // Callback function to handle successful case
    ajaxOptions['error']    = errorHandler;     // Callback function to handle error 

    // actually make ajax call
    $.ajax(ajaxOptions);

}