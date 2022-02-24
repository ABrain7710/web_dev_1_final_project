<?php
    $username = empty($_COOKIE['username']) ? '' : $_COOKIE['username'];
    $gameId = empty($_GET['gameId']) ? '' : $_GET['gameId'];

    if($username){

        require_once "../db.conf";

        $gameQuery = "SELECT * FROM games WHERE gameId=$gameId;";
        $gameResult = $mysqli->query($gameQuery);
        $rowCount = mysqli_num_rows($gameResult);
        $gameData = $gameResult->fetch_assoc();

    
        if((strcmp($username, $gameData['gameLightUser']) != 0 && strcmp($username, $gameData['gameDarkUser']) != 0 && $gameId != -1) || ($rowCount == 0 && $gameId != -1)){

            echo "home";
        }
        $mysqli->close();
        $gameResult->close();
    }
    else {
        //redirect to landing page unless gameId == -1
        if($gameId != -1){
            echo "landing";
        }
    }

?>