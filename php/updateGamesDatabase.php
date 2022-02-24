<?php
    $gameId = empty($_POST['gameId']) ? '' : $_POST['gameId'];
    $boardHistory = empty($_POST['boardHistory']) ? '' : $_POST['boardHistory'];
    $moveHistory = empty($_POST['moveHistory']) ? '' : $_POST['moveHistory'];
    $turn = empty($_POST['turn']) ? '' : $_POST['turn'];
    $fiftyMoveCounter = empty($_POST['fiftyMoveCounter']) ? 0 : $_POST['fiftyMoveCounter'];
    $rookMoves = empty($_POST['rookMoves']) ? '' : $_POST['rookMoves'];
    $kingMoves = empty($_POST['kingMoves']) ? '' : $_POST['kingMoves'];
    $gameState = empty($_POST['gameState']) ? '' : $_POST['gameState'];
    $gameResult = empty($_POST['gameResult']) ? '' : $_POST['gameResult'];
    $lightUserViewed = empty($_POST['lightUserViewedResult']) ? '' : $_POST['lightUserViewedResult'];
    $darkUserViewed = empty($_POST['darkUserViewedResult']) ? '' : $_POST['darkUserViewedResult'];


    $boardHistory = json_encode($boardHistory);
    $moveHistory = json_encode($moveHistory);
    $rookMoves = json_encode($rookMoves);
    $kingMoves = json_encode($kingMoves);

    require_once "../db.conf";

    $updateGameQuery = "UPDATE games SET boardHistory='$boardHistory', moveHistory='$moveHistory', turn='$turn', gameState='$gameState', fiftyMoveCounter=$fiftyMoveCounter, rookMoves='$rookMoves', kingMoves='$kingMoves', gameResult='$gameResult', lightUserViewedResult='$lightUserViewed', darkUserViewedResult='$darkUserViewed' WHERE gameId='$gameId';";
    
    $insertResult = $mysqli->query($updateGameQuery);
    if($insertResult == 1){
        echo "Update successfull";
    }
    else {
        echo "Update failed";
    }
    $mysqli->close();
?>