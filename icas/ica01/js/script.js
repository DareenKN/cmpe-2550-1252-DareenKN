let row = 0
let col = 0
let randNums = []

$(() => {
    console.log("Hello from onload")

    $("#callWithGet").on("click", () => {
        let request = processAjaxCall()

        // Callbacks
        request.done((data, status) => {
            console.log("GET done: " + status)
            $("#result").html(data)
        })

        request.fail((jqXHR, status) => {
            console.log("GET failed:" + jqXHR)
        })

        request.always((arg1, status, arg2) => {
            console.log("Always: " + status)
        })
    })

    row = $("#rowRange").val()
    col = $("#colRange").val()

    $("#PostForTable").html(`Post to Make ${row}x${col} Table`)

    $("#rowRange").change(UpdateRow)
    $("#colRange").change(UpdateCol)

    $("#PostForTable").click(CallBackTable)

    $("#GenerateNumber").click(GenRandNum)
    $("#PostToShowModified").click(PostToShow)

    $("#PostFail").click(PostToFail)
})

function processAjaxCall() {
    let getData = {}
    getData['Name'] = $("#nameInput").val()
    getData['Hobby'] = $("#hobbyInput").val()
    getData['HowMuch'] = $("#likeRange").val()

    let myURL = 'https://thor.cnt.sast.ca/~demo/cmpe2000/ica_Hobby.php'

    let ajaxOptions = {}

    ajaxOptions['url'] = myURL
    ajaxOptions['type'] = 'GET'
    ajaxOptions['data'] = getData
    ajaxOptions['dataType'] = 'html'

    // Invoking and returning ajax
    return $.ajax(ajaxOptions)
}

function UpdateRow() {
    row = $(this).val()
    console.log("row: " + row)
    $("#PostForTable").html(`Post to Make ${row}x${col} Table`)

}

function UpdateCol() {
    col = $(this).val()
    console.log("col: " + col)
    $("#PostForTable").html(`Post to Make ${row}x${col} Table`)
}

function CallBackTable() {
    let postData = {}

    postData['RowCount'] = row
    postData['ColumnCount'] = col

    let url = 'https://thor.cnt.sast.ca/~demo/cmpe2000/ica_Table.php'

    AjaxRequest(url, 'POST', postData, 'html', succesFunction, errorHandler)
}

function AjaxRequest(url, type, data, dataType, succesFunction, errorHandler) {
    let ajaxOptions = {}

    ajaxOptions['url'] = url
    ajaxOptions['type'] = type
    ajaxOptions['data'] = data
    ajaxOptions['dataType'] = dataType
    ajaxOptions['success'] = succesFunction
    ajaxOptions['error'] = errorHandler

    return $.ajax(ajaxOptions)
}

function succesFunction(data, status) {
    console.log("Post success: " + status)
    $("#tablePlaceHolder").html(data)

}

function errorHandler(requestor, textStatus, errorThrown) {
    let message = `Error: ${textStatus} - ${errorThrown} - ${requestor.status}`
    alert(message)
    console.log(requestor)
}

function GenRandNum() {
    for (let i = 0; i < 20; i++)
        randNums[i] = Math.floor(Math.random() * 21)

    console.log("RandNums.length: " + randNums.length)

    $("#GenNumPH").html(randNums.join(', '))
}

function PostToShow() {
    let postData = {}
    postData['Numbers'] = randNums

    let url = 'https://thor.cnt.sast.ca/~demo/cmpe2000/ica_Numbers.php'

    AjaxRequest(url, 'POST', postData, 'html', succesFunction2, errorHandler)

}

function succesFunction2(data, status) {
    console.log("POST success: " + status)
    $("#PostToSHowPH").html(data)
}

function PostToFail() {
    let postData = {}
    postData['Numbers'] = randNums

    let url = 'https://thor.cnt.sast.ca/~demo/cmpe2000/ica_Number.php'
    AjaxRequest(url, 'POST', postData, 'html', succesFunction2, errorHandler)
}