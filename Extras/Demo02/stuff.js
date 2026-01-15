$(document).ready(function(){

    // create a listener for the "submit" button
    $("#submit").click(GetVolume);

});

/**
 * FunctionName:    GetVolume
 * Inputs:          None
 * Outputs:         None
 * Decription:      Extract and prepare data from the HTML page, prepare and execute 
 *                  the AJAX call
 */
function GetVolume()
{
    let getData = {};
    getData["action"] = "CalcVol";
    getData["radius"] = $("#radius").val();

    console.log(getData);

    CallAJAX("service.php", "post", getData, "json", CalcVolumeSuccess, ErrorMethod)
}

/**
 * FunctionName:    CallAJAX
 * Inputs:          url             - the target PHP document
 *                  method          - the HTTP method for the request (get, post, etc)
 *                  data            - the data object to be sent as input data to the server
 *                  dataType        - the type of data expect in response by the client (html, json, etc)
 *                  successMethod   - the method to execute if the AJAX request is successful 
 *                  errorMethod     - the method to execute if there is an AJAX request problem
 * Outputs:         None
 * Decription:      Configure and perform an AJAX call to the specified URL
 */
function CallAJAX(url, method, data, dataType, successMethod, errorMethod)
{
    let options = {};
    options["url"] = url;
    options["method"] = method;
    options["data"] = data;
    options["dataType"] = dataType;
    options["success"] = successMethod;
    options["error"] = errorMethod;

    $.ajax(options);
}

/**
 * FunctionName:    CalcVolumeSuccess
 * Inputs:          returnedData    - the data object returned as a response to the AJAX request
 *                  returnedStatus  - the status message returned by the server
 *                  sentRequest     - the original request to the server with response adjustments
 * Outputs:         None
 * Decription:      Receive the Calculated volume from the server and adjust the HTML page
 */
function CalcVolumeSuccess(returnedData, returnedStatus, sentRequest)
{
    // For testing.  See the data returned from the server.  Discard once app is functioning
    console.log(returnedData);
    console.log(returnedStatus);
    console.log(sentRequest);

    // Insert the received data into the HTML page
    $("#result").html(returnedData["volume"]);
    $("#status").html(returnedData["status"]);
}

/**
 * FunctionName:    ErrorMethod
 * Inputs:          sentRequest     - the original request to the server with response adjustments
 *                  returnedStatus  - the status message returned by the server
 *                  returnedError   - the error message returned from the server
 * Outputs:         None
 * Decription:      Receive the Calculated volume from the server and adjust the HTML page
 */
function ErrorMethod(sentRequest, returnedStatus, returnedError)
{
    // View the returned error data in the console
    console.log(sentRequest);
    console.log(returnedStatus);
    console.log(returnedError);

}