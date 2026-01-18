<!--

API – Application Programming Interface
REST API – Representational state Transfer API – set of rule and conventions 

1.	Stateless communication – No session – Scaling 
2.	Resources – Data/ functionality 
3.	HTTP methods-   /books
a.	GET   	-  All books
b.	POST    -  Insert
c.	PUT	- Update	
d.	DELETE – Delete
4.	Standard Data format: JSON, XML 
5.	Uniform Interface:    URI       /server.php/books/verb/1/

Scalability , Flexibility , Maintainability 

-->

<?php
?>
<!DOCTYPE html>
<html>
    <head>
        <title>CMPE2550 REST DEMO</title>
        <meta charset="UTF-8">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
        <script type="text/javascript" src="stuff.js"></script>
        <style>
            div a:link, div a:visited{
                font-size:0.8em;
            }
        </style>
    </head>
    <body>
        <h1>CMPE2550 for Lab03 - Winter 2025</h1><hr/>
       
        
        <input type="button" id="testGET" value="GET">
        <input type="button" id="testPOST" value="POST">
        <input type="button" id="testPUT" value="PUT">
        <input type="button" id="testDELETE" value="DELETE">

        <hr/>
        <div id="output">
            
        </div>
    </body>
</html>