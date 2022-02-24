<!-- 
    Name: Andrew Brain
    Pawprint: amb5cb
    Date: May 5, 2021
    Final Project

    References
        1. https://codepen.io/cjr85/pen/qBRyEgJ
 -->
<?php
	$username = empty($_COOKIE['username']) ? '' : $_COOKIE['username'];

	// If the user is logged in, redirect them home
	if ($username) {

        header("Location: ../pages/home.html");
        exit;
	}

?>


<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>Create Account</title>

    <!-- BootStrap CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
        integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">

    <!-- Custom CSS -->
    <link href="../css/createAccount.css" rel="stylesheet">
</head>

<body>
     <div class="loadingBox"></div>

    <img class="landingImages teamIronManImage" src="../imagesUniversial/landingPagePhoto_1.jpg"
        alt="Team Iron Man"><img class="landingImages teamCapImage" src="../imagesUniversial/landingPagePhoto_2.jpg"
        alt="Team Captain America">

    <!-- REFERNECE: https://codepen.io/cjr85/pen/qBRyEgJ -->
    <div class="signUp-container">
        <h3 class="signUp-title">Create Account</h3>
        <form action="../php/signUp.php" method="POST">
            <input type="hidden" name="action" value="do_signUp">
            <div class="input-group">
                <label for="username">User Name</label>
                <input id="username" type="text" name="createUserName" required autofocus />
            </div>
            <div class="input-group">
                <label for="password">Password</label>
                <input id="password" type="password" name="createUserPassword" required />
            </div>
            <div class="form-group" id="teamSelectGroup">
                <select name="team" class="form-control" id="team">
                    <option value="default">Select Team</option>
                    <option value="iron">Iron Man</option>
                    <option value="cap">Captain America</option>
                </select>
            </div>
            <?php
                if ($error) {
                    print "<h4 id='createAccountError'>$error</h4>\n";
                }
            ?>
            <button type="submit" class="signUp-button">Create Account</button>
        </form>
    </div>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"
        integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.bundle.min.js"
        integrity="sha384-LtrjvnR4Twt/qOuYxE721u19sVFLVSA4hf/rRt6PrZTmiPltdZcI7q7PXQBYTKyf"
        crossorigin="anonymous"></script>
    <script src="../js/createAccountAndSignIn.js"></script>
</body>

</html>