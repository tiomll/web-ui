<?php
    $arr = array();
    for ($i=1; $i<=10; $i++){
      $arr[] = $_GET['search_keyword'].$i;
    }
    echo 'data:'.json_encode($arr);

?>