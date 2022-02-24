
var pageUrl = window.location.href;
var url = new URL(pageUrl);
var gameId = url.hash.slice(1);

$.ajax({
    url: "../php/boardRedirects.php",
    data: { "gameId": gameId },
    method: "GET",
    dataType: "text",
    success: function (data) {

        if (data == "home") {
            window.location = "http://ec2-54-237-92-230.compute-1.amazonaws.com/final_project/pages/home.html";
        }
        else if (data == "landing") {
            window.location = "http://ec2-54-237-92-230.compute-1.amazonaws.com/final_project";
        }
    },
    error: function (xhr, ajaxOptions, thrownError) {
        console.log(thrownError);
    }
});
