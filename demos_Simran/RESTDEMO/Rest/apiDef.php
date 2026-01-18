<?php
//error_log(json_encode($_GET));

//https://thor.cnt.sast.ca/~aulakhha/CMPE2550/Demos/Demo6/Rest/example/place/10/Pkus/Other/35/whatever

class MyAPI
{
    private $method = '';     // storing the HTTP method by which the request was received
    private $endpoint = '';   // storing the sought after endpoint function in the extended class
    private $verb = '';       // storing a contextualizing piece of information to be used with the method
    private $args = Array();  // storing all of the rest of the information passed in the URI
    private $file = Null;     // storing information extracted from the "file" accompanying a PUT/DELETE method      
    private $cleanedData;


    public function __construct($request)
    {
        header("Content-Type: application/json");
        error_log("Inside Constructor function ");
        error_log( "Inside constructor: ".$_SERVER['REQUEST_METHOD']);
        error_log("Request: ".$request);
        error_log("GET: ". json_encode($_GET));
        error_log("Post: ".json_encode($_POST));
        error_log("");

        //  GET Rest/example/place/40 HTTP/1.1
        //  header(s)
        //
        //  Payload

        //  HTTP/1.1 200 OK
        //  header(s)
        //
        //  Payload - json data


        $this->parseRequest($request);

        $this->method = $_SERVER['REQUEST_METHOD'];     // Retrieve the method used to submit the AJAX request 


        switch($this->method) 
        {
            case 'DELETE':
                parse_str(file_get_contents("php://input"), $this->file);
                $this->cleanedData = $this->_cleanInputs($this->file);
                break;
            case 'POST':
                //parse_str(file_get_contents("php://input"), $this->file);
                $this->cleanedData = $this->_cleanInputs($_POST);
                break;
            case 'GET':
                //parse_str(file_get_contents("php://input"), $this->file);
                $this->cleanedData = $this->_cleanInputs($_GET);
                break;
            case 'PUT':
                parse_str(file_get_contents("php://input"), $this->file);
                $this->cleanedData = $this->_cleanInputs($this->file);
                break;
            default:
                $this->_response('Invalid Method', 405);
                break; 
        }

        error_log("Mehtod: ". json_encode($this->method));
        error_log("Endpoint: ".json_encode($this->endpoint));
        error_log("Verb: ".json_encode($this->verb));
        error_log("Arguments: ".json_encode($this->args));
        error_log("File: ".json_encode($this->file));    
        error_log("");
    }
    //Parsing the request and extracting Endpoint and verb from URIs 
    private function parseRequest($request)
    {
        error_log("Inside Parse Request method");
        // Remove a trailing '/' if there is one, then separate the URI by '/' chars
        // Store the result in args member
        $this->args = explode('/', rtrim($request, '/'));   

        // Remove the the first item of the array and store it as the endpoint
        $this->endpoint = array_shift($this->args);

        // If any items remain and the first is not a numeric value, store it as the verb
        if (array_key_exists(0, $this->args) && !is_numeric($this->args[0])) {
            $this->verb = array_shift($this->args);
        }
    } 
// Recurisve method to clean variable or an array
    private function _cleanInputs($data) {

        $clean_input = Array();
        if (is_array($data)) {
            foreach ($data as $k => $v) {
                $clean_input[$k] = $this->_cleanInputs($v);
            }
        } else {
            $clean_input = trim(strip_tags($data));
        }
        return $clean_input;
    }


    
   
    private function example()
    {
        error_log("Inside Example function");
        if ($this->method == 'GET') {
             return "method is GET <br/>- Args : " . json_encode($this->args) 
                     . "<br/> - Cleaned Data : " . json_encode($this->cleanedData) 
                     . "<br/> - File : " . json_encode($this->file)
                     . "<br/> - \$_POST : " . json_encode($_POST)
                     . "<br/> - \$_GET : " . json_encode($_GET);
            
        }
        else if ($this->method == 'POST'){
            return "method is POST <br/>- Args : " . json_encode($this->args) 
            . "<br/> - Cleaned Data : " . json_encode($this->cleanedData) 
            . "<br/> - File : " . json_encode($this->file)
            . "<br/> - \$_POST : " . json_encode($_POST)
            . "<br/> - \$_GET : " . json_encode($_GET);;
        } 
        else if ($this->method == 'PUT'){
            return "method is PUT <br/>- Args : " . json_encode($this->args) 
            . "<br/> - Cleaned Data : " . json_encode($this->cleanedData) 
            . "<br/> - File : " . json_encode($this->file)
            . "<br/> - \$_POST : " . json_encode($_POST)
            . "<br/> - \$_GET : " . json_encode($_GET);;
        } 
        else if ($this->method == 'DELETE'){
            /*return "method is DELETE <br/>- Args : " . json_encode($this->args) 
            . "<br/> - Cleaned Data : " . json_encode($this->cleanedData) 
            . "<br/> - File : " . json_encode($this->file)
            . "<br/> - \$_POST : " . json_encode($_POST)
            . "<br/> - \$_GET : " . json_encode($_GET);;
            */
            return $this->MyDELETEMethod();
        } 
        else {
            return "Invalid Request Type!";
        }
    }


    public function MyDELETEMethod()
    {
        error_log("Inside delete function");
        return "A message from delete method";
    }

    public function processAPI() {
        if (method_exists($this, $this->endpoint)) {
           error_log("Before calling Example function");
            return $this->_response($this->{$this->endpoint}($this->args));
        }
        return $this->_response("No Endpoint: $this->endpoint", 404);
    }

    
    private function _response($data, $status = 200) {
        error_log("Inside Response function");
        header("HTTP/1.1 " . $status . " " . $this->_requestStatus($status));
        return json_encode($data);
    }

    private function _requestStatus($code) {
        error_log("Inside Response Status  function");
        $status = array(  
            200 => 'OK',
            404 => 'Not Found',   
            405 => 'Method Not Allowed',
            500 => 'Internal Server Error',
        ); 
        return ($status[$code])?$status[$code]:$status[500]; 
    }  
}