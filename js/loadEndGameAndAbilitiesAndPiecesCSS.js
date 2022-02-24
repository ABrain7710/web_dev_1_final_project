/*
    REFERNCES
        1. https://www.w3schools.com/js/js_cookies.asp
        2. https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
*/

// https://www.w3schools.com/js/js_cookies.asp
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
// REFERENCE: https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

var character = getParameterByName("character");
var localStorageTeam = localStorage.getItem('team');

if (localStorageTeam == null) {
    window.location = "http://ec2-54-237-92-230.compute-1.amazonaws.com/final_project";
}

var team;
$.ajax({
    url: "../php/determineTeam.php",
    data: { "localStorageTeam": localStorageTeam },
    method: "GET",
    dataType: "text",
    success: function (data) {

        team = data.slice(2);

        var urlArray = window.location.href.split("/");
        var file = urlArray[urlArray.length - 1];
        var fileName = file.split("?")[0];

        var ironManTeam = ["ironMan", "warMachine", "blackWidow", "vision", "blackPanther", "spiderMan"];
        var captainAmericaTeam = ["captainAmerica", "falcon", "winterSoldier", "hawkeye", "scarletWitch", "antMan"];
        var pageTeam;


        if (ironManTeam.includes(character)) {
            pageTeam = "iron";
        }
        else if (captainAmericaTeam.includes(character)) {
            pageTeam = "cap";
        }

        var teamCSSPath;
        if (team == pageTeam || fileName == "endGameAndAbilities.html") {
            teamCSSPath = "../css/" + team + "EndGameAndAbilitiesAndPieces.css";
        }
        else {
            teamCSSPath = "../css/" + pageTeam + "EndGameAndAbilitiesAndPieces.css";
        }

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

    },
    error: function (xhr, ajaxOptions, thrownError) {
        console.log(thrownError);
    }
});

