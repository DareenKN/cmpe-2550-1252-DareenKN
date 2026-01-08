
var pokeArray = []
var displayArray =[]
var count = 0
$(() => {
    // Make call to pokeAPI and get charmander
    //$.ajax()
    callAjax("https://pokeapi.co/api/v2/pokemon/charmander", null, "GET", "json", handlePokemon, handlePokeError)
    //Looping through radio buttons, handling on change for radio buttons
    $('.pokeClass').each((index,element)=>{
        console.log(element)
        // Old way, no marks
        // element.onchange =(e)=>{
        //     console.log(e.target.value)
        // }
        // New way, marks
        // $(element).change(()=>{
        //     console.log($(element).val())
        // })
        $(element).change(handleRadioChange)
    })
    
    // ------ FOR LAB 3 -----------
    callAjax(
        "https://thor.cnt.sast.ca/~aulakhha/filesAssLab/lab3.php", 
        { "action": "propertyPrices" }, 
        "POST", 
        JSON, 
        handleTest, 
        handleTestError
    )
    callAjax("https://thor.cnt.sast.ca/~aulakhha/filesAssLab/lab3.php", { "action": "diceroll" }, "POST", JSON, handleTest, handleTestError)
    $("#getPokemon").click(getPokemon)
    $("#playPokemon").click(startPokemonTimer)
    
})


function handleRadioChange(){
    let type = $(this).val()
    displayArray = []
    pokeArray.forEach((item)=>{
        console.log(item)
        if(item.type == type.toLowerCase())
            displayArray.push(item)
    })
    console.log("Display array: ")
    console.log(displayArray)
}

function startPokemonTimer() {
    setInterval(loopThroughPokemon, 750)
}

function loopThroughPokemon(){
    console.log("Type found: " + displayArray[count].type)
    $("#pokePicture").attr("src", `${displayArray[count].picture}`)
    count = (count + 1) % displayArray.length
}

function getPokemon() {
    let pokeInput = $("#pokemonName").val()
    if (pokeInput.length < 0)
        return
    callAjax(`https://pokeapi.co/api/v2/pokemon/${pokeInput}`, null, "GET", "json", handlePokemonFetch, handlePokeError)
}

function handleTestError(data) {
    console.log("error:" + data)
}
function handleTest(data) {
    console.log(data)
}

function callAjax(url, data, type, datatype, successCallback, errorCallback) {
    let options = {}
    options['url'] = url
    options['data'] = data
    options['type'] = type
    options['datatype'] = datatype
    options['success'] = successCallback
    options['error'] = errorCallback

    $.ajax(options)
}

function handlePokemon(data) {
    console.log(data.sprites.front_shiny)
    let src = data.sprites.front_shiny
    let img = $(`<img src=${src} alt='charmander'><img>`)
    $("#placeholder").append(img)
}

function handlePokemonFetch(data) {
    console.log(data)
    console.log(data.types[0].type.name)
    console.log(data.sprites.front_default)
    let src = data.sprites.front_default
    pokeArray.push({picture: src, type: data.types[0].type.name })
}


function handlePokeError(data){
    console.log("something went wrong:" + data)
}