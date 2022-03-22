<!DOCTYPE html>
<html>
<head>
	<title>ajax</title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<script src="ajax.js"></script>
	<script>
		var ajax = newAjax();
	</script>
</head>
<body>
<pre>
var ajax = newAjax(); 
ajax.post('http://admin.client.com/api/app/menus').then( res => { console.log(res) });
</pre>
<script>
var ajax = newAjax();
ajax.post('http://admin.client.com/api/app/menus').then( res => { console.log(res) });
ajax.postWait('http://admin.client.com/api/app/menus',null,res => { console.log(res) });
</script>
</body>
</html>
