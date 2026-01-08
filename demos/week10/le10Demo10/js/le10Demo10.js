$(function () {
    /* $("[type=text]") will return an array of all elements 
       for which the attribute type has a value 'text'
       However if we take the val(), we'll get the value of the first
       element only. We are assigning this value to the span element
       with id 'placeholder'.
       */

    /*
        $("#button1").on("click", function (e) {
            let firstVal = $("[type=text]").val();
            $("#placeHolder").html(firstVal);
        });
        */

    /* On clicking 'button2' we treat the object returned by
      $("[type=text")as an array. We can access each such element
      and obtain their respective values. Note that, we use 'value' here
      not val().
    */

    /*
    $("#button2").on("click", function (e) {
        $("#placeHolder2").html("No. of text Elements: " + $('[type=text]').length)
        let firstVal = $("[type=text]").val();
        let secondVal = $("[type=text]")[1].value;
        let thirdVal = $("[type=text]")[2].value;
        $("[type=text]")[3].value = firstVal + " " + secondVal + " " + thirdVal;
    });
    */

    /*The functions below illustrate another way of accessing the 
      individual elements of the returned array
    */
    /*
     $("#button3").on("click", function (e) {
         $("#placeHolder3").html($("[type=text]").get(1).value);
     });
 */
 
     /*
     $("#button4").on("click", function (e) {
         $("[type=text]").get(1).value = "Hi There!";
     });
 */
 
     /*
     //Iterating through all the selected elements using the each function
     $("#button5").on("click", () => {
 
         $("[type=text]").each((index, item) => { //Using the each() function
             // Note that the item at each position is a javascript object.
             //So we have to use the value propertt
             alert(`Value at Position ${index} = ${item.value}`);
 
         })
     }
     )
 
 */
 
 
     /*
 
     //An alternative way of writing the event listener for button 5 is to
     // convert the item to a jQuery object using $, then using the val() method
     $("#button5").on("click", () => {
 
         $("[type=text]").each((index, item) => {
 
             alert(`Value at Position ${index} = ${$(item).val()}`);
 
         })
     })
 */
});


