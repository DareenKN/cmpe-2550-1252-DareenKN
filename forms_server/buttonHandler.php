<?php
  $first_name= $_POST["text1"];
  $last_name= $_POST["text2"];
  $choice1=$_POST["topping1"];
  $choice2=$_POST["topping2"];
  $choice3=$_POST["topping3"];
  echo nl2br("First Name:   ". $first_name."\n");
  echo nl2br("Last Name:   ". $last_name."\n");
  echo nl2br("Choice 1:   ". $choice1."\n");
  echo nl2br("Choice 2:   ". $choice2."\n");
  echo nl2br("Choice 3:   ". $choice3."\n");
?>               