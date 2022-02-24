<?php 
// References:
// 1. https://www.w3schools.com/js/js_json_php.asp

$gameId = empty($_GET['gameId']) ? '' : $_GET['gameId'];

if($gameId == -1){   
    loadLocalGame();
}
else if($gameId > 0){
    loadOnlineGameFromDataBase($gameId);
}

function loadOnlineGameFromDataBase($id){

    $username = empty($_COOKIE['username']) ? '' : $_COOKIE['username'];

    require_once "../db.conf";

    $selectGameQuery = "SELECT * FROM games WHERE gameId=$id;";
    
    $gameResult = $mysqli->query($selectGameQuery);
    $game = $gameResult->fetch_assoc();

    $pieces = json_decode($game['pieces']);
    $kings = json_decode($game['kingMoves']);
    $rooks = json_decode($game['rookMoves']);
    $boardHistory = json_decode($game['boardHistory']);
    $moveHistory  = json_decode($game['moveHistory']);

    $boardData;
    $boardData->pieces = $pieces;
    $boardData->kings = $kings;
    $boardData->rooks = $rooks;  
    $boardData->boardHistory = $boardHistory;
    $boardData->moveHistory = $moveHistory;


    $boardData->turn = $game['turn'];
    $boardData->fiftyMoveCounter = (int)$game['fiftyMoveCounter'];
    $boardData->gameState = $game['gameState'];

    $lightUser = $game['gameLightUser'];
    $darkUser = $game['gameDarkUser'];
    $boardData->lightUser = $lightUser;
    $boardData->darkUser = $darkUser;
    $boardData->lightUserViewedResult = $game['lightUserViewedResult'];
    $boardData->darkUserViewedResult = $game['darkUserViewedResult'];
    $boardData->gameResult = $game['gameResult'];

    $boardData->gameType = "online";

    $userTeamQueryLight = "SELECT userTeam FROM userLogins WHERE userName='$lightUser';";
    $userLightResult = $mysqli->query($userTeamQueryLight);
    $lightUserTeam = $userLightResult->fetch_assoc()['userTeam'];
    $boardData->lightUserTeam = $lightUserTeam;

    $userTeamQueryDark = "SELECT userTeam FROM userLogins WHERE userName='$darkUser';";
    $userDarkResult = $mysqli->query($userTeamQueryDark);
    $darkUserTeam = $userDarkResult->fetch_assoc()['userTeam'];
    $boardData->darkUserTeam = $darkUserTeam;

    $boardData->currentUser = $username;




    echo json_encode($boardData);
    $mysqli->close();
    $gameResult->close();
    $userLightResult->close();
    $userDarkResult->close();
}

function loadLocalGame(){
    
    $boardData;

    $boardData->lightUser = "light";
    $boardData->darkUser = "dark";
    $boardData->currentUser = "currentUser";
    $boardData->lightUserTeam = "iron";
    $boardData->darkUserTeam = "cap";

    $rooks->A1 = "unMoved";
    $rooks->H1 = "unMoved";
    $rooks->A8 = "unMoved";
    $rooks->H8 = "unMoved";

    $boardData->rooks = $rooks;

    $kings->dark = "unMoved";
    $kings->light = "unMoved";

    $boardData->kings = $kings;

    $boardData->turn = "lightPiece";

    $boardData->gameType = "local";

    $boardData->moveHistory = array('None', 'None', 'None');

    $initalBoardState = array("lightPiecerook", "lightPieceknight", "lightPiecebishop", "lightPiecequeen", "lightPieceking", "lightPiecebishop", "lightPieceknight", "lightPiecerook","lightPiecepawn","lightPiecepawn","lightPiecepawn","lightPiecepawn","lightPiecepawn","lightPiecepawn","lightPiecepawn","lightPiecepawn",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,"darkPiecepawn","darkPiecepawn","darkPiecepawn","darkPiecepawn","darkPiecepawn","darkPiecepawn","darkPiecepawn","darkPiecepawn","darkPiecerook","darkPieceknight","darkPiecebishop","darkPiecequeen","darkPieceking","darkPiecebishop","darkPieceknight","darkPiecerook");

    $boardData->boardHistory = $initalBoardState;

    $boardData->fiftyMoveCounter = 0;

    $boardData->gameState = "active";

    // REFERNCE: https://www.w3schools.com/js/js_json_php.asp
    echo json_encode($boardData);
}

?>














