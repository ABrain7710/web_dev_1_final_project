<?php
// REFERENCE
// Created by Professor Wergeles for CS2830 at the University of Missouri

	$username = empty($_COOKIE['username']) ? '' : $_COOKIE['username'];

	echo $username;

	setcookie('username', '', 1, '/');

	require_once "../db.conf";

	$userTeamQuery = "SELECT userTeam FROM userLogins WHERE userName='$username';";
	$userTeamResult = $mysqli->query($userTeamQuery);
	$userTeam = $userTeamResult->fetch_assoc()['userTeam'];

	header("Location: ../pages/home.html");
	
	$mysqli->close();
	$userTeamResult->close();

	exit;
?>