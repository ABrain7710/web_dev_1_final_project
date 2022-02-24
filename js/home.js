/*
    REFERNCES:
        1. https://www.taniarascia.com/smooth-scroll-to-id-with-jquery/
        2. https://www.w3schools.com/js/js_cookies.asp
*/

var localStorageTeam = localStorage.getItem('team');
$.ajax({
    url: "../php/determineTeam.php",
    data: { "localStorageTeam": localStorageTeam },
    method: "GET",
    dataType: "text",
    success: function (data) {

        var team = data.slice(2);

        if (team == "iron" || team == "cap") {
            localStorage.setItem("teamVar", team);
        }
        else {
            window.location = "http://ec2-54-237-92-230.compute-1.amazonaws.com/final_project/";
        }

        var teamCSSPath = "../css/" + team + "Home.css";

        // Get HTML head element
        var head = document.getElementsByTagName('HEAD')[0];

        // Create new link Element
        var link = document.createElement('link');

        // set the attributes for link element 
        link.rel = 'stylesheet';

        link.type = 'text/css';

        link.href = teamCSSPath;

        // Append link element to HTML head
        head.appendChild(link);

        loadDynamicHomePage(team);
        $(".loadingBox").addClass("loaded");
        setTimeout(() => { $(".loadingBox").remove(); }, 1000);

    },
    error: function (xhr, ajaxOptions, thrownError) {
        console.log(thrownError);
    }
});


// Reference: https://www.taniarascia.com/smooth-scroll-to-id-with-jquery/
$('a[href*="#"]').on('click', function (e) {
    e.preventDefault()

    $('html, body').animate(
        {
            scrollTop: ($($(this).attr('href')).offset().top) - 90,
        },
        700,
        'linear'
    )
});

function openFindGameModal() {

    $("#modalError").html("");
    $("#usernameInput").val("");
    $('#findGameModal').modal('toggle');
}

function addGame() {

    var userNameInput = $("#usernameInput").val();
    var currentUser = getCookie("username");

    $.ajax({
        url: "../php/newGame.php",
        data: { "proposedOponent": userNameInput, "username": currentUser },
        method: "POST",
        dataType: "text",
        success: function (data) {

            if (data != "Game added") {
                var error = data;
                $("#modalError").html(error);
            }
            else {
                $('#findGameModal').modal('hide');
                loadDynamicHomePage();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError);
        }
    });

}

function loadDynamicHomePage(team) {

    $.ajax({
        url: "../php/home.php",
        data: {},
        method: "GET",
        dataType: "json",
        success: function (data) {

            var gamesData = data;

            var gamesIdArray = gamesData['gamesIdArray'];
            var enemyNameArray = gamesData['enemyNameArray'];
            var username = gamesData['username'];

            var navString;
            var homeTopString;

            //default nav
            navString = '<li class="nav-item active"><a class="navLink textColor" href="../pages/signInForm.php">Login <span class="sr-only">(current)</span></a></li><li class="nav-item"><a class="navLink textColor" href="../pages/createAccountForm.php">Create Account</a></li>';

            //default top section
            homeTopString = '<div id="homeHeaderWrapper"><h1 id="homeHeader" class="textColor">PLAY CHESS WITH YOUR FAVORITE TEAM</h1></div><div id="homeHeaderLinkWrapperDefault"><a href="../pages/board.html#-1" class="textColor playNowButton">Play Local!</a><a href="../pages/createAccountForm.php" class="textColor playNowButton" id="onlinePlayButton">Play Enemy!</a></div>';

            if (username.length != 0) {

                navString = '<div class="navLink dropdown show"><a id="userNameDropDown" class="btn btn-secondary dropdown-toggle" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' + username + '</a><div id="userNameDropDownItem" class="dropdown-menu" aria-labelledby="dropdownMenuLink"><a class="textColor dropdown-item" href="../php/logout.php">Logout</a></div></div >';

                //test what to whether there are games to determine what to display in the top section
                if (gamesIdArray.length == 0) {

                    homeTopString = '<div id="homeHeaderWrapper"><h1 id="homeHeader" class="textColor">PLAY CHESS WITH YOUR FAVORITE TEAM</h1></div><div id="homeHeaderLinkWrapperDefault"><a href="../pages/board.html#-1" class="textColor playNowButton">Play Local!</a><a href="#" class="textColor playNowButton" id="onlinePlayButton" onclick="openFindGameModal()">Play Enemy!</a></div>';
                }
                else {

                    homeTopString = '<div id="homeHeaderLinkWrapperGames"><a href="../pages/board.html#-1" class="playNowButton textColor">Play Local!</a><a href="#" onclick="openFindGameModal()" class="playNowButton textColor">Play Enemy!</a></div><div class="overflow-auto" id="gamesContainer"><ul id="gamesList">';

                    for (var i = 0; i < gamesIdArray.length; i++) {

                        homeTopString += "<li class='ui-state -default'><div class= 'gameCardGrid' ><h1 class='textColor youTitle'>You</h1><h1 class='textColor enemyTitle'>" + enemyNameArray[i] + "</h1><h1 class='textColor versusText'>VS</h1><div class='cardPlayGameButtonSquare'><a href='../pages/board.html?#" + gamesIdArray[i] + "' class='textColor cardGamePlayButton'>Play Now!</a></div></div></li>";
                    }
                    homeTopString += '</ul></div>';
                }
            }

            $("#rightSideNav").html(navString);
            $("#homeTop").html(homeTopString);


            $("#gamesList").sortable();
            $("#gamesList").disableSelection();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError);
        }
    });

    loadNavBarLogo(team);
    loadTeamImage(team);
    loadSpecialAbilitiy(team);
    loadEndGameButtons();
    loadHomeImages(team);
}

