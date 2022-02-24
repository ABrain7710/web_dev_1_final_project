// References
// 1. https://api.jquery.com/attr/
// 2.https://www.tutorialrepublic.com/faq/how-to-get-class-list-of-an-element-with-jquery.php
// 4.https://www.w3schools.com/jsref/jsref_charcodeat.asp
// 5.https://www.w3schools.com/jsref/jsref_fromcharcode.asp
// 6.https://www.freecodecamp.org/news/javascript-array-insert-how-to-add-to-an-array-with-the-push-unshift-and-concat-functions/#:~:text=When%20you%20want%20to%20add,arrays%20together%20using%20concat().
// 7.https://www.w3schools.com/jsref/jsref_includes_array.asp
// 8.https://stackoverflow.com/questions/38811421/how-to-check-if-an-array-is-a-subset-of-another-array-in-javascript
// 9.https://www.javascripttutorial.net/array/javascript-remove-duplicates-from-array/
// 10.https://stackoverflow.com/questions/20069828/how-to-convert-set-to-array
// 11.https://codepen.io/seeker5084/pen/VMQGwX

var boardData = {}
var pageUrl = window.location.href;
var url = new URL(pageUrl);
var gameId = url.hash.slice(1);

//when the DOM is loaded, load in the values from the php file
$(document).ready(function () {

    var chessBoard = "";
    for (var row = 8; row >= 1; row--) {
        for (var column = 65; column <= 72; column++) {

            // REFERENCE: https://www.w3schools.com/jsref/jsref_fromcharcode.asp
            var idName = String.fromCharCode(column) + row;

            if (row % 2 == 0) {

                if (column % 2 == 0) {
                    chessBoard += "<div class='darkSquare' id='" + idName + "' onclick='selected($(this))'></div>";
                }
                else {
                    chessBoard += "<div class='lightSquare' id='" + idName + "' onclick='selected($(this))'></div>";
                }
            }
            else {
                if (column % 2 == 0) {
                    chessBoard += "<div class='lightSquare' id='" + idName + "' onclick='selected($(this))'></div>";
                }
                else {
                    chessBoard += "<div class='darkSquare' id='" + idName + "' onclick='selected($(this))'></div>";
                }
            }
        }
    }
    $(".boardWrapper").html(chessBoard);

    loadGame(gameId);
});

function loadGame(gameId) {

    $.ajax({
        url: "../php/boardLoad.php",
        data: { "gameId": gameId },
        method: "GET",
        dataType: "json",
        success: function (data) {

            boardData['currentUser'] = data['currentUser'];

            boardData['lightUser'] = data['lightUser'];
            boardData['darkUser'] = data['darkUser'];
            boardData['lightUserTeam'] = data['lightUserTeam'];
            boardData['darkUserTeam'] = data['darkUserTeam'];


            boardData['gameType'] = data['gameType'];
            boardData['rooks'] = data['rooks'];
            boardData['kings'] = data['kings'];
            boardData['turn'] = data['turn'];
            boardData['moveHistory'] = singleToMultiArray(data['moveHistory'], 3);
            boardData['boardHistory'] = singleToMultiArray(data['boardHistory'], 64);
            boardData['fiftyMoveCounter'] = data['fiftyMoveCounter'];
            boardData['gameState'] = data['gameState'];
            boardData['gameResult'] = data['gameResult'];

            boardData['lightUserViewedResult'] = data['lightUserViewedResult'];
            boardData['darkUserViewedResult'] = data['darkUserViewedResult'];

            if (boardData['gameType'] == "online") {
                loadGameResult();
            }

            var boardHistLength = boardData['boardHistory'].length;

            var pieces = boardData['boardHistory'][boardHistLength - 1];

            addPiece(1, 1, pieces[0]);

            var row = 1;
            for (var square = 1; square < 64; square++) {
                column = (square % 8) + 1;

                if ((square % 8) == 0) {
                    row++;
                }
                addPiece(row, column, pieces[square]);
            }

            if (boardData['currentUser'] == boardData['darkUser']) {
                rotatePieces('.boardWrapper, .lightPiece, .darkPiece', 180);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError);
        }
    });
}

//used to addPieces to the board based on the php file
function addPiece(row, column, piece) {

    var letter = String.fromCharCode(column + 64);
    var selector = "#" + letter + row;

    //use jquery to select the square
    var square = $(selector);

    if (piece != 0) {
        var pieceAttributes = piece.split("Piece");
        var type = pieceAttributes[1];
        var color = String(pieceAttributes[0]) + "Piece";

        var loadImages = "true";
        var pieceHtml = getPiece(color, type, loadImages);

        square.html(pieceHtml);
    }
}

//called when a square on the board is clicked
function selected(square) {

    //get data surrounding the square
    // REFERENCE: https://api.jquery.com/attr/
    var squareId = square.attr('id');
    var squareContents = $("#" + squareId).html();

    if (boardData['gameState'] == "active") {

        if (isMove() == 1 || boardData['gameType'] == "local") {

            //if the there are no other selected pieces
            if ($(".active").length == 0) {


                //if the square is not empty allow it to be selected
                if (squareContents.length > 0) {

                    //test to make sure the piece selected is the same correct color for the person's turn

                    //REFERENCE: https://www.tutorialrepublic.com/faq/how-to-get-class-list-of-an-element-with-jquery.php
                    var pieceColor = $("#" + squareId + " div").attr('class').split(/\s+/)[0];

                    if (boardData['turn'] == pieceColor) {
                        square.addClass("active");
                    }
                }
            }
            //if there is already a selected square, set another class for a refernce to second click
            //then call movePiece() to attempt to move the piece
            else {
                square.addClass("active1");
                attemptMove();
            }
        }
    }
}

