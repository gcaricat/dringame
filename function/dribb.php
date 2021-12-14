<?php 
	define ("DB_HOST", "localhost");// host database
	define ("DB_USER", "id5496170_dringame");// user database
	define ("DB_PASS", "dringame2018");// pass database
	define ("DB_NAME", "id5496170_dringame");// name database
	
	$link = mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_NAME) or die("Impossibile connettersi al database");
	$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

	$GLOBALS['mysqli'] = $mysqli;

	mysqli_query($GLOBALS['mysqli'], 'SET CHARACTER SET utf8');
	header('Content-type: text/html; charset=utf-8');
?>