//Need Chat


  //Initializes Firebase
  var config = {
    apiKey: "AIzaSyBWNxNBYOde4pP0aFD1biRlLXfTAFHlXnU",
    authDomain: "rps-multiplayer-2aff3.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-2aff3.firebaseio.com",
    projectId: "rps-multiplayer-2aff3",
    storageBucket: "rps-multiplayer-2aff3.appspot.com",
    messagingSenderId: "595616827337"
  };

  firebase.initializeApp(config);

  var database = firebase.database();
 
  var player1Name;
  var player2Name;
  var player1Choice;
  var player2Choice;
  var player1Wins;
  var player1Losses;
  var ties;
  var player2Wins;
  var player2Losses;
  var playerNumber = 0;
  var message;

  //resets values to 0 locally and in Firebase
  function resetGame() {
      $("#message").hide();
      player1Name = "";
      player2Name = "";
      player2Choice = "";
      player1Choice = "";
      message = "";
      player1Wins = 0;
      player2Wins = 0;
      player1Losses = 0;
      player2Losses = 0;
      ties = 0;
      database.ref().update({
          player1Name: player1Name,
          player2Name: player2Name,
          player2Choice: player2Choice,
          player1Choice: player1Choice,
          player1Wins: player1Wins,
          player2Wins: player2Wins,
          player1Losses: player1Losses,
          player2Losses: player2Losses,
          ties: ties,
          gameOver: false,
          message: message
      });
  }

  function compareChoices() {
      console.log("player1: " + player1Choice);
      console.log("player2: " + player2Choice);

        if(player1Choice == player2Choice) {
            
            $("#message").html("It's a tie. Play again to see who wins.").show();
            $('#player1Ties').html("Ties: " + ties);
            $('#player2Ties').html("Ties: " + ties);
            if (playerNumber == 1){
              ties++;
              database.ref().update({
                  ties: ties
              });
            }

        } else if (player1Choice == "rock" && player2Choice == "paper") {
            $("#message").html("Player 2 wins. Paper beats rock.").show();
            player2Win();
          
        } else if(player1Choice == "rock" && player2Choice == "scissors"){
            $("#message").html("Player 1 wins. Rock beats scissors.").show();
            player1Win();

        } else if(player1Choice == "scissors" && player2Choice == "paper"){
            $("#message").html("Player 1 wins. Scissors beats paper.").show();
            player1Win();
          
        } else if(player1Choice == "scissors" && player2Choice == "rock") {
            $("#message").html("Player 2 wins. Rock beats scissors.").show();
            player2Win();

        } else if (player1Choice == "paper" && player2Choice == "scissors") {
            $("#message").html("Player 2 wins. Scissors beats paper.").show();
            player2Win();
          
        } else if(player1Choice == "paper" && player2Choice == "rock"){
            $("#message").html("Player 1 wins. Paper beats rock.").show();
            player1Win();
          
        } 

       setTimeout(resetChoices, 5000);//may cause bug - player chooses before clears
  }

  function resetChoices() {
      $("#message").hide();
      player2Choice = "";
      player1Choice = "";
      database.ref().update({
          player2Choice: player2Choice,
          player1Choice: player1Choice,
          gameOver:false
      });
  }

  //updates score when player 1 wins
  function player1Win() {
    if (playerNumber == 1) {
      player1Wins++;
      player2Losses++;
      database.ref().update({
          player1Wins: player1Wins,
          player2Losses: player2Losses,
          gameOver: true
      });
    }
  }

  //updates scores when player 2 wins
  function player2Win() {
    if (playerNumber == 1) {
      player2Wins++;
      player1Losses++;
      database.ref().update({
          player2Wins: player2Wins,
          player1Losses: player1Losses,
          gameOver: true
      });
    }
  }

$(document).ready(function(){

    $('#player2OptionsDiv').hide();

    //resetGame();

    $("#submitName").on('click', function() {

        database.ref().once('value', function(snapshot){
            if (snapshot.val().player1Name == "") {
                player1Name = $("#name").val().trim();
                playerNumber = 1;
                database.ref().update({
                    player1Name: player1Name
                });
            } else if (snapshot.val().player2Name == "") {
                  player2Name = $("#name").val().trim();
                  playerNumber = 2;
                  database.ref().update({
                      player2Name: player2Name
                  });
            } else {
                $("#message").html("We already have 2 players. Please wait your turn.");
              }



              console.log(player1Name);
              console.log(player2Name);
              console.log(playerNumber);
            if (playerNumber == 1){
                $('.playerButtons').hide();
                $('#message').hide();
                $('#player1Name').html("Hello, " + player1Name);
                $("#message").html("Choose rock, paper, or scissors!").show();

            } else if(playerNumber == 2){

                $('#player2OptionsDiv').show();
                $('#player1OptionsDiv').hide();
                $('.playerButtons').hide();
                $("#player2Name").html("Hello, " + player2Name);
                $('#message').hide();
                $("#message").html("Choose rock, paper, or scissors!").show();
            }

        });
       
        


    });

    $('.player1Options').on('click', function(){
        var player1Choice = $(this).attr('value');
        database.ref().update({
            player1Choice: player1Choice
        });
        console.log("player1 in 1: " + player1Choice);
        console.log("player2 in 1: " + player2Choice);
    });

    $('.player2Options').on('click', function(){
        var player2Choice = $(this).attr('value');
        database.ref().update({
            player2Choice: player2Choice
        });
        console.log("player1 in 2: " + player1Choice);
        console.log("player2 in 2: " + player2Choice);
    });

    //when Firebase values change, 
    //updates variables with Firebase values, compares values, and displays scores
    database.ref().on('value', function(snapshot){
      var madeChoices = snapshot.val();
  
      $("#displayChats").html(madeChoices.message);
      if (playerNumber == 1){
          $("#player2Name").html("Player 2 is " + madeChoices.player2Name);
        }else if (playerNumber == 2){
          $("#player1Name").html("Player 1 is " + madeChoices.player1Name);
      }
      if (!madeChoices.player1Choice == "" && !madeChoices.player2Choice == "") {  
        player1Choice = madeChoices.player1Choice;
        player2Choice = madeChoices.player2Choice;
        player1Wins = madeChoices.player1Wins;
        player1Losses = madeChoices.player1Losses;
        player2Wins = madeChoices.player2Wins;
        player2Losses = madeChoices.player2Losses;
        ties = madeChoices.ties;
        if(!madeChoices.gameOver){
          compareChoices();
        }
        $('#player1Ties').html("Ties: " + ties);
        $('#player2Ties').html("Ties: " + ties);
        $('#player1Wins').html("Wins: " + player1Wins);
        $('#player2Losses').html("Losses: " + player2Losses);
        $('#player2Wins').html("Wins: " + player2Wins);
        $('#player1Losses').html("Losses: " + player1Losses);


      }

    });

    $('#startOver').on('click', function(){
        resetGame();
    });

        $('#submitChats').on('click', function(){
            database.ref().once('value', function(snapshot){
                message = snapshot.val().message + "<br/>";
                message = message + $("#chat").val().trim();
                      database.ref().update({
                        message: message
                      });
            });

        });

});