/*
    Code References:
        1. https://stackoverflow.com/questions/2090551/parse-query-string-in-javascript
        2. https://www.w3schools.com/html/html_youtube.asp
    Content References
        1. https://en.wikipedia.org/wiki/Castling
        2. https://www.ichess.net/blog/chess-en-passant/
        3. https://en.wikipedia.org/wiki/Promotion_(chess)#:~:text=Promotion%20in%20chess%20is%20a,square%20on%20the%20same%20move.
        4. https://www.thesprucecrafts.com/types-of-draws-in-chess-611536
        5. https://en.wikipedia.org/wiki/Checkmate
*/

$(document).ready(function () {

    var page = getQueryVariable("page");

    var videoId;
    var header;
    var description;

    switch (page) {
        case "castling":
            videoId = "FcLYgXCkucc";
            // REFERENCE: https://en.wikipedia.org/wiki/Castling
            description = "Castling consists of moving the king two squares towards a rook on the player's first rank, then moving the rook to the square that the king crossed.[3] Castling may be done only if the king has never moved, the rook involved has never moved, the squares between the king and the rook involved are unoccupied, the king is not in check, and the king does not cross over or end on a square attacked by an enemy piece. Castling is one of the rules of chess and is technically a king move.";
            header = "Castling";
            break;
        case "ep":
            videoId = "c_KRIH0wnhE";
            // REFERENCE: https://www.ichess.net/blog/chess-en-passant/
            description = "En passant is a French expression which means “in passing”. In chess, en passant is a special pawn capture rule. We all know how pawns move. A pawn can usually just move one square forward, but chess rules might give it some more options in certain positions.<br><br>From the initial position, the pawn can even move two squares forward if desired.If a pawn wants to take another piece, it has to move one square diagonally.Pawns, as loyal foot soldiers, are only allowed to go forward, but never backward.En passant is an exception to this rule.<br><br>It can only occur immediately after a pawn moves two squares from its starting square, and it could have been captured by an enemy pawn had it advanced only one square.<br><br>In this case, the opponent is allowed to capture the pawn “as it passes” through the first square.The result is the same as if the pawn had advanced only one square and the enemy pawn had captured it.";
            header = "En Passant";
            break;
        case "pawnPromotion":
            videoId = "Tt8VTZFPFa4";
            // REFERENCE: https://en.wikipedia.org/wiki/Promotion_(chess)#:~:text=Promotion%20in%20chess%20is%20a,square%20on%20the%20same%20move.
            description = "Promotion in chess is a rule that requires a pawn that reaches the eighth rank to be replaced by the player's choice of a bishop, knight, rook, or queen of the same color.[1] The piece chosen cannot be another king nor another pawn. The new piece replaces the pawn on its square on the same move. The choice of the new piece is not limited to pieces previously captured, thus promotion can result in a player owning, for example, two or more queens despite starting the game with one";
            header = " Pawn Promotion";
            break;
        case "draw":
            videoId = "iv9hez4QO84";
            // REFERENCE: https://www.thesprucecrafts.com/types-of-draws-in-chess-611536
            description = "<span class='drawHeaders'>Stalemate</span><br><br><A stalemate occurs when a player is not in check but has no legal moves to make.This often occurs in games between beginners; in such games, one player will often end up way ahead in material, but not understand basic checkmating techniques.Often, this will result in a stalemate, as the stronger side will fail to find a checkmate, but instead, trap the king without actually putting it into check.<br><br>Stalemates are definitely more common among beginners than in games between strong players, but they're certainly not unheard of—even in high-level chess. Tactics that can force a stalemate are sometimes a saving resource for a player who appears to be losing.<br><br><span class='drawHeaders'>Threefold Repitition</span><br><br>If the same position is reached with the same player to move three times during a game, either player may immediately claim a draw.The procedure for claiming this draw varies somewhat between rule sets, but the rule itself is fairly standard across the board.This rule exists to stop games in which both sides are simply repeating moves.<br><br>It's worth noting that there's no actual rule that allows players to claim a draw by perpetual check.However, the threefold repetition rule(along with the next type of draw) covers this eventuality; if one player is landing checks again and again without any way for their opponent to escape, they will eventually repeat the same position three times, forcing a draw.<br><br><span class='drawHeaders'>The Fifty - Move Rule</span><br><br>The fifty - move rule is one of the least understood rules in chess.The rule essentially states that if no progress is made after fifty moves by both players, the game is declared a draw.Progress is defined by the capture of any piece, or the movement of a pawn.If fifty moves by each player are made without either of these events occurring, either player may claim a draw.";
            header = "Draws";
            break;
        case "checkmate":
            videoId = "t9w1iSrJjBY";
            // REFERENCE: https://en.wikipedia.org/wiki/Checkmate
            description = "Checkmate (often shortened to mate) is a game position in chess and other chess-like games in which a player's king is in check (threatened with capture) and there is no way to avoid the threat. Checkmating the opponent wins the game";
            header = "Checkmate";
            break;
    }

    // Reference: https://www.w3schools.com/html/html_youtube.asp
    var ytHtml = "<iframe class='youtubeFrame' src='https://www.youtube.com/embed/" + videoId + "'></iframe>";

    var pageHtml = "<h1 class='pieceDescriptionHeader'>" + header + "</h1><div class='descriptionBackground'><div class='descriptionWrapper'><p class='description'>" + description + "</p></div></div><div class='videoWrapper'>" + ytHtml + "</div>";

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
