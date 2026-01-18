<?php
    $age= 42;

    /******************************
     * Function : MakeArray
     * Purpose  : To generate an array 
     * Inputs   : Number of elements
     * Output   : An array 
     ******************************/
    function MakeArray($quantity)
    {
        $stars= array(); // an empty array

        for($i = 0; $i <= $quantity; ++$i )
        {
            $stars[] = "*";
        }
        return $stars; // Return the list back to calling location
    }

?>