//determines the piece, and tries to move it
function attemptMove() {

    //determine location of piece, and get the html content
    var pieceLocation = $(".active");
    var piece = pieceLocation.html();
    var pieceId = pieceLocation.attr('id');

    // https://stackoverflow.com/questions/1227286/get-class-list-for-element-with-jquery

    //determine the type of piece and its color
    var pieceColor = getPieceColor();
    var pieceType = getPieceType();

    //determine the ending location for the piece
    var locationId = $(".active1").attr('id');

    var spaces;
    var castling;

    //generate all possible spaces for given piece (includes taking own pieces)
    //essentially all threatened squares
    switch (pieceType) {
        case "pawn":
            spaces = pawnThreats(pieceId, pieceColor);
            break;
        case "rook":
            spaces = rookThreats(pieceId);
            break;
        case "knight":
            spaces = knightThreats(pieceId);
            break;
        case "bishop":
            spaces = bishopThreats(pieceId);
            break;
        case "king":
            spacesAndCastling = kingThreats(pieceId, locationId, pieceColor);
            spaces = spacesAndCastling[0];
            castling = spacesAndCastling[1];
            break;
        case "queen":
            spaces = queenThreats(pieceId);
            break;
    }

    var epSquare;
    if (pieceType == "pawn") {
        var epSquares = enpassantSquares(pieceId, pieceColor);
        spaces = spaces.concat(epSquares);
        epSquare = epSquares[0];
    }


    //remove the spaces with the same color pieces on them
    var actualSpaces = removeTakingOwnPieces(pieceColor, spaces);

    //if the move is in the valid move list, the attempt to make move
    // REFENCES: https://www.w3schools.com/jsref/jsref_includes_array.asp
    if (actualSpaces.includes(locationId)) {
        //premeptively make the move 
        makeMove(piece);

        //change these to use pieceType
        //mark rook as moved

        if (pieceType == "pawn") {
            testForPawnPromotion(pieceColor, locationId);
        }

        //enpassant logic
        var epPieceTaken;
        var epPieceRemovedId;
        if (epSquare == locationId) {

            var pieceHist = boardData['moveHistory'];

            var removePiece = pieceHist[pieceHist.length - 1][2];
            epPieceRemovedId = "#" + removePiece;

            epPieceTaken = $(epPieceRemovedId).html();

            $(epPieceRemovedId).html("");
            var epTaken = "true";
        }


        //need to find squares the other color is protecting
        //if the board results in an illegal board undo the move
        if (pieceColor == "lightPiece") {
            var validBoard = getAllPossibleMoves("darkPiece", pieceId, pieceType);
        }
        else {
            var validBoard = getAllPossibleMoves("lightPiece", pieceId, pieceType);
        }

        //undo the move
        if (validBoard == "false") {
            undoMove(castling, pieceColor, piece, epTaken, epPieceTaken, epPieceRemovedId);
        }
        else {
            //move has been validated so add it to moveHistory
            boardData['moveHistory'].push([pieceType, pieceId, locationId]);

            //test for checkmate or stalemate
            var isCheck = getPossibleNextMoves(pieceColor);
            var noSpaes = checkStaleOrCheckMate(pieceColor);
            if (noSpaes == "true" && isCheck == "true") {
                $('#endGameModal').modal('toggle');
                $("#modalHeader").text("Checkmate! You Win!");
                boardData['gameResult'] = "Checkmate";
                boardData['gameState'] = "done";
                setUserView();
            }
            if (noSpaes == "true" && isCheck == "false") {
                $('#endGameModal').modal('toggle');
                $("#modalHeader").text("Stalemate! It's a Draw!");
                boardData['gameResult'] = "Stalemate";
                boardData['gameState'] = "done";
                setUserView();

            }

            //test for only kings draw
            onlyKings();

            //log board state to help with fifty move checking and three move rep checking
            logBoardState();

            //increase fifty move counter if no capture or pawn move
            testFiftyMoveCounter(pieceType);

            //test for three move repitition
            threeMoveRep();


            //if king set as moved
            if (pieceType == "king") {
                kingMoved(pieceColor);
            }
            //if rook mark as moved
            if (pieceType == "rook") {
                rookMoved(pieceId);
            }


            var degrees;
            //change whose turn it is
            if (boardData['turn'] == "lightPiece") {
                boardData['turn'] = "darkPiece";
                degrees = 180;
            }
            else {
                boardData['turn'] = "lightPiece";
                degrees = 0;
            }


            if (boardData['gameType'] == "local") {
                // rotate the board and pieces when a move is made

                rotatePieces('.boardWrapper, .lightPiece, .darkPiece', degrees)
            }

            if (boardData['gameType'] == "online") {
                var boardHistory = arrayMultiToSingle(boardData['boardHistory']);
                var moveHistory = arrayMultiToSingle(boardData['moveHistory']);

                var data = { "gameId": gameId, "boardHistory": boardHistory, "moveHistory": moveHistory, "turn": boardData['turn'], "fiftyMoveCounter": boardData['fiftyMoveCounter'], "rookMoves": boardData['rooks'], "kingMoves": boardData['kings'], "gameState": boardData['gameState'], "gameResult": boardData['gameResult'], "lightUserViewedResult": boardData['lightUserViewedResult'], "darkUserViewedResult": boardData['darkUserViewedResult'] };

                $.ajax({
                    url: "../php/updateGamesDatabase.php",
                    data: data,
                    method: "POST",
                    dataType: "text",
                    success: function (data) {

                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        console.log(thrownError);
                    }
                });
            }
        }
    }

    //deselect all squares
    $(".active").removeClass("active");
    $(".active1").removeClass("active1");
}

