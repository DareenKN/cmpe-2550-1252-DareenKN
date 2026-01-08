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
$(()=> {
    console.log(burger)
    console.log(sandwich.computeCalories())
    console.log(fries.computeCalories())
    placeholder = document.querySelector("#placeholder")
    //document.querySelector("#saveFood").onclick = saveFoodItem
    let radioButtons = $('.mealTypePicker')
    console.log("Jquery radio buttons: " + radioButtons)
    // Old way -- Note element is first index is second
    // radioButtons.forEach((element,index)=>{
    //     console.log(element)
    // })
    // New Way -- Note index is first element is second
    // ANother way to use each()
    $.each(radioButtons,(index, element)=>{
        console.log("Jquery each 1: ")
        console.log(element)
        element.onchange = (event)=>{
            console.log(event.target.value)
        }
        $(element).change(()=>{
            console.log($(element).val())
        })
    })
    $(radioButtons).each((index, element)=>{
        console.log("Jquery each 2: ") 
        console.log(element)
    })
    let radio = document.querySelectorAll(".mealTypePicker")
    checkboxes = document.querySelectorAll("[name=extraInfo]")
    //!!!!!!!!!!!!!!!  Binding validation function to SUBMIT EVENT of the FORM !!!!!!!!!!!!!!!!!!!!!
    let form = document.querySelector("form") 
    //form.onsubmit = validateForm
    // Binding validation to submit event using JQUERY !!!!!!!!!!!!!!!!!!!!
    $("form").submit(validateForm)
    
    radio.forEach(element => {
        console.log("Foreach: ")
        console.log(element)
        // element.onchange = (event) =>{
        //     console.log(event.target) // <-- this does work, accesses each element similar to using 'this' inside a function bound to an even
        //     ///console.log(this) <-- does not work, this = Window object from onload
        //     let value = event.target.value
        //     switch(value){
        //         case "BR":
        //             document.body.style.backgroundColor = "lightyellow"
        //             break;
        //         case "LN":
        //             document.body.style.backgroundColor = "orange"
        //             break;
        //         case "DN":
        //             document.body.style.backgroundColor = "navy"
        //             break;
        //         default: break;
        //     }
        //}
    });
})


function validateForm(){
    console.log("Valdidation started")
    let name = document.querySelector("#food_name").value
    let weight = document.querySelector("#quantity").value
    let portion = document.querySelector("#portion").value
    let calories = document.querySelector("#calories").value
    let checkedRadio = document.querySelector(".mealTypePicker:checked") 
    console.log("Checked radio box: "+ ( checkedRadio ?? "Value is null"))
    if(!checkedRadio){
        alert("Please select a checbox")
        return false
    }
    let weightNum = parseInt(weight)
    let portionNum = parseInt(portion)
    let caloriesNum = parseInt(calories)
    if(isNaN(weightNum) || isNaN(portionNum)  || isNaN(caloriesNum)){
        alert("Invalid inputs")
        return false
    }
    saveFoodItem(name, weightNum, caloriesNum, portionNum)
    return true
}

function saveFoodItem(name, weight, calories, portion){
    let foodItem = new Food(calories,name,portion,weight)
    let checkedRadio = document.querySelector(".mealTypePicker:checked")
    foodItem.setType(checkedRadio.value)
    let extraArray = []
    checkboxes.forEach((checkbox)=>{
        if(checkbox.checked)
            extraArray.push(checkbox.value)
        console.log("inner HTML for checkbox: " + checkbox.innerHTML)
    })
    foodItem.extraInfo = extraArray
    array.push(foodItem)
    displayFoodItems()
    console.log(array)
}

function displayFoodItems(){
    placeholder.innerHTML = ""
    array.forEach((food)=>{
        let div = document.createElement("div")
        div.innerHTML = food.foodItemContent() 
        placeholder.appendChild(div)
    })
}


class Food{

    constructor(calories, name, portion, weight, type) {
        this.calories = calories  // calories/portion 
        this.name = name
        this.portionSize = portion // grams
        this.weight = weight //grams
        this.type = type
        this.extraInfo = []
       }  
    
    setType(type){
        console.log("Switching on selection: " + type)
        switch(type){
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
        console.log("us: " + this)
        let total = ( this.weight / this.portionSize ) * this.calories
        return total.toFixed(2)
    }

    foodItemContent() {
        let content =`<div class='${this.type}'>`
        content += "<h1>" + this.name + "</h1>"
        content += "<p>" + this.computeCalories() + " calories </p>"
        content += "<ul>"
        this.extraInfo.forEach((item)=>{
            content += "<li>" + extraInfoMap[item] + "</li>"
        })
        content += "</ul>"
        content += "</div>"
        return content
    }
}

var sandwich = new Food(250,"sandwich", 200, 205, "breakfast")
var burger = new Food(500,"burger", 250, 250, "lunch")
var fries = new Food(160,"fries", 80, 120, "lunch")


