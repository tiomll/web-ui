<?php
	include 'common.php';
	$sql = "select * from province";

	$arr = array();
	$query = mysql_query($sql);
	while($row = mysql_fetch_assoc($query)) {
		$arr[] = $row;
	}
	echo json_encode($arr)
?>