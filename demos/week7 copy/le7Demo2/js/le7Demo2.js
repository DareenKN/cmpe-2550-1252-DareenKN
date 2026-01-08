//File le7Demo2.js
/*Function called on form validation for file
  le2Demo7/index.html
  The function will return false if the textbox
  for firstname is empty. Otherwise, it returns true.
  
  */



function validate() {
  alert("Hi!- Performing Form Validation");
  var elem = document.querySelector("[name=firstName]");
  if (elem.value == "") {
    alert("First Name Cannot be Null");
    return false;
  }
  alert("Valid Value");
  return true;

}


