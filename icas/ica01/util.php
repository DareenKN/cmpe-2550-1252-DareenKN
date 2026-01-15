<?php
/* CMPE2550 - Web Applications
 * Name: Dareen Kinga Njatou
 * ICA1 - PHP Intro - util.php
 * Description: Utility functions for ICA01
 * Date: January 12, 2026 
 * util.php
 */

/**
 * Summary of GenerateNumbers
 * Description: This function generates an array of numbers from 1 to 10 in random order.
 * @return array
 */
function GenerateNumbers()
{
    $arr = [];  // Initialize empty array

    // Populate array with numbers 1 to 10
    for ($i = 1; $i <= 10; $i++) {
        $arr[] = $i;
    }

    // Shuffle the array to randomize order
    shuffle($arr);
    return $arr;
}

/**
 * Summary of MakeList
 * Description: This function takes an array as input and generates an HTML ordered list.
 * @param mixed $arr
 * @return string
 */
function MakeList($arr)
{
    $out = "<ol>";      // Start ordered list

    // Add each array element as a list item
    foreach ($arr as $val) {
        $out .= "<li>$val</li>";
    }

    $out .= "</ol>";    // End ordered list
    return $out;        // Return the complete HTML list
}
?>
