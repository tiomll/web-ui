<?php   
	include 'common.php';
	$area_id = urldecode($_GET['city']);
	$sql = "select * from area where city_id = '$area_id' ";

	$arr = array();
	$query = mysql_query($sql);
	while($row = mysql_fetch_assoc($query)) {
		$arr[] = $row;
	}
	echo json_encode($arr)
?>