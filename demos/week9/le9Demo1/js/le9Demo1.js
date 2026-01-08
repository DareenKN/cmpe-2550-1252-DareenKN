let myArray = []//Will be used below to create an array of Students
let studentCount = 0;

window.onload = () => {
     document.querySelector("#demo1A").onclick = demoObject1;
     document.querySelector("#demo1B").onclick = demoObject2;
     document.querySelector("#demo1C").onclick = demoObject3;
      document.querySelector("#demo1D").onclick = testPseudoClass1;
     document.querySelector("#demo1E").onclick = testPseudoClass2;
      document.querySelector("#demo1F").onclick = displayNextStudent;
    document.querySelector("#demo1G").onclick = createImage;
    
    //When the form loads, we call CreateStudentArray() to create an array of Student
    //Objects- The function displayNextStudent will then iterate through the array
       createStudentArray();
}


function demoObject1() {
    let invoice = {
        invoiceNumber: "121324",
        taxRate: 0.05
    }
    console.log(invoice);
    console.log("invoice num: " + invoice.invoiceNumber);
    console.log("tax Rate: " + invoice.taxRate);
    alert("Invoice Number =" + invoice.invoiceNumber);
    alert("TaxRate=" + invoice.taxRate);
}



function demoObject2() {
    let invoice = {
        invoiceNumber: "121324",
        taxRate: 0.05,
        getTotalAmount: function (subtotal) {
            return subtotal * (1 + this.taxRate);
        }
    }



    console.log("Invoice Number= " + invoice.invoiceNumber);
    console.log("Invoice Total= " + invoice.getTotalAmount(200));
    invoice.invoiceNumber = "789654";
    console.log("Invoice Number= " + invoice.invoiceNumber);
    delete invoice.invoiceNumber;
    console.log("Invoice Number= " + invoice.invoiceNumber);
    console.log(invoice);
}



function demoObject3() {
    //iterating through the properties of an object
    let invoice = {
        invoiceNumber: "121324",
        taxRate: 0.07,
        costBeforeTax: 250

    }

    for (var key in invoice) {
        console.log(`${key}: ${invoice[key]}`);

    }


}


let invoice = function (invoicenum, rate) {
    this.invoiceNumber = invoicenum;
    this.taxRate = rate;
}



function testPseudoClass1() {
    let invoice1 = new invoice("14532", 0.025);
    let invoice2 = new invoice("43215", 0.075);
    alert("info for invoice1- num:" + invoice1.invoiceNumber
        + "  rate: " + invoice1.taxRate);
    alert("info for invoice2- num:" + invoice2.invoiceNumber
        + "  rate: " + invoice2.taxRate);
}


invoice.prototype.calculateTotal = function (subtotal) {
    return (subtotal * (1 + this.taxRate)).toFixed(2);
}

function testPseudoClass2() {
    let invoice1 = new invoice("14532", 0.025);
    let invoice2 = new invoice("43215", 0.075);
    alert("info for invoice1- num:" + invoice1.invoiceNumber
        + " Total: " + invoice1.calculateTotal(100));
    alert("info for invoice2- num:" + invoice2.invoiceNumber
        + " Total: " + invoice2.calculateTotal(300));

}

//Creating a student constructor as a named function

function Student(name, Id) {
    this.stdName = name;
    this.stdId = Id;
}

function createStudentArray() {
    let student1 = new Student("Johnny Smith", 123);
    let student2 = new Student("Jane Alfredo", 246);
    let student3 = new Student("Michael Corleone", 324);
    let student4 = new Student("Agatha Theore", 121);
    let student5 = new Student("Maryline Jasper", 259);
    myArray.push(student1);
    myArray.push(student2);
    myArray.push(student3);
    myArray.push(student4);
    myArray.push(student5);

}


function displayNextStudent() {
    let elem = document.querySelector("#studentPlaceHolder");
    let str = `Name: ${myArray[studentCount].stdName} - Id: ${myArray[studentCount].stdId}`;
    elem.innerHTML = str;
    studentCount = (++studentCount) % (myArray.length);

}


//Declare myImage as global
let myImage;

//Creates an image element with the 
// src attribute set to "images/picture1.jpg"
// and height set to 200 px

function createImage() {
    let myImage = new Image();
    myImage.src = "images/picture1.jpg";
    myImage.style.height = "200px";
    let elem = document.querySelector("#picture");

    elem.setAttribute("src", myImage.src);
    elem.style.height = myImage.style.height;
}