//sets a king as moved (used for castling rules)
function kingMoved(pieceColor) {
    if (pieceColor == "lightPiece") {
        boardData['kings']['light'] = "moved";
    }
    else {
        boardData['kings']['dark'] = "moved";
    }
}

//sets a rook as moved (used for castling rules)
function rookMoved(pieceId) {
    boardData['rooks'][pieceId] = "moved";
}

//determines all the threats a pawn can make
function pawnThreats(pieceId, pieceColor) {

    var row = pieceId[1];

    var spaces = [];
    if (pieceColor == "lightPiece") {

        var upRight = getIds("upRight", pieceId, 1);
        var upLeft = getIds("upLeft", pieceId, 1);

        if (row == 2) {
            var up = getIds("up", pieceId, 2);

        }
        else {
            var up = getIds("up", pieceId, 1);
        }

        //if upRight or upLeft are not pieces remove them
        if (upRight.length > 0) {
            if (testForPiece(upRight[0]) == false) {
                upRight.pop();
            }
        }
        if (upLeft.length > 0) {
            if (testForPiece(upLeft[0]) == false) {
                upLeft.pop();
            }
        }

        //if final id in up is a piece remove it
        var upIdsLength = up.length;
        if (upIdsLength > 0) {
            if (testForPiece(up[upIdsLength - 1]) == true) {
                up.pop();
            }
        }
        // REFERENCE: https://www.freecodecamp.org/news/javascript-array-insert-how-to-add-to-an-array-with-the-push-unshift-and-concat-functions/#:~:text=When%20you%20want%20to%20add,arrays%20together%20using%20concat().
        spaces = up.concat(upRight, upLeft);
    }
    else {
        var downRight = getIds("downRight", pieceId, 1);
        var downLeft = getIds("downLeft", pieceId, 1);


        if (row == 7) {
            var down = getIds("down", pieceId, 2);
        }
        else {
            var down = getIds("down", pieceId, 1);
        }

        //if upRight or upLeft are not pieces remove them
        if (downRight.length > 0) {
            if (testForPiece(downRight[0]) == false) {
                downRight.pop();
            }
        }
        if (downLeft.length > 0) {
            if (testForPiece(downLeft[0]) == false) {
                downLeft.pop();
            }
        }

        //if final id in up is a piece remove it
        var downIdsLength = down.length;
        if (downIdsLength > 0) {
            if (testForPiece(down[downIdsLength - 1]) == true) {
                down.pop();
            }
        }
        spaces = down.concat(downRight, downLeft);
    }
    return spaces;
}


//determines all the threats a rook can make
function rookThreats(pieceId) {

    var up = getIds("up", pieceId, 100);
    var down = getIds("down", pieceId, 100);
    var left = getIds("left", pieceId, 100);
    var right = getIds("right", pieceId, 100);

    spaces = up.concat(down, left, right);

    return spaces;
}

//determines all the threats a knight can make
function knightThreats(pieceId) {

    var row = pieceId[1];

    var spaces = [];
    for (var i = 0; i < 8; i++) {
        var row = pieceId[1];

        // RERERENCE: https://www.w3schools.com/jsref/jsref_charcodeat.asp
        var columnValue = pieceId.charCodeAt(0) - 64;

        switch (i) {
            //up left
            case 0:
                row = parseInt(row) + 2;
                columnValue = parseInt(columnValue) - 1;
                break;
            //up right
            case 1:
                row = parseInt(row) + 2;
                columnValue = parseInt(columnValue) + 1;
                break;
            //right up
            case 2:
                columnValue = parseInt(columnValue) + 2;
                row = parseInt(row) + 1;
                break;
            //right down
            case 3:
                columnValue = parseInt(columnValue) + 2;
                row = parseInt(row) - 1;
                break;
            //down right
            case 4:
                row = parseInt(row) - 2;
                columnValue = parseInt(columnValue) + 1;
                break;
            //down left
            case 5:
                row = parseInt(row) - 2;
                columnValue = parseInt(columnValue) - 1;
                break;
            //left down
            case 6:
                columnValue = parseInt(columnValue) - 2;
                row = parseInt(row) - 1;
                break;
            //left up
            case 7:
                columnValue = parseInt(columnValue) - 2;
                row = parseInt(row) + 1;
                break;
        }

        if (columnValue > 8 || columnValue < 1 || row > 8 || row < 1) {
            continue;
        }
        var id = String.fromCharCode(columnValue + 64) + String(row);

        spaces.push(id);
    }
    return spaces;
}

//determines all the threats a bishop can make
function bishopThreats(pieceId) {

    var upRight = getIds("upRight", pieceId, 100);
    var upLeft = getIds("upLeft", pieceId, 100);
    var downRight = getIds("downRight", pieceId, 100);
    var downLeft = getIds("downLeft", pieceId, 100);

    spaces = upRight.concat(upLeft, downRight, downLeft);

    return spaces;
}

