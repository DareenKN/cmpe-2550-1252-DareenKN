/* This javascript file is used to demonstrate access to the
   web service provided by the NHTSA website.
   We are pulling here the different models of Toyota 
   for the year 2015, and dynamically building a table on the web page
   with all the retuned models.

   I have implemented 4 versions of the processSuccess
   function, each one showing a different way of 
   building the table.

   Note that the returned data contains a Results array
   that contains our Makes and Models informarion
   
   You'll obviously need only one version at a time. So
   ensure that the other versions are commented.

   Oveeyen Moonian - April 14, 2021
   */


$(function () {

  $('#button1').on("click", () => {
    alert("button1-clicked");
    //anonymous function to handle the click event
    //create some data to send to the server
    RequestModel();
  });
});


/*RequestModel() is the function that makes our ajax()
  call */
function RequestModel() {
  //populate our data object
  let getData = {};
  getData['format'] = 'json';

  //send the data to an appropriate server

  //Note that the server name consists of 2 parts here
  //One part is the base address of the site
  //the other is for our specific query
  let base_url = 'https://vpic.nhtsa.dot.gov/api/vehicles';
  let addedstring = '/GetModelsForMakeYear/make/toyota/modelyear/2015';

  let myURL = base_url + addedstring;
  //populate an AJAX request
  //url - where to send the request
  //type - GET
  //data - what are we sending to the web service? Must match the spec
  //dataType - json
  //success - callback function for a success
  //error - callback function for an error
  $.ajax({
    url: myURL, type: 'GET', data: getData,
    dataType: 'json', success: processSuccess,
    error: processError
  });
}


/* Version 1 of the processSuccess() function
   It iterates through the Results array using a 
   traditional  for loop and builds an html string for the
   table.
   It then uses the html() function of jQuery to
   add the table to the Wed page.
*/
/*
function processSuccess(result, resultStatus) {

  console.log(result);
  
    
      let str = "<table>";
      str = str + "<tr>";
      str = str + "<th> Make Id </th>";
      str = str + "<th> Make Name </th>";
      str = str + "<th> Model Id </th>";
      str = str + "<th> Model Name </th>";
      str = str + "</tr>";
      for (let i = 0; i < result.Count; i++) {
        str = str + "<tr>";
        str = str + "<td>" + result.Results[i]['Make_ID'] + "</td>";
        str = str + "<td>" + result.Results[i]['Make_Name'] + "</td>";
        str = str + "<td>" + result.Results[i]['Model_ID'] + "</td>";
        str = str + "<td>" + result.Results[i]['Model_Name'] + "</td>";
        str = str + "</tr>";
      }
      str = str + "</table>";
    
      $("#placeHolder").html(str);
    
}
*/


/*Version 2 of the processSuccess() function
   It iterates through the Results array using a 
   traditional  for loop and builds the table, by using
   document.createElement() and the jQuery append()
   method. It then appends the element to the placeHolder
   div
*/

/*
function processSuccess(result,resultStatus){
    
    console.log(result);
    let myTable=document.createElement("table");
    let headerRow=document.createElement("tr") ;
    $(myTable).append(headerRow);
  
    let headerCell1= document.createElement("th")
    $(headerRow).append(headerCell1);
    $(headerCell1).append("Make Id");

    let headerCell2= document.createElement("th")
    $(headerRow).append(headerCell2);
    $(headerCell2).append("Make Name");

    let headerCell3= document.createElement("th")
    $(headerRow).append(headerCell3);
    $(headerCell3).append("Model Id");

    let headerCell4= document.createElement("th")
    $(headerRow).append(headerCell4);
    $(headerCell4).append("Model Name");
   
   for (let i=0; i<result.Count;i++){
    let row=document.createElement("tr") ;
    $(myTable).append(row);
    let cell1= document.createElement("td");
        cell1.append(result.Results[i].Make_ID);
    let cell2= document.createElement("td");
        cell2.append(result.Results[i].Make_Name);  
    let cell3= document.createElement("td");
        cell3.append(result.Results[i].Model_ID);
    let cell4= document.createElement("td");
        cell4.append(result.Results[i].Model_Name); 
    $(row).append(cell1);
    $(row).append(cell2);
    $(row).append(cell3);
    $(row).append(cell4);
    $(myTable).append(row);
    }
   
  $("#placeHolder").append(myTable);
}

*/


