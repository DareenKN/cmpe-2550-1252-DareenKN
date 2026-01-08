//This is the first javascript file for Lecture11 - Exercise1
// We here pass a literal object as parameter to the
//ajax() call

$(() => {
    $("#button1").on("click", () => {
        let request = processAjaxCall()

        request.done((data, status) => {
            console.log("Success: " + status)
        })

        request.fail((jqXHR, status, errorThrown) => {
            let message = `Error: ${status} - ${errorThrown} - ${jqXHR.status}`
            alert(message)
            console.log(message)
            console.log(jqXHR)
        })
    })

    $("#button2").click(AJAXwithHandler)


})

function processAjaxCall() {
    let getData = {}

    getData['Program'] = $("#myProgram > option:selected").val()
    getData['FName'] = $("#FName").val()
    getData['LName'] = $("#LName").val()
    getData['Age'] = $("#age").val()

    console.log(getData)

    let ajaxOptions = {}

    let myURL = 'https://thor.cnt.sast.ca/~oveeyenm/CMPE2000/week11/le11Exercise1/week11Exercise1.php'

    ajaxOptions.url = myURL
    ajaxOptions.type = 'GET'
    ajaxOptions.data = getData
    ajaxOptions.dataType = 'html'

    // Invoke and return AJAX
    return $.ajax(ajaxOptions)

}

function AJAXwithHandler() {
    let getData = {}

    getData.Program = $("#myProgram > option:selected").val()
    console.log(getData.Program)

    let myURL = 'https://thor.cnt.sast.ca/~oveeyenm/CMPE2000/week11/le11Exercise1/week11Exercise1.php'

    MakeAJAXCall(myURL, getData, 'GET', 'html', getSuccess, processError)
}

function MakeAJAXCall(url, data, type, dataType, successFunction, errorFunction) {
    let options = {}

    options.url = url
    options.data = data
    options.type = type
    options.dataType = dataType
    options.success = successFunction
    options.error = errorFunction

    $.ajax(options)
}

function getSuccess(data, status) {
    console.log(`Status: ${status}`)
    $("#serverResult").html(data)
}

function processError(jqXHR, status) {
    console.log(`Status: ${status} - ${jqXHR.status}`)
}