//determines all the threats a pawn can make
function kingThreats(pieceId, locationId, pieceColor) {

    //castling defaults to false
    var castling = "false";

    var upRight = getIds("upRight", pieceId, 1);
    var upLeft = getIds("upLeft", pieceId, 1);
    var downRight = getIds("downRight", pieceId, 1);
    var downLeft = getIds("downLeft", pieceId, 1);

    var up = getIds("up", pieceId, 1);
    var down = getIds("down", pieceId, 1);
    var left = getIds("left", pieceId, 1);
    var right = getIds("right", pieceId, 1);

    var spaces = upRight.concat(upLeft, downRight, downLeft, up, down, left, right);


    var num;
    var kingMoved;
    if (pieceColor == "lightPiece") {
        num = "1";
        kingMoved = boardData['kings']['light']
    }
    else {
        num = "8";
        kingMoved = boardData['kings']['dark']
    }

    //check whether squares to left or right of king are empty
    //remove last item from array, because getIds() includes taking a piece, 
    //and we just need to check for empty squares not captures
    var queenCastlingCheck = getIds("left", pieceId, 100);
    queenCastlingCheck.pop();

    var kingCastlingCheck = getIds("right", pieceId, 100);
    kingCastlingCheck.pop();


    //later use indicator that the king has not moved
    if (kingMoved == "unMoved") {

        //are king castling squares open and has the rook been moved?
        requiredForKingCastle = ['F' + num, 'G' + num];
        // REFERENCES: https://stackoverflow.com/questions/38811421/how-to-check-if-an-array-is-a-subset-of-another-array-in-javascript
        var kingCastleValid = requiredForKingCastle.every(val => kingCastlingCheck.includes(val));
        var kingRookValid = boardData['rooks']['H' + num];

        //are queen castling squares open and has the rook been moved?
        requiredForQueenCastle = ['B' + num, 'C' + num, 'D' + num];
        var queenCastleValid = requiredForQueenCastle.every(val => queenCastlingCheck.includes(val));
        var queenRookValid = boardData['rooks']['A' + num];

        // use kingCastleValid and rookNot Moved Indicator
        if (kingCastleValid && kingRookValid == "unMoved") {
            spaces = spaces.concat(['G' + num]);
            if (locationId == "G" + num) {
                var rook = $("#H" + num).html();
                $("#F" + num).html(rook);
                $("#H" + num).html("");
                castling = "king";
                boardData['rooks']['H' + num] = "moved";
            }
        }
        //use queenCastleValid and rook not moved indicator
        if (queenCastleValid && queenRookValid == "unMoved") {
            spaces = spaces.concat(['C' + num]);
            if (locationId == "C" + num) {
                var rook = $("#A" + num).html();
                $("#D" + num).html(rook);
                $("#A" + num).html("");
                castling = "queen";
                boardData['rooks']['A' + num] = "moved";
            }
        }
    }
    return [spaces, castling];
}

//determines all the threats a queen can make
function queenThreats(pieceId) {

    var upRight = getIds("upRight", pieceId, 100);
    var upLeft = getIds("upLeft", pieceId, 100);
    var downRight = getIds("downRight", pieceId, 100);
    var downLeft = getIds("downLeft", pieceId, 100);

    var up = getIds("up", pieceId, 100);
    var down = getIds("down", pieceId, 100);
    var left = getIds("left", pieceId, 100);
    var right = getIds("right", pieceId, 100);

    spaces = upRight.concat(upLeft, downRight, downLeft, up, down, left, right);

    return spaces;
}

//this function would not be needed if using the validation based logic
function removeTakingOwnPieces(pieceColor, spaces) {

    var actualSpaces = [];

    for (var i = 0; i < spaces.length; i++) {
        var square = $("#" + spaces[i] + " div");

        //if there is a pice on the square
        if (square.length > 0) {
            //get color of the piece on the square
            var squaresPieceColor = square.attr('class').split(/\s+/)[0];

            //if moving piece and the squares piece are the same color, remove it from possible spaces
            if (pieceColor != squaresPieceColor) {
                actualSpaces.push(spaces[i]);
            }
        }
        else {
            actualSpaces.push(spaces[i]);
        }
    }
    return actualSpaces;
}

//test if there is a piece at a specific location
function testForPiece(id) {

    var boxContentLength = $("#" + id).html().length;;
    if (boxContentLength > 0) {
        return true;
    }
    return false;
}

//gets the piece color
function getPieceColor() {
    var pieceClasses = $('.active div').attr('class').split(/\s+/);
    var pieceColor = pieceClasses[0];

    return pieceColor;
}

function getPieceType() {
    var pieceClasses = $('.active div').attr('class').split(/\s+/);
    var pieceType = pieceClasses[1];

    return pieceType;
}

function makeMove(piece) {
    $(".active1").html(piece);
    $(".active").html("");
}

function undoMove(castling, pieceColor, piece, epTaken, epPieceTaken, epPieceRemovedId) {
    $(".active1").html("");
    $(".active").html(piece);

    undoCastling(castling, pieceColor);
    undoEnPassant(epTaken, epPieceTaken, epPieceRemovedId);
}

function undoCastling(castling, pieceColor) {
    if (castling == "king") {
        if (pieceColor == "lightPiece") {
            var rook = $("#F1").html();
            $("#F1").html("");
            $("#H1").html(rook);
            boardData['rooks']['H1'] = "unMoved";
        }
        else {
            var rook = $("#F8").html();
            $("#F8").html("");
            $("#H8").html(rook);
            boardData['rooks']['H8'] = "unMoved";
        }
    }
    else if (castling == "queen") {

        if (pieceColor == "lightPiece") {
            var rook = $("#D1").html();
            $("#D1").html("");
            $("#A1").html(rook);
            boardData['rooks']['A1'] = "unMoved";
        }
        else {
            var rook = $("#D8").html();
            $("#D8").html("");
            $("#A8").html(rook);
            boardData['rooks']['A8'] = "unMoved";
        }
    }
}

