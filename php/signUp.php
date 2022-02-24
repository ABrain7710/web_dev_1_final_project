<?php
// REFERENCE
// Created by Professor Wergeles for CS2830 at the University of Missouri

	$username = empty($_COOKIE['username']) ? '' : $_COOKIE['username'];
	
	// If the user is logged in, redirect them home
	if ($username) {
		header("Location: ../pages/home.html");
		exit;
	}
	
	// Pull out any "action" from $_POST
    $action = empty($_POST['action']) ? '' : $_POST['action'];
    	
	if ($action == 'do_signUp') {
	// 	// If the action is "do_login", then the form was submitted
		handle_SignUp();
	} else {
    // 	// Else, the form wasn't submitted, so present the login
		signUp_form();
	}
	
	function handle_SignUp() {

		$createUserName = empty($_POST['createUserName']) ? '' : $_POST['createUserName'];
		$createUserPassword = empty($_POST['createUserPassword']) ? '' : $_POST['createUserPassword'];
		$team = empty($_POST['team']) ? '' : $_POST['team'];

		$createUserName = mysqli_real_escape_string ($mysqli, $createUserName);
		$createUserPassword = mysqli_real_escape_string ($mysqli, $createUserPassword);

		if($team == "default" || $createUserName == "" || $createUserPassword == ""){
			$error = "All fields are required";
			require "../pages/createAccountForm.php";
			exit;
		}

		require_once "../db.conf";

		$userNameTakenQuery = "SELECT * FROM userLogins WHERE userName='$createUserName';";
		$userNameTakenResult = $mysqli->query($userNameTakenQuery);
		$rowCount = mysqli_num_rows($userNameTakenResult);

         // Check if there is this username is already in the database
		if ($rowCount >= 1) {
			$error = 'User name already taken';
			require "../pages/createAccountForm.php";
			exit;
		} 
		else {
			$encryptedPass = sha1($createUserPassword);
			$query = "INSERT INTO userLogins (userName, userPassword, userTeam) VALUES ('$createUserName', '$encryptedPass', '$team');";
			$result = $mysqli->query($query);

			if($result == 1){
				setcookie('username', $createUserName, time() + (3600), '/');
				header("Location: ../pages/home.html");
			}
			else {
				$error = "Contact system admin";
				require "../pages/createAccountForm.php";
			}
	
		}	
		$mysqli->close();
		$userNameTakenResult->close();	
	}
	
	function signUp_form() {
		$error = "";
		require "../pages/createAccountForm.php";
	}
?>