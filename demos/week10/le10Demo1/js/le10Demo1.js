/*The $(document).ready() is like the
window.onload event. It can accomodate an
anonymous function in which we can register our event listeners.
Note that event listeners can also be anonymous functions
*/
$(document).ready(function () {

    $("#colorButton").hide()

    $("#mybutton").click(function () {
        $("#placeholder").html("Hello Baby girl")
        $("#colorButton").show()
    })

})