function undoEnPassant(epTaken, epPieceTaken, epPieceRemovedId) {

    if (epTaken == "true") {

        $(epPieceRemovedId).html(epPieceTaken);
    }
}


//https://www.w3schools.com/jsref/jsref_charcodeat.asp
function getIds(direction, currentId, step) {

    var column = currentId[0];
    var row = currentId[1];

    var columnValue = currentId.charCodeAt(0) - 64;

    var ids = [];
    //keep going until one of the conditions fails
    while (true) {
        step--;
        switch (direction) {
            case "upRight":
                columnValue++;
                row++;
                break;
            case "upLeft":
                columnValue--;
                row++;
                break;
            case "downRight":
                columnValue++;
                row--;
                break;
            case "downLeft":
                columnValue--;
                row--;
                break;
            case "up":
                row++;
                break;
            case "down":
                row--;
                break;
            case "left":
                columnValue--;
                break;
            case "right":
                columnValue++;
                break;
        }
        if (columnValue > 8 || columnValue < 1 || row > 8 || row < 1 || step == -1) {
            break;
        }
        var id = String.fromCharCode(columnValue + 64) + String(row);

        ids.push(id);
        if (testForPiece(id) == true) {
            break;
        }
    }
    return ids;
}
//returning the attack squares after the piece has been moved
function getAllPossibleMoves(color, pieceStartId, movingPiece) {

    var totalPossibleMoves = [];
    var kingLocation = [];

    for (var row = 8; row >= 1; row--) {
        for (var column = 65; column <= 72; column++) {

            var idName = String.fromCharCode(column) + row;

            //check if there is a piece at the currentId
            if (testForPiece(idName) == true) {
                var pieceClasses = $("#" + idName + " div").attr('class').split(/\s+/);
                var pieceType = pieceClasses[1];
                var pieceColor = pieceClasses[0];
                var pieceId = idName;

                if (pieceColor == color) {

                    var spaces = [];
                    var possibleMoves = [];
                    var spacesAndCastling = [];
                    switch (pieceType) {
                        case "pawn":
                            spaces = pawnThreats(pieceId, pieceColor);
                            possibleMoves = removeTakingOwnPieces(pieceColor, spaces);
                            break;
                        case "rook":
                            spaces = rookThreats(pieceId);
                            possibleMoves = removeTakingOwnPieces(pieceColor, spaces);
                            break;
                        case "knight":
                            spaces = knightThreats(pieceId);
                            possibleMoves = removeTakingOwnPieces(pieceColor, spaces);
                            break;
                        case "bishop":
                            spaces = bishopThreats(pieceId);
                            possibleMoves = removeTakingOwnPieces(pieceColor, spaces);
                            break;
                        case "king":
                            spacesAndCastling = kingThreats(pieceId, 0, pieceColor);
                            spaces = spacesAndCastling[0];
                            possibleMoves = removeTakingOwnPieces(pieceColor, spaces);
                            break;
                        case "queen":
                            spaces = queenThreats(pieceId);
                            possibleMoves = removeTakingOwnPieces(pieceColor, spaces);
                            break;
                    }
                    totalPossibleMoves = totalPossibleMoves.concat(possibleMoves);
                }
                else {
                    //find location of opposing king
                    if (pieceType == "king") {
                        //if the king is castling add the value of the cells in between
                        kingLocation.push(pieceId);

                        if (movingPiece == "king") {

                            var startColumnValue = pieceStartId.charCodeAt(0) - 64;
                            var endColumnValue = pieceId.charCodeAt(0) - 64;

                            var distanceMoved = endColumnValue - startColumnValue;

                            var num;
                            //opposite numbers since function is being getting the values for the opposing pieces
                            if (color == "lightPiece") {
                                num = 8;
                            }
                            else {
                                num = 1;
                            }

                            if (distanceMoved == 2) {
                                var castlingId = 'F' + num;
                                kingLocation.push(castlingId);
                            }
                            else if (distanceMoved == -2) {
                                var castlingId = 'D' + num;
                                kingLocation.push(castlingId);
                            }
                        }
                    }
                }
            }
        }
    }
    for (var i = 0; i < kingLocation.length; i++) {
        if (totalPossibleMoves.includes(kingLocation[i])) {
            return "false";
        }
    }
    return "true";
}

