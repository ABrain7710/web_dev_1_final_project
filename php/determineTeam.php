  <?php
  $username = empty($_COOKIE['username']) ? '' : $_COOKIE['username'];
  $localStorageTeam = empty($_GET['localStorageTeam']) ? '' : $_GET['localStorageTeam'];

    if($username){
        require_once "../db.conf";

        $userTeamQuery = "SELECT userTeam FROM userLogins WHERE userName='$username';";
        $userTeamResult = $mysqli->query($userTeamQuery);
        $userTeam = $userTeamResult->fetch_assoc()['userTeam'];

        echo $userTeam;

        $mysqli->close();
        $userTeamResult->close();
    }
    else {

        if($localStorageTeam){
            echo $localStorageTeam;
        }
        exit;
    }
    ?>