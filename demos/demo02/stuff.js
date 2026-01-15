function CallAJAX(url, method, data, dataType, successMethod, errorMethod) {

}

function AreaVolumeSuccess(returnedData, returnedStatus, sentRequest){
    console.log(returnedData);
    console.log(returnedStatus);
    console.log(sentRequest);
}

function AreaVolumeError(sentRequest, returnedStatus, returnedError){
    console.log(sentRequest);
    console.log(returnedStatus);
    console.log(returnedError);
}