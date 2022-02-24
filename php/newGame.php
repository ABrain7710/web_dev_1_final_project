<?php

/*
    REFERENCES
        1. https://www.php.net/manual/en/function.rand.php
*/

require_once "../db.conf";

$proposedOpponent = empty($_POST['proposedOponent']) ? '' : $_POST['proposedOponent'];
$currentUser = empty($_POST['username']) ? '' : $_POST['username'];

$proposedOpponent = mysqli_real_escape_string ($mysqli, $proposedOpponent);

if($proposedOpponent == ""){
    echo "Username Required";
    exit;
}

if($currentUser == $proposedOpponent){
    echo "You cannot fight yourself";
    exit;
}

$proposedUserQuery = "SELECT * FROM userLogins WHERE userName='$proposedOpponent'";
$proposedUserResult = $mysqli->query($proposedUserQuery);
$count = mysqli_num_rows($proposedUserResult);
$proposedUserData = $proposedUserResult->fetch_assoc();

$currentUserQuery = "SELECT * FROM userLogins WHERE userName='$currentUser'";
$currentUserResult = $mysqli->query($currentUserQuery);
$currentUserData = $currentUserResult->fetch_assoc();


//test if the proposed user is in the database
if($count == 0){
    echo "Could Not Find User";
    exit;
}
else{
    //test if they are on the same team
    if($currentUserData['userTeam'] == $proposedUserData['userTeam']){
        echo "They are on your team, friendly fire is not allowed";
        exit;
    }
}

$alreadyHaveGameQuery = "SELECT * FROM games WHERE (gameLightUser='$proposedOpponent' AND gameDarkUser='$currentUser') OR (gameLightUser='$currentUser' AND gameDarkUser='$proposedOpponent')";
$alreadyHaveGameResult = $mysqli->query($alreadyHaveGameQuery);
$numCurrentGames = mysqli_num_rows($alreadyHaveGameResult);

if($numCurrentGames > 0){
    echo "You are already in a battle with this user!";
    exit;
}

// REFERENCE: https://www.php.net/manual/en/function.rand.php
$random = rand(0,1);
$userLight;
$userDark;

if($random == 0){
    $userLight = $currentUser;
    $userDark = $proposedOpponent;
}
else {
    $userLight = $proposedOpponent;
    $userDark = $currentUser;
}

$initalBoardState = array("lightPiecerook", "lightPieceknight", "lightPiecebishop", "lightPiecequeen", "lightPieceking", "lightPiecebishop", "lightPieceknight", "lightPiecerook","lightPiecepawn","lightPiecepawn","lightPiecepawn","lightPiecepawn","lightPiecepawn","lightPiecepawn","lightPiecepawn","lightPiecepawn",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,"darkPiecepawn","darkPiecepawn","darkPiecepawn","darkPiecepawn","darkPiecepawn","darkPiecepawn","darkPiecepawn","darkPiecepawn","darkPiecerook","darkPieceknight","darkPiecebishop","darkPiecequeen","darkPieceking","darkPiecebishop","darkPieceknight","darkPiecerook");

$boardHistory = json_encode($initalBoardState);

$rooks = new \stdClass();
$rooks->A1 = "unMoved";
$rooks->H1 = "unMoved";
$rooks->A8 = "unMoved";
$rooks->H8 = "unMoved";

$rookStates = json_encode($rooks);

$kings = new \stdClass();
$kings->dark = "unMoved";
$kings->light = "unMoved";

$kingStates = json_encode($kings);

$moveHistory = json_encode(array('None', 'None', 'None'));

$insertGameQuery = "INSERT INTO games (gameLightUser, gameDarkUser, turn, gameState, fiftyMoveCounter, rookMoves, kingMoves, moveHistory, boardHistory) VALUES('$userLight', '$userDark', 'lightPiece', 'active', 0, '$rookStates', '$kingStates', '$moveHistory', '$boardHistory');";
$insertResult = $mysqli->query($insertGameQuery);



if($insertResult == 1){
    echo "Game added";
}
else {	
    echo "Unable to add game";
}

$mysqli->close();
$proposedUserResult->close();
$currentUserResult->close();
$alreadyHaveGameResult->close();
?>