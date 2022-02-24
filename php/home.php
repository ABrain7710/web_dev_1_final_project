<?php 

$username = empty($_COOKIE['username']) ? '' : $_COOKIE['username'];

require_once "../db.conf";

$gamesQuery = "SELECT gameId, gameLightUser, gameDarkUser, turn FROM games WHERE gameLightUser = '$username' OR gameDarkUser = '$username';";


$gamesResult = $mysqli->query($gamesQuery);

$gameIdArray = array();
$enemyNameArray = array();

while($row = $gamesResult->fetch_assoc()) {
    array_push($gameIdArray,  $row['gameId']);

    if($username == $row['gameLightUser']){
        $enemyName = $row['gameDarkUser'];
        array_push($enemyNameArray,  $row['gameDarkUser']);
    }
    else {
        $enemyName = $row['gameLightUser'];
        array_push($enemyNameArray,  $row['gameLightUser']);
    }
}
$gamesData = new \stdClass();

$gamesData->gamesIdArray = $gameIdArray;
$gamesData->enemyNameArray = $enemyNameArray;
$gamesData->username = $username;

echo json_encode($gamesData);

$mysqli->close();
$gamesResult->close();
?>