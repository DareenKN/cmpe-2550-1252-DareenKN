$(document).ready(function () {
    $('#submit)').click(GetVolume);
});

function GetVolume() {
    let getData = {};
    getData["action"] = "CalcVol";
    getData["radius"] = $('#radius').val();

    console.log(getData);

    CallAJAX("service.php", "post", getData, "json", CalcVolumeSuccess, ErrorMethod);
}

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

function CalcVolumeSuccess(returnedData, returnedStatus, sentRequest) {
    console.log(returnedData);
    console.log(returnedStatus);
    console.log(sentRequest);
}

function ErrorMethod(sentRequest, returnedStatus, returnedError) {
    console.log(sentRequest);
    console.log(returnedStatus);
    console.log(returnedError);
}

//https://thor.cnt.sast.ca:2083/cpsess1955265189/frontend/jupiter/filemanager/index.html?=undefined&login=1&post_login=63872233270110
