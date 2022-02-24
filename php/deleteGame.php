<?php 
/*
  REFERENCES
    1. https://www.w3schools.com/php/php_mysql_delete.asp
*/

$gameId = empty($_POST['gameId']) ? '' : $_POST['gameId'];

require_once "../db.conf";

$deleteGameSQL = "DELETE FROM games WHERE gameId=$gameId;";

// REFERENCE: https://www.w3schools.com/php/php_mysql_delete.asp
if (mysqli_query($mysqli, $deleteGameSQL)) {
  echo "Game deleted successfully";
} else {
  echo "Error deleting game: " . mysqli_error($mysqli);
}
$mysqli->close();
?>














