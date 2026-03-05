$(document).ready( () => {

    $("#submitPost").click(PostTest);

});

function PostTest()
{
    let data = {};
    data.name = $("#name").val();
    data.location = $("#location").val();
    data.age = $("#age").val();
    console.log(data);

    CallAJAX("https://localhost:7192/withDataPost", "post", data, "json", PostTestSuccess, ErrorMethod);
}

function PostTestSuccess(returnedData, statusMessage, sentRequest)
{
    console.log(returnedData);
    $("#output").html(returnedData.output);
}

function CallAJAX(url, method, data, dataType, successMethod, errorMethod)
{
    let options = {};
    options["url"] = url;
    options["method"] = method;
    if (method == "get")
        options["data"] = data;
    else if (method == "post")
    {
        options["data"] = JSON.stringify(data);
        options["contentType"] = "application/json";
    }
    options["dataType"] = dataType;
    options["success"] = successMethod;
    options["error"] = errorMethod;

    console.log(options["data"]);
    $.ajax(options);
}

function ErrorMethod(sentRequest, returnedStatusAJAX, errorThrown)
{
    console.log(sentRequest);
    console.log(returnedStatusAJAX);
    console.log(errorThrown);
}