function getPossibleNextMoves(color) {

    var totalPossibleMoves = [];
    var kingLocation;

    for (var row = 8; row >= 1; row--) {
        for (var column = 65; column <= 72; column++) {

            var idName = String.fromCharCode(column) + row;

            //check if there is a piece at the currentId
            if (testForPiece(idName) == true) {
                var pieceClasses = $("#" + idName + " div").attr('class').split(/\s+/);
                var pieceType = pieceClasses[1];
                var pieceColor = pieceClasses[0];
                var pieceId = idName;

                if (pieceColor == color) {

                    var spaces = [];
                    var possibleMoves = [];
                    var spacesAndCastling = [];
                    switch (pieceType) {
                        case "pawn":
                            spaces = pawnThreats(pieceId, pieceColor);
                            possibleMoves = removeTakingOwnPieces(pieceColor, spaces);
                            break;
                        case "rook":
                            spaces = rookThreats(pieceId);
                            possibleMoves = removeTakingOwnPieces(pieceColor, spaces);
                            break;
                        case "knight":
                            spaces = knightThreats(pieceId);
                            possibleMoves = removeTakingOwnPieces(pieceColor, spaces);
                            break;
                        case "bishop":
                            spaces = bishopThreats(pieceId);
                            possibleMoves = removeTakingOwnPieces(pieceColor, spaces);
                            break;
                        case "king":
                            spacesAndCastling = kingThreats(pieceId, 0, pieceColor);
                            spaces = spacesAndCastling[0];
                            possibleMoves = removeTakingOwnPieces(pieceColor, spaces);
                            break;
                        case "queen":
                            spaces = queenThreats(pieceId);
                            possibleMoves = removeTakingOwnPieces(pieceColor, spaces);
                            break;
                    }
                    totalPossibleMoves = totalPossibleMoves.concat(possibleMoves);
                }
                else {
                    if (pieceType == "king") {
                        kingLocation = pieceId;
                    }
                }
            }
        }
    }
    // REFERENCE: https://www.javascripttutorial.net/array/javascript-remove-duplicates-from-array/
    var uniquePossibleMovesSet = new Set(totalPossibleMoves);
    // REFERENCE: https://stackoverflow.com/questions/20069828/how-to-convert-set-to-array
    var uniquePossibleMoves = Array.from(uniquePossibleMovesSet);

    if (uniquePossibleMoves.includes(kingLocation)) {
        return "true";
    }

    return "false";
}

//determines if the opposing player has a move to get out of check
function checkStaleOrCheckMate(color) {

    var opposingColor;
    var allValidBoards = [];

    if (color == "lightPiece") {
        opposingColor = "darkPiece";
    }
    else {
        opposingColor = "lightPiece";
    }

    for (var row = 8; row >= 1; row--) {
        for (var column = 65; column <= 72; column++) {

            var idName = String.fromCharCode(column) + row;

            //check if there is a piece at the currentId
            if (testForPiece(idName) == true) {
                var pieceClasses = $("#" + idName + " div").attr('class').split(/\s+/);
                var pieceType = pieceClasses[1];
                var pieceColor = pieceClasses[0];
                var pieceId = idName;

                if (pieceColor == opposingColor) {

                    var spaces = [];
                    var possibleMoves = [];
                    var spacesAndCastling = [];
                    var validBoard;
                    switch (pieceType) {
                        case "pawn":
                            spaces = pawnThreats(pieceId, pieceColor);
                            possibleMoves = removeTakingOwnPieces(pieceColor, spaces);
                            validBoard = checkBoardAfterMove(pieceType, pieceColor, idName, possibleMoves);
                            break;
                        case "rook":
                            spaces = rookThreats(pieceId);
                            possibleMoves = removeTakingOwnPieces(pieceColor, spaces);
                            validBoard = checkBoardAfterMove(pieceType, pieceColor, idName, possibleMoves);
                            break;
                        case "knight":
                            spaces = knightThreats(pieceId);
                            possibleMoves = removeTakingOwnPieces(pieceColor, spaces);
                            validBoard = checkBoardAfterMove(pieceType, pieceColor, idName, possibleMoves);
                            break;
                        case "bishop":
                            spaces = bishopThreats(pieceId);
                            possibleMoves = removeTakingOwnPieces(pieceColor, spaces);
                            validBoard = checkBoardAfterMove(pieceType, pieceColor, idName, possibleMoves);
                            break;
                        case "king":
                            spacesAndCastling = kingThreats(pieceId, 0, pieceColor);
                            spaces = spacesAndCastling[0];
                            castling = spacesAndCastling[1];
                            possibleMoves = removeTakingOwnPieces(pieceColor, spaces);
                            validBoard = checkBoardAfterMove(pieceType, pieceColor, idName, possibleMoves);
                            break;
                        case "queen":
                            spaces = queenThreats(pieceId);
                            possibleMoves = removeTakingOwnPieces(pieceColor, spaces);
                            validBoard = checkBoardAfterMove(pieceType, pieceColor, idName, possibleMoves);
                            break;
                    }
                    allValidBoards = allValidBoards.concat(validBoard);
                }
            }
        }
    }
    if (allValidBoards.includes("valid")) {
        return "false";
    }
    return "true";
}

function checkBoardAfterMove(pieceType, pieceColor, idName, moves) {

    var validArray = [];

    for (var i = 0; i < moves.length; i++) {

        //set this square with class active
        var startId = idName;
        var pieceLocation = $("#" + idName);
        var piece = pieceLocation.html();

        //set this square with class active1
        var endId = moves[i];

        var startSelector = "#" + startId;
        var endSelector = "#" + endId;

        var tempPiece = "";
        //save temporarily taken piece to be added back later
        if ($(endSelector).html().length > 0) {
            tempPiece = $(endSelector).html();
        }

        //make move
        $(endSelector).html(piece);
        $(startSelector).html("");

        if (pieceColor == "lightPiece") {
            var validBoard = getAllPossibleMoves("darkPiece", idName, pieceType);
        }
        else {
            var validBoard = getAllPossibleMoves("lightPiece", idName, pieceType);
        }

        if (validBoard == "true") {
            validArray.push("valid");
        }
        else {
            validArray.push("invalid");
        }

        //undo move
        $(endSelector).html(tempPiece);
        $(startSelector).html(piece);
    }

    return validArray;
}

function testForPawnPromotion(color, id) {

    var row = id[1];

    var selector = "#" + id;

    if ((color == "lightPiece" && row == 8) || (color == "darkPiece" && row == 1)) {
        $(selector).html(getPiece(color, "queen"));
    }

}

