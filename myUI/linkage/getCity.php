<?php
	include 'common.php';
	$area_id = urldecode($_GET['province']);
	$sql = "select * from city where provinc_id = '$area_id' ";

	$arr = array();
	$query = mysql_query($sql);
	while($row = mysql_fetch_assoc($query)) {
		$arr[] = $row;
	}
	echo json_encode($arr)
?>