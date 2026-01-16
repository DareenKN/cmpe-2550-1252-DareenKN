$(document).ready(function () {

    // create a listener for the "submit" button
    $('#getVolume').click(GetVolume);
    $('#getArea').click(GetArea);
});

/**
 * FunctionName:    GetVolume
 * Inputs:          None
 * Outputs:         None
 * Decription:      Extract and prepare data from the HTML page, prepare and execute
 *                  the AJAX call
 */
function GetVolume() {
    let getData = {};
    getData["action"] = "CalcVol";
    getData["radius"] = $('#radius').val();

    console.log(getData);

    CallAJAX("service.php", "post", getData, "json", CalcVolumeSuccess, ErrorMethod);
}

/**
 * FunctionName:    GetArea
 * Inputs:          None
 * Outputs:         None
 * Decription:      Extract and prepare data from the HTML page, prepare and execute
 *                  the AJAX call
 */
function GetArea() {
    let getData = {};
    getData["action"] = "CalcArea";
    getData["radius"] = $('#radius').val();

    console.log(getData);

    CallAJAX("service.php", "post", getData, "json", CalcAreaSuccess, ErrorMethod);
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
function CallAJAX(url, method, data, dataType, successMethod, errorMethod) {
    let options = {};

    options.url = url;
    options.method = method;
    options.data = data;
    options.dataType = dataType;
    options.success = successMethod;
    options.error = errorMethod;

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
function CalcVolumeSuccess(returnedData, returnedStatus, sentRequest) {
    // For testing.  See the data returned from the server.  Discard once app is functioning
    console.log(returnedData);
    console.log(returnedStatus);
    console.log(sentRequest);

    // Insert the returned volume into the "result" div
    $('#result').html("Calculated Volume: " + returnedData.volume);
    $('#status').html("Status: " + returnedData.status);
}

function CalcAreaSuccess(returnedData, returnedStatus, sentRequest) {
    // For testing.  See the data returned from the server.  Discard once app is functioning
    console.log(returnedData);
    console.log(returnedStatus);
    console.log(sentRequest);

    // Insert the returned area into the "result" div
    $('#result').html("Calculated Area: " + returnedData.area);
    $('#status').html("Status: " + returnedData.status);
}

/**
 * FunctionName:    ErrorMethod
 * Inputs:          sentRequest     - the original request to the server
 *                  returnedStatus  - the status message returned by the server
 *                  returnedError   - the error message returned by the server
 * Outputs:         None
 * Decription:      Handle AJAX request errors
 */
function ErrorMethod(sentRequest, returnedStatus, returnedError) {
    // For testing.  See the error information returned from the server
    console.log(sentRequest);
    console.log(returnedStatus);
    console.log(returnedError);
}

//https://thor.cnt.sast.ca:2083/cpsess1955265189/frontend/jupiter/filemanager/index.html?=undefined&login=1&post_login=63872233270110
