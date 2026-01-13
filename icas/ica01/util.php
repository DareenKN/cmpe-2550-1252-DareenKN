<?php
// util.php

function GenerateNumbers()
{
    $arr = [];

    for ($i = 1; $i <= 10; $i++) {
        $arr[] = $i;
    }

    shuffle($arr);
    return $arr;
}

function MakeList($arr)
{
    $out = "<ol>";

    foreach ($arr as $val) {
        $out .= "<li>$val</li>";
    }

    $out .= "</ol>";
    return $out;
}
?>
