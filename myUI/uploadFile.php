<?php
if (is_uploaded_file($_FILES['upfile']['tmp_name'])) {
	$upfile = $_FILES['upfile'];
	$name = $upfile["name"]; //上传文件的文件名 
	$type = $upfile["type"]; //上传文件的类型 
	$size = $upfile["size"]; //上传文件的大小 
	$tmp_name = $upfile["tmp_name"]; //上传文件的临时存放路径 
	//判断是否为图片 
	switch ($type) {
		case 'image/pjpeg':
			$okType=true; 
			break; 
		case 'image/jpeg':
			$okType=true; 
			break; 
		case 'image/gif':
			$okType=true; 
			break; 
		case 'image/png':
			$okType=true; 
			break; 
	}

	if ($okType) {
		//把上传的临时文件移动到 upload 目录下面 
		move_uploaded_file($tmp_name,'upload/'.$name);
		echo "upload/".$name; 
	} else {
		echo "请上传jpg,gif,png等格式的图片！";
	}
}
?> 