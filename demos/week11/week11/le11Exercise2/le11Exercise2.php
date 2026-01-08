<?php

  $Students=array(
            array("Johnny","Hopkins","2021213","CNT",2),
            array("Chelsea","Mover","2021546","DMIT",4),
            array("Jennifer","Farmer","2018165","BAIST",3),
            array("Melvin","Jasper","2019564","CNT",3),
            array("Anthony","Dyer","2019398","DMIT",3)
  );

$index=$_GET['selectPosn'] - 1;




//global $chosenStudent;   
global $status;

class Student{
  public $FirstName= "";
  public $LastName="";
  public $Id="";
  public $Program="";
  public $Term=0;
  }

$chosenStudent= new Student();

$chosenStudent->FirstName=$Students[$index][0];
$chosenStudent->LastName=$Students[$index][1];
$chosenStudent->Id=$Students[$index][2];
$chosenStudent->Program=$Students[$index][3];
$chosenStudent->Term=$Students[$index][4];


//echo("going to display first student");
//echo($chosenStudent->FirstName);
/*$response=[];
$response['result']=$chosenStudent;
$response['status']="Success";*/

echo json_encode($chosenStudent);
//echo($chosenStudent);


?>       