/*Version 3 of the processSuccess() function
   It iterates through the Results array using the
   each() function of javascript and builds an html string for the
   table.

   Note that the each() function has as parameter 
   a function (an arrow function is being used in this 
   case). The parameters of this function are the index 
   and object of the corresponding array elements.

   It then uses the html() function of jQuery to
   add the table to the Wed page.
*/


function processSuccess(result, resultStatus) {

  console.log(result)

  // let str = "<table>"
  // str += "<tr>"
  // str += "<th> Make Id </th>"
  // str += "<th> Make Name </th>"
  // str += "<th> Model Id </th>"
  // str += "<th> Model Name </th>"
  // str += "</tr>"
  // $(result.Results).each((i, x) => {
  //   str += "<tr>"
  //   str += "<td>" + x.Make_ID + "</td>"
  //   str += "<td>" + x.Make_Name + "</td>"
  //   str += "<td>" + x.Model_ID + "</td>"
  //   str += "<td>" + x.Model_Name + "</td>"
  //   str += "</tr>"
  // })
  // str += "</table>"

  let str = "<table>"

  str += "<tr><th>*</th>"

  for (let i = 1; i < 9; i++)
    str += `<th>${i}</th>`

  str += "</tr>"

  for (let i = 1; i < 9; i++) {
    str += "<tr>" + `<th>${i}</th>`
    for (let j = 1; j < 9; j++)
      str += `<td>${i * j}</td>`

    str += "</tr>"
  }
  str += "</table>"

  $("#placeHolder").html(str)
}

/*Version 4 of the processSuccess() function
   It iterates through the Results array using the
   each() function of javascript and builds the table, by using
   document.createElement() and the jQuery append()
   method. It then appends the element to the placeHolder
   div

   Note that the each() function has as parameter 
   a function (an arrow function is being used in this 
   case). The parameters of this function are the index 
   and object of the corresponding array elements.

   It then uses the html() function of jQuery to
   add the table to the Wed page.
*/

/*
function processSuccess(result, resultStatus) {

  console.log(result);
  let myTable = document.createElement("table");
  let headerRow = document.createElement("tr");
  $(myTable).append(headerRow);

  let headerCell1 = document.createElement("th")
  $(headerRow).append(headerCell1);
  $(headerCell1).append("Make Id");

  let headerCell2 = document.createElement("th")
  $(headerRow).append(headerCell2);
  $(headerCell2).append("Make Name");

  let headerCell3 = document.createElement("th")
  $(headerRow).append(headerCell3);
  $(headerCell3).append("Model Id");

  let headerCell4 = document.createElement("th")
  $(headerRow).append(headerCell4);
  $(headerCell4).append("Model Name");

  $(result.Results).each((i, x) => {
    let row = document.createElement("tr");
    $(myTable).append(row);
    let cell1 = document.createElement("td");
    cell1.append(x.Make_ID);
    let cell2 = document.createElement("td");
    cell2.append(x.Make_Name);
    let cell3 = document.createElement("td");
    cell3.append(x.Model_ID);
    let cell4 = document.createElement("td");
    cell4.append(x.Model_Name);
    $(row).append(cell1);
    $(row).append(cell2);
    $(row).append(cell3);
    $(row).append(cell4);
    $(myTable).append(row);
  });


  $("#placeHolder").append(myTable);

}

*/
function processError(xhr, status, thrownError) {
  console.log("An error has occured");
}