function getPiece(color, type, marvel) {
    //REFERENCE: https://fontawesome.com/icons?d=gallery&p=2&c=chess
    var imageSrc;
    var imageFolder;
    if (marvel == "true") {
        if (boardData['lightUserTeam'] == "cap") {
            imageFolder = "../imagesUniversial/boardImages/capLightImages/";
        }
        else {
            imageFolder = "../imagesUniversial/boardImages/ironLightImages/";
        }
        imageSrc = imageFolder + color + type + ".png";
    }
    else {
        imageSrc = "../imagesUniversial/boardImages/normalImages/" + color + type + ".png";
    }

    // used to fit vision in square
    if (((color == "lightPiece" && boardData['lightUserTeam'] == "iron") || (color == "darkPiece" && boardData['lightUserTeam'] == "cap") || (boardData['gameType'] == "local") && color == "lightPiece") && type == "bishop" && marvel == "true") {
        image = "<img class='boardIcon lightBishop' src='" + imageSrc + "' alt='" + color + " " + type + "'>"
    }
    else {
        image = "<img class='boardIcon' src='" + imageSrc + "' alt='" + color + " " + type + "'>"
    }

    var html = "<div class='" + color + " " + type + "'>" + image + "</div>";

    return html;
}

// Takes the row number and the column number (charCode) and gets the Id
// function getSquareId(row, column) {
//     // REFERENCE: https://www.w3schools.com/jsref/jsref_fromcharcode.asp
//     return String.fromCharCode(column) + row;
// }

function onlyKings() {

    for (var row = 8; row >= 1; row--) {
        for (var column = 65; column <= 72; column++) {

            var idName = String.fromCharCode(column) + row;

            if (testForPiece(idName) == true) {
                var pieceClasses = $("#" + idName + " div").attr('class').split(/\s+/);
                var pieceType = pieceClasses[1];

                if (pieceType != "king") {
                    return;
                }
            }
        }
    }
    $('#endGameModal').modal('toggle');
    $("#modalHeader").text("Only Kings Left! It's a Draw!");
    boardData['gameResult'] = "Only Kings Left";
    boardData['gameState'] = "done";
    setUserView();

}

function enpassantSquares(pieceId, pieceColor) {

    var pieceHist = boardData['moveHistory'];
    var lastMove = pieceHist[pieceHist.length - 1];

    var lastMoveDestination = lastMove[2];
    var lastMoveStart = lastMove[1];

    var lastMoveDestinationRow = lastMoveDestination[1];
    var lastMoveStartRow = lastMoveStart[1];

    var difference = Math.abs(lastMoveDestinationRow - lastMoveStartRow);

    var lastMoveDestinationColumn = lastMoveDestination[0];
    var lastMoveDestinationRow = lastMoveDestination[1];

    var currentMoveColumn = pieceId[0];
    var currentMoveRow = pieceId[1];

    var epArray = [];

    if (difference == 2 && lastMove[0] == "pawn") {

        if (Math.abs(lastMoveDestinationColumn.charCodeAt(0) - currentMoveColumn.charCodeAt(0)) == 1) {

            if (pieceColor == "lightPiece" && currentMoveRow == 5) {
                epArray.push(lastMoveDestinationColumn + String(parseInt(lastMoveDestinationRow) + 1));
            }
            //else behind light pawn
            else if (pieceColor == "darkPiece" && currentMoveRow == 4) {
                epArray.push(lastMoveDestinationColumn + String(parseInt(lastMoveDestinationRow) - 1));
            }
        }
    }
    return epArray;
}


function logBoardState() {
    var boardState = [];
    for (var row = 1; row <= 8; row++) {
        for (var column = 65; column <= 72; column++) {

            var idName = String.fromCharCode(column) + row;

            if (testForPiece(idName) == true) {
                var pieceClasses = $("#" + idName + " div").attr('class').split(/\s+/);
                var pieceType = pieceClasses[1];
                var pieceColor = pieceClasses[0];

                boardState.push(pieceColor + pieceType);
            }
            else {
                boardState.push(0);
            }
        }
    }
    boardData['boardHistory'].push(boardState);
}

function threeMoveRep() {

    var boardHist = boardData['boardHistory'];

    var currentBoard = boardHist[boardHist.length - 1];

    var count = 1;
    for (var i = 0; i < boardHist.length - 1; i++) {

        if (areBoardsEqual(currentBoard, boardHist[i]) == "true") {
            count++;
        }
    }
    if (count == 3) {
        $('#endGameModal').modal('toggle');
        $("#modalHeader").text("Three Move Repitition! It's a Draw!");
        boardData['gameResult'] = "Three Move Repitition";
        boardData['gameState'] = "done";
        setUserView();

    }
}

function areBoardsEqual(currentBoard, testBoard) {

    for (var i = 0; i < currentBoard.length; i++) {

        if (currentBoard[i] != testBoard[i]) {
            return "false";
        }
    }
    return "true";
}


function testFiftyMoveCounter(pieceType) {

    var boardHist = boardData['boardHistory'];

    var currentBoard = boardHist[boardHist.length - 1];
    var pastBoard = boardHist[boardHist.length - 2];

    var difference = 0;

    for (var i = 0; i < boardHist[0].length; i++) {
        if (currentBoard[i] != 0) {
            difference++;
        }
        if (pastBoard[i] != 0) {
            difference--;
        }
    }
    if (pieceType == "pawn" || difference != 0) {
        boardData['fiftyMoveCounter'] = 0;
    }
    else {
        boardData['fiftyMoveCounter']++;
    }

    if (boardData['fiftyMoveCounter'] == 100) {
        $('#endGameModal').modal('toggle');
        $("#modalHeader").text("Fifty Move Rule! It's a Draw!");
        boardData['gameResult'] = "Fifty Move Rule";
        boardData['gameState'] = "done";
        setUserView();
    }
}



