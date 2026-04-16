// Js file for Exam 04

// Base URL
var baseUrl= "http://localhost:5002";

/* Page onload code*/
$(()=>
{
    console.log("On page load");
    
    $("#RetItem").click(RetrieveItems);
    $("#AddItem").click(InsertItem);
    $("#DeleteItem").click(DeleteItem);
    $("#UpdateItem").click(UpdateItem); 
   
})

function RetrieveItems()
{
    console.log("Item Retrieve part");
    var startDate= $("#startDate").val();
    var endDate = $("#endDate").val();

    CallAJAX(baseUrl+ "/RetrieveItems/"+startDate+"/"+endDate,{}, "JSON","GET", ProcessRetrieve, processError);
    return false; 
}

function ProcessRetrieve (data,status)
{ 
    console.log(data);
     if(data.length > 0)
        {
            str = "<table>";
            str = str + "<tr>";
            str = str + "<th> Item ID  </th>";
            str = str + "<th> Item Name </th>";
            str = str + "<th> Price </th>";
             str = str + "<th> Total Revenue </th>";
            str = str + "</tr>";
            for(var i=0; i<data.length; ++i)
            { 
                str+= "<tr><td>" + data[i]['itemId']
                       + "</td><td>" + data[i]['itemName']
                       + "</td><td>" + data[i]['itemPrice']
                       + "</td><td>" + data[i]['totalRevenue']
                       + "</td></tr>";
            }
            str += "</table>";
           // console.log(str);
        }
        else
        {
            str="<h2>No data. Please try again! Make sure your server is </h2>";
        }
       
    $("#RetItemMessage").html(str);
    

}

function InsertItem()
{
    console.log("Item Insert part");
    let postData = {};
    
    postData['id']= $("#id").val();
    postData['name'] = $("#ItemName").val();
    postData['price'] = $("#ItemPrice").val();
    
    // Comment out this if part to test server side validation
    /*
    if ( postData['name'].length==0  || postData['price']==0 )
    {
        alert("Missing required values");
        return false;
    }
    */  
    CallAJAX(baseUrl+ "/InsertItem",postData, "JSON","POST", ProcessInsert, processError);
    return false; 
}

function ProcessInsert(data,status)
{ 
    console.log(data);
    
    if(data['status']=="Success")
    {
        
        $("#AddItemMessage").html("<h2>" + data['message'] + "</h2>");
    }
    else{
       
        $("#AddItemMessage").html("<h2>" + data['message']+"</h2>");
    }

}

function DeleteItem()
{
    let postData = {};
    var url = baseUrl + "/DeleteItem";
    var id= $("#dIid").val();

    // Comment out this if part to test server side validation
    /*
    if (id.length==0)
    {
        alert("Missing Id value");
        return false;
    }
    */
    CallAJAX(url+"/"+id,postData, "JSON","DELETE", SuccessDeleteItem, processError);
    
}

function SuccessDeleteItem(data, status)
{
    console.log(data);
    
    $("#DeleteItemMessage").html("<h2>" + data['message']+"</h2>");
    
}

function UpdateItem()
{
    console.log("item in update part");
    let postData = {};
    
    postData['id']= $("#Iid").val();
    postData['name'] = $("#UItemName").val();
    postData['price'] = $("#UItemPrice").val();
     // Comment out this if part to test server side validation
    /*
    if (postData['id'].length==0 || postData['name'].length==0  || postData['price']==0 )
    {
        alert("Missing required values");
        return false;
    }
    */
    
    CallAJAX(baseUrl+ "/UpdateItem",postData, "JSON","PUT", ProcessUpdate, processError);
    return false; 
}

function ProcessUpdate(data,status)
{ 
    console.log(data);
    
    if(data['status']=="Success")
    {
        
        $("#UpdateItemMessage").html("<h2>" + data['message'] + "</h2>");
    }
    else{
       
        $("#UpdateItemMessage").html("<h2>" + data['message']+"</h2>");
    }

}


//Function for making Ajax calls
function CallAJAX(myURL, myData, myDataType, myType, SuccessFunction, errorFunction)
{
    let ajaxOptions={};

    ajaxOptions['url']= myURL;
    ajaxOptions['data']= JSON.stringify(myData);  //new
    ajaxOptions['type']= myType;
    ajaxOptions['dataType']= myDataType;
    ajaxOptions['contentType']= "application/json";   //new
    ajaxOptions['success']= SuccessFunction;
    ajaxOptions['errror']= errorFunction;

    // Making Ajax call
    $.ajax(ajaxOptions);
}

function processSuccess(data,status){
    console.log(data);
    console.log("Status",status);
    
 }
 function processError(jqXHR,status, message){
    alert("Error");
    console.log("Status",status);
    console.log("Message",message);
 }
