/*
    REFERENCES
        1. https://www.w3schools.com/html/html_youtube.asp
        2. https://stackoverflow.com/questions/2090551/parse-query-string-in-javascript
*/

$(document).ready(function () {

    var character = getQueryVariable("character");

    var videoId;
    var image;
    var piece;
    var enemyImage;
    var description;

    switch (character) {
        case "ironMan":
        case "captainAmerica":
            videoId = "ZWjDKiHBvZo";
            description = "The King is restricted to one square move per turn, but can move in any direction - straights or diagonals.The King may capture in any direction providing it's within its legal move range and as long as it won't be put in Check by doing so.";
            piece = "King";
            if (character == "ironMan") {
                enemy = "captainAmerica";
            }
            else {
                enemy = "ironMan";
            }
            break;
        case "warMachine":
        case "winterSoldier":
            videoId = "PlgnoYqsK-8";
            description = "Rooks can only move and capture along the straight lines; they cannot move along the diagonals, unlike the Bishop A Rook may move to any square providing it's in line of sight along the straights - be it forward/backward, left / right. The Rook is involved in the Castling manouvre with the King, BUT it's the King that makes the initial move.";
            piece = "Rook";
            if (character == "warMachine") {
                enemy = "winterSoldier";
            }
            else {
                enemy = "warMachine";
            }
            break;
        case "blackWidow":
        case "scarletWitch":
            videoId = "vwgwI0wnULU";
            description = "The Queen can move and capture on any square in line of sight. She can move on the straights, like the Rook, and on the diagonals, like the Bishop.";
            piece = "Queen";
            if (character == "blackWidow") {
                enemy = "scarletWitch";
            }
            else {
                enemy = "blackWidow";
            }
            break;
        case "vision":
        case "hawkeye":
            videoId = "_y3eA21rD1w";
            description = "A Bishop can only move and capture along the diagonals; it cannot move on the straights, be it forward / backward, left / right. A Bishop may move to any square providing it's in line of sight along its diagonal move pattern. Rooks can only move and capture along the straight lines; they cannot move along the diagonals, unlike the BishopA Rook may move to any square providing it's in line of sight along the straights - be it forward/backward, left / right. The Rook is involved in the Castling manouvre with the King, BUT it's the King that makes the initial move.";
            piece = "Bishop";
            if (character == "vision") {
                enemy = "hawkeye";
            }
            else {
                enemy = "vision";
            }
            break;
        case "blackPanther":
        case "falcon":
            videoId = "VGoT8FR0O_8";
            description = "The Knight is the only piece on the board that can jump over another piece to get to another square - be it to capture or move. The Knight moves in an L - shape either first two squares, then one to left or right; OR first one square, then two to the left or right. Besides the Pawn, the Knight is the only other piece that has a legal move from the very start of a game. The Knight CANNOT capture merely by jumping over, it has to actually land on the square containing an enemy piece, at the end of its legal move pattern.";
            piece = "Knight";
            if (character == "blackPanther") {
                enemy = "falcon";
            }
            else {
                enemy = "blackPanther";
            }
            break;
        case "spiderMan":
        case "antMan":
            videoId = "00uUlbcPz5E";
            description = "A Pawn can only move one square per turn, as long as there isn't another piece already on that square. The only time a Pawn can move TWO squares, is during it's first move. All subsequent moves return to ONE square forward per turn.Should it only be moved one square on its first move, the option to move the two squares is no longer available. A Pawn can only move FORWARDS - never backwards, in ANY direction. A Pawn can only CAPTURE diagonally, within its legal range of movement.";
            piece = "Pawn";
            if (character == "spiderMan") {
                enemy = "antMan";
            }
            else {
                enemy = "spiderMan";
            }
            break;
    }

    image = "<img class='descrptionImage' src='../imagesUniversial/piecePage/" + character + ".jpg' alt='" + character + "'>";
    enemyImage = "<img class='descrptionImage' src='../imagesUniversial/piecePage/" + enemy + ".jpg' alt='" + enemy + "'>";

    // Reference: https://www.w3schools.com/html/html_youtube.asp
    var ytHtml = "<iframe class='youtubeFrame' src='https://www.youtube.com/embed/" + videoId + "'></iframe>";

    var pageHtml = "<h1 class='pieceDescriptionHeader'>" + piece + "</h1>" + image + "<div class='descriptionBackground'><div class='descriptionWrapper'><p class='description'>" + description + "</p></div></div><div class='videoWrapper'>" + ytHtml + "</div><div class='enemyEquivalentWrapper'><h1 class='enemyEquivalentHeader'>Enemy Equivalent</h1>" + enemyImage + "</div>";


    $("body").html(pageHtml);

});

// REFERENCE: https://stackoverflow.com/questions/2090551/parse-query-string-in-javascript
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
}