function changePieceImages() {

    for (var row = 8; row >= 1; row--) {
        for (var column = 65; column <= 72; column++) {
            var idName = String.fromCharCode(column) + row;

            if (testForPiece(idName) == true) {
                var typeOfIcons = $("#" + idName + " div img").attr('src').split("/")[3];
            }
        }
    }

    for (var row = 8; row >= 1; row--) {
        for (var column = 65; column <= 72; column++) {

            var idName = String.fromCharCode(column) + row;

            if (testForPiece(idName) == true) {

                var square = $("#" + idName);

                var pieceClasses = $("#" + idName + " div").attr('class').split(/\s+/);
                var pieceType = pieceClasses[1];
                var pieceColor = pieceClasses[0];

                var pieceHtml;
                if (typeOfIcons == "capLightImages" || typeOfIcons == "ironLightImages") {
                    pieceHtml = getPiece(pieceColor, pieceType, "false");
                }
                else {
                    pieceHtml = getPiece(pieceColor, pieceType, "true");
                }
                square.html(pieceHtml);
            }
        }
    }

    if (boardData['turn'] == "darkPiece" && boardData['gameType'] == "local") {
        rotatePieces('.lightPiece, .darkPiece', 180);
    }
    else if (boardData['currentUser'] == boardData['darkUser']) {
        rotatePieces('.lightPiece, .darkPiece', 180);
    }
}

function isMove() {
    var userColor;
    if (boardData['currentUser'] == boardData['lightUser']) {
        userColor = "lightPiece";
    }
    else {
        userColor = "darkPiece";
    }

    if (userColor == boardData['turn']) {
        return 1;
    }
    return 0;
}

function singleToMultiArray(array, size) {
    var multiArray = [];
    var tempArray = [];
    for (var i = 1; i <= array.length; i++) {
        tempArray.push(array[i - 1]);
        if (i % size == 0) {
            multiArray.push(tempArray);
            tempArray = [];
        }
    }
    return multiArray;
}

function arrayMultiToSingle(multiArray) {

    var singleArray = [];

    for (var i = 0; i < multiArray.length; i++) {
        var tempArray = multiArray[i];

        for (var j = 0; j < tempArray.length; j++) {
            singleArray.push(tempArray[j]);
        }
    }
    return singleArray;
}

// REFERENCE: https://codepen.io/seeker5084/pen/VMQGwX
function rotatePieces(selector, degrees) {
    $(selector).animate(
        { deg: degrees },
        {
            duration: 0,
            step: function (now) {
                $(this).css({ transform: 'rotate(' + now + 'deg)' });
            }
        }
    );
}

function setUserView() {
    if (boardData['currentUser'] == boardData['lightUser']) {
        boardData['lightUserViewedResult'] = "true";
    }
    else {
        boardData['darkUserViewedResult'] = "true";
    }
}


function loadGameResult() {
    if (boardData['lightUserViewedResult'] == "true") {
        if (boardData['currentUser'] == boardData['darkUser']) {

            if (boardData['gameResult'] == "Three Fold Repitition" || boardData['gameResult'] == "Fifty Move Rule" || boardData['gameResult'] == "Stalemate") {
                $('#endGameModal').modal('toggle');
                $("#modalHeader").text(boardData['gameResult'] + "! It's a tie!");
            }
            else {
                $('#endGameModal').modal('toggle');
                $("#modalHeader").text(boardData['gameResult'] + "! Sorry you Lost!");
            }
            deleteGame();
        }
        else {
            if (boardData['gameResult'] == "Three Fold Repitition" || boardData['gameResult'] == "Fifty Move Rule" || boardData['gameResult'] == "Stalemate") {
                $('#endGameModal').modal('toggle');
                $("#modalHeader").text(boardData['gameResult'] + "! It's a tie!");
            }
            else {
                $('#endGameModal').modal('toggle');
                $("#modalHeader").text(boardData['gameResult'] + "! You Win!");
            }
        }

    }
    else if (boardData['darkUserViewedResult'] == "true") {
        if (boardData['currentUser'] == boardData['lightUser']) {
            if (boardData['gameResult'] == "Three Fold Repitition" || boardData['gameResult'] == "Fifty Move Rule" || boardData['gameResult'] == "Stalemate") {
                $('#endGameModal').modal('toggle');
                $("#modalHeader").text(boardData['gameResult'] + "! It's a tie!");
            }
            else {
                $('#endGameModal').modal('toggle');
                $("#modalHeader").text(boardData['gameResult'] + "! Sorry you Lost!");
            }
            deleteGame();
        }
        else {
            if (boardData['gameResult'] == "Three Fold Repitition" || boardData['gameResult'] == "Fifty Move Rule" || boardData['gameResult'] == "Stalemate") {
                $('#endGameModal').modal('toggle');
                $("#modalHeader").text(boardData['gameResult'] + "! It's a tie!");
            }
            else {
                $('#endGameModal').modal('toggle');
                $("#modalHeader").text(boardData['gameResult'] + "! You Win!");
            }
        }
    }
    return;
}

function deleteGame() {

    $.ajax({
        url: "../php/deleteGame.php",
        data: { "gameId": gameId },
        method: "POST",
        dataType: "text",
        success: function (data) {
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError);
        }
    });
}

