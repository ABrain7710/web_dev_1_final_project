<?php
// REFERENCE
// Created by Professor Wergeles for CS2830 at the University of Missouri

	// Pull out any "action" from $_POST
	$action = empty($_POST['action']) ? '' : $_POST['action'];
	
	if ($action == 'do_login') {
	// 	// If the action is "do_login", then the form was submitted
		handle_login();
	} else {
	// 	// Else, the form wasn't submitted, so present the login
		login_form();
	}
	
	function handle_login() {

		$username = empty($_POST['username']) ? '' : $_POST['username'];
		$password = empty($_POST['password']) ? '' : $_POST['password'];

		require_once "../db.conf";
		$encryptedPass = sha1($password);
		$loginQuery = "SELECT userName FROM userLogins WHERE userName='$username' AND userPassword='$encryptedPass'";

		echo $loginQuery;
	
		// REFERENCE: https://www.tutorialspoint.com/php/php_mysql_login.htm
		$loginResult = $mysqli->query($loginQuery);
		$count = mysqli_num_rows($loginResult);


		if($count == 1){
			setcookie('username', $username, time() + (3600), '/');
			header("Location: ../pages/home.html");
		}
		else {
			$error = 'Error: Incorrect username or password';
			require "../pages/signInForm.php";
		}

		$mysqli->close();
		$loginResult->close();	
	}
	
	function login_form() {
		$username = "";
		$error = "";
		require "../pages/signInForm.php";
	}
?>