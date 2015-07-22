<?php
	$link = mysql_connect("localhost","root","");
	mysql_select_db("novel", $link);
	mysql_query("set names 'utf8'", $link);
?>