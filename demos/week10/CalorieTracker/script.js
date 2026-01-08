var array = []
var placeholder
var checkboxes

//Accessing Full string name value via string Key
var extraInfoMap = {
    "weekend": "Weekend",
    "eatingOut": "Eating out",
    "cheatDay": "Cheat Day",
    "delivery": "Delivery",
    "mainMeal": "Main Meal",
    "snack": "Snack"
}
$(() => {
    placeholder = $("#placeholder")

    let radioButtons = $('.mealTypePicker')
    console.log("Jquery radio buttons: ")
    console.log(radioButtons)

    $(radioButtons).each((index, element) => {
        $(element).change((event) => {
            console.log($(event.target).val())
        })
    })

    checkboxes = $("[name=extraInfo]")
    //!!!!!!!!!!!!!!!  Binding validation function to SUBMIT EVENT of the FORM !!!!!!!!!!!!!!!!!!!!!
    //form.onsubmit = validateForm
    // Binding validation to submit event using JQUERY !!!!!!!!!!!!!!!!!!!!
    $("form").submit(validateForm)
})


function validateForm() {
    console.log("Valdidation started")

    let name = $("#food_name").val()
    let weight = $("#quantity").val()
    let portion = $("#portion").val()
    let calories = $("#calories").val()
    let checkedRadio = $(".mealTypePicker:checked")

    console.log("Checked radio box: ")
    console.log(checkedRadio)

    if (checkedRadio.length === 0) {
        alert("Please select a check radio box")
        return false
    }
    let weightNum = parseInt(weight)
    let portionNum = parseInt(portion)
    let caloriesNum = parseInt(calories)

    if (isNaN(weightNum) || isNaN(portionNum) || isNaN(caloriesNum)) {
        alert("Invalid inputs")
        return false
    }

    saveFoodItem(name, weightNum, caloriesNum, portionNum)
    return true
}

function saveFoodItem(name, weight, calories, portion) {
    let foodItem = new Food(calories, name, portion, weight)

    foodItem.setType($(".mealTypePicker:checked").val())

    let extraArray = []
    checkboxes.each((index, checkbox) => {

        if (checkbox.checked)
            extraArray.push($(checkbox).val())
        console.log("inner HTML for checkbox: ")
        console.log($(checkbox).text())
    })
    foodItem.extraInfo = extraArray
    array.push(foodItem)
    displayFoodItems()
    console.log(array)
}

function displayFoodItems() {
    $(placeholder).empty()
    $(array).each((ind, food) => {
        let div = document.createElement("div")
        div.innerHTML = food.foodItemContent()
        $(placeholder).append(div)
    })

    $(".mealTypePicker").each((i, element) => {
        console.log("Foreach: ")
        console.log(element)
        $(element).change((event) => {
            console.log(event.target) // <-- this does work, accesses each element similar to using 'this' inside a function bound to an even
            ///console.log(this) <-- does not work, this = Window object from onload
            let value = $(event.target).val()
            switch (value) {
                case "BR":
                    $("#placeholder > div").css("backgroundColor", "lightyellow")
                    break;
                case "LN":
                    $("#placeholder > div").css("backgroundColor", "orange")
                    break;
                case "DN":
                    $("#placeholder > div").css("backgroundColor", "navy")
                    break;
                default: break;
            }
        });
    });
}

class Food {

    constructor(calories, name, portion, weight, type) {
        this.calories = calories  // calories/portion 
        this.name = name
        this.portionSize = portion // grams
        this.weight = weight //grams
        this.type = type
        this.extraInfo = []
    }

    setType(type) {
        console.log("Switching on selection: " + type)
        switch (type) {
            case "BR":
                this.type = "Breakfast"
                break;
            case "LN":
                this.type = "Lunch"
                break;
            case "DN":
                this.type = "Dinner"
                break;
            default: break;
        }
    }

    computeCalories() {
        console.log("us: ")
        console.log(this)
        let total = (this.weight / this.portionSize) * this.calories
        return total.toFixed(2)
    }

    foodItemContent() {
        let content = `<div class='${this.type}'>`
        content += "<h1>" + this.name + "</h1>"
        content += "<p>" + this.computeCalories() + " calories </p>"
        content += "<ul>"
        $(this.extraInfo).each((ind, item) => {
            content += "<li>" + extraInfoMap[item] + "</li>"
        })
        content += "</ul>"
        content += "</div>"
        return content
    }
}



