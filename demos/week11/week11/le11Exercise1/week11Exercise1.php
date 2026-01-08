<?php
  
   $program_value=$_GET['Program'];
   $firstName=$_GET['FName'];
   $lastName=$_GET['LName'];
   $std_Age= $_GET['Age'];
  
   $duration=0;
   if ($program_value==1)
     $duration=2;
   else if ($program_value==2)
     $duration=3;    
   else if ($program_value==3)  
      $duration=4;
   else   
      $duration=5;
  
   $str="<p> Hi " .$firstName." ".$lastName ."</p>";
   
   $str=$str."<p> You have chosen a program of ".$duration." years</p>";
   
   $str=$str."<p> You will finish at the age of ".($std_Age +$duration)."</p>";
   
   echo $str;
  
                        
  //echo 'successful call';

?>   