function loadTeamImage(team) {
    var imageSrc;
    if (team == "iron") {
        imageSrc = "../imagesUniversial/ironManBackground.png";
    }
    else if (team == "cap") {
        imageSrc = "../imagesUniversial/captainAmericaBackground.png";
    }
    $("#teamBackgroundImage").attr("src", imageSrc);
}


function loadNavBarLogo(team) {
    var imageSrc;
    if (team == "iron") {
        imageSrc = "../imagesUniversial/ironManChessLogo.png"
    }
    else if (team == "cap") {
        imageSrc = "../imagesUniversial/captainAmericaChessLogo.png"
    }
    $(".logo img").attr("src", imageSrc);
}

function loadSpecialAbilitiy(team) {
    var castlingDescriptionString = "Makes It Easier For Team Mates To Protect ";
    var epDescriptionString;
    var pawnPromotionString;
    if (team == "iron") {
        castlingDescriptionString += "Iron Man";
        epDescriptionString = "Allows Spider-Man To Defeat Ant-Man If He Tries To Advance Too Quickly";
        pawnPromotionString = "When Spider-Man Makes It Deep Behind Enemy Lines He Can Inherit The Abilities Of One Of His Teammates";
    }
    else if (team == "cap") {
        castlingDescriptionString += "Captain America";
        epDescriptionString = "Allows Ant-Man To Defeat Spider-Man If He Tries To Advance Too Quickly";
        pawnPromotionString = "When Ant-Man Makes It Deep Behind Enemy Lines He Can Inherit The Abilities Of One Of His Teammates";
    }

    $("#castlingDescription").text(castlingDescriptionString);
    $("#epDescription").text(epDescriptionString);
    $("#pawnPromotionDescription").text(epDescriptionString);
    $("#castlingLearnMore").attr("href", "../pages/endGameAndAbilities.html?page=castling");
    $("#epLearnMore").attr("href", "../pages/endGameAndAbilities.html?page=ep");
    $("#pawnPromotionLearnMore").attr("href", "../pages/endGameAndAbilities.html?page=pawnPromotion");
}

function loadEndGameButtons() {
    $("#drawLearnMore").attr("href", "../pages/endGameAndAbilities.html?page=draw");
    $("#checkMateLearnMore").attr("href", "../pages/endGameAndAbilities.html?page=checkmate");
}

function loadHomeImages(team) {
    var ironManTeam = ["ironMan", "warMachine", "blackWidow", "vision", "blackPanther", "spiderMan"];
    var captainAmericaTeam = ["captainAmerica", "falcon", "winterSoldier", "hawkeye", "scarletWitch", "antMan"];

    var topImages;
    var bottomImages;

    if (team == "iron") {
        topImages = ironManTeam;
        bottomImages = captainAmericaTeam;
    }
    else if (team == "cap") {
        topImages = captainAmericaTeam;
        bottomImages = ironManTeam;
    }

    var teamArrayLen = topImages.length;

    var topImageString = "";
    for (var i = 0; i < teamArrayLen; i++) {
        topImageString += '<a href="pieceDescription.html?character=' + topImages[i] + '"><img src="../imagesUniversial/homePage/' + topImages[i] + '.jpg" alt="' + topImages[i] + '" class="movesImage" ></a>';
    }

    var bottomImageString = "";
    for (var i = 0; i < teamArrayLen; i++) {
        bottomImageString += '<a href="pieceDescription.html?character=' + bottomImages[i] + '"><img src="../imagesUniversial/homePage/' + bottomImages[i] + '.jpg" alt="' + bottomImages[i] + '" class="movesImage" ></a>';
    }

    $(".friendlyImages").html(topImageString);
    $(".enemyImages").html(bottomImageString);
}


// REFERENCE: https://www.w3schools.com/js/js_cookies.asp
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}