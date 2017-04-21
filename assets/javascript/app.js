
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
 
  var player1Name = "";
  var player2Name = "";
  var player1Choice = "";
  var player2Choice = "";
  var player1Wins;
  var player1Losses;
  var player1Ties;
  var player2Ties;
  var player2Wins;
  var player2Losses;
  var playerNumber = 0;
  var player1Message = "Thanks for joining our game.";
  var player2Message = "Thanks for joining our game.";
  var chat = "";
  var element;
  var player2;
  var player1;
  var playerTurn = "";

  $("#player1Message").hide();
  $("#player2Message").hide();
  $("#player1Choice").hide();
  $("#player2Choice").hide();

  //updates values in Firebase
  updateChats();
  updateMessages();
  updateTurn();

  function resetChoices() {
      //reassigns turn to player 1
      playerTurn = "player1";
      updateTurn();
      //removes last choice made from browser
      if (playerNumber == 1){
            $("#player1Choice").empty();
            $("#player2Choice").hide();
        }   else if (playerNumber == 2){
                $("#player1Choice").hide();
                $("#player2Choice").empty();
            }
      //removes last choice from Firebase
      player2Choice = "";
      player1Choice = "";
      database.ref("Player1/").update({
          player1Choice: player1Choice,
          gameOver: false
      });
      database.ref("Player2/").update({
          player2Choice: player2Choice,
          gameOver: false
      });
  }

  //compares choices made, determines winner, and updates values in Firebase
  function compareChoices() {
        playerTurn = "";
        updateTurn();
        if(player1Choice == player2Choice) {
            player1Message = "It's a tie. Choose rock, paper, or scissors to play again."
            player2Message = "It's a tie. Wait for player 1 to choose rock, paper, or scissors to play again."
            updateMessages();
            player1Ties++;
            player2Ties++;
            database.ref("Player1/").update({
                player1Ties: player1Ties,
                gameOver: true
            });
            database.ref("Player2/").update({
                player2Ties: player2Ties,
                gameOver: true
            });
        } else if (player1Choice == "rock" && player2Choice == "paper") {
            player1Message = "Player 2 wins. Paper beats rock. Choose rock, paper, or scissors to play again."
            player2Message = "You win! Paper beats rock. Wait for player 1 to choose rock, paper, or scissors to play again."
            updateMessages();
            player2Win();
        } else if(player1Choice == "rock" && player2Choice == "scissors"){
            player1Message = "You win! Rock beats scissors. Choose rock, paper, or scissors to play again."
            player2Message = "Player 1 wins. Rock beats scissors. Wait for player 1 to choose rock, paper, or scissors to play again."
            updateMessages();
            player1Win();
        } else if(player1Choice == "scissors" && player2Choice == "paper"){
            player1Message = "You win! Scissors beats paper. Choose rock, paper, or scissors to play again."
            player2Message = "Player 1 wins. Scissors beats paper. Wait for player 1 to choose rock, paper, or scissors to play again."
            updateMessages();
            player1Win();
        } else if(player1Choice == "scissors" && player2Choice == "rock") {
            player1Message = "Player 2 wins. Rock beats scissors. Choose rock, paper, or scissors to play again."
            player2Message = "You win! Rock beats scissors. Wait for player 1 to choose rock, paper, or scissors to play again."
            updateMessages();
            player2Win();
        } else if (player1Choice == "paper" && player2Choice == "scissors") {
            player1Message = "Player 2 wins. Scissors beats paper. Choose rock, paper, or scissors to play again."
            player2Message = "You win! Scissors beats paper. Wait for player 1 to choose rock, paper, or scissors to play again."
            updateMessages();
            player2Win();
        } else if(player1Choice == "paper" && player2Choice == "rock"){
            player1Message = "You win! Paper beats rock. Choose rock, paper, or scissors to play again."
            player2Message = "Player 1 wins. Paper beats rock. Wait for player 1 to choose rock, paper, or scissors to play again."
            updateMessages();
            player1Win();
        } 
        setTimeout(resetChoices, 3000);
  }

  //updates score when player 1 wins
  function player1Win() {
      player1Wins++;
      player2Losses++;
      database.ref("Player1/").update({
          player1Wins: player1Wins,
          gameOver: true
      });
      database.ref("Player2/").update({
          player2Losses: player2Losses,
          gameOver: true
      });
  }

  //updates scores when player 2 wins
  function player2Win() {
      player2Wins++;
      player1Losses++;
      database.ref("Player1/").update({
          player1Losses: player1Losses,
          gameOver: true
      });
      database.ref("Player2/").update({
          player2Wins: player2Wins,
          gameOver: true
      });
  }

  //updates message text in Firebase
  function updateMessages() {
      database.ref("Messages/").update({
          player1Message: player1Message,
          player2Message: player2Message
      });
  }

  //updates player's turn in Firebase
  function updateTurn() {
      database.ref("Turn/").update({
          playerTurn: playerTurn
      });
  }

  //updates chat text in Firebase
  function updateChats() {
      database.ref("Chats/").update({
          chat: chat
      });
  }

  //sets message indicating players' turn
  function startGame() {
      player1Message = "It is your turn. Choose rock, paper, or scissors."
      player2Message = "It is player 1's turn to choose rock, paper, or scissors."
      playerTurn = "player1";
      updateTurn();
      updateMessages();
  }

  //sets player1 div border to purple and returns player 2 div to blue 
  function startTurn() {
      $("#player1ScoreDiv").css("border", "5px solid #B540B5");
      $("#player2ScoreDiv").css("border", "2px solid blue");
  }

  //when close or refresh browser, removes leaving player's data
  window.onbeforeunload = function() {
      if (playerNumber == 1) {
          var player1Ref = database.ref("Player1/");
          player1Ref.remove();
      }   
          else if (playerNumber == 2) {
              var player2Ref = database.ref("Player2/");
              player2Ref.remove();
          }
  }

$(document).ready(function(){

    $("#submitName").on('click', function(event) {
        //prevents the submit button from trying to submit a form when clicked
        event.preventDefault();
        //gets player values from Firebase
        database.ref("Player1/").once('value', function(snapshot){
            player1  = snapshot.val();
        });
        database.ref("Player2/").once('value', function(snapshot){
            player2  = snapshot.val();
        });
        //if no player1, assigns name inputted to player1 and sets initial player 1 values
        if (!player1 && playerNumber == 0) {
                player1Name = $("#name").val().trim();
                if (!player1Name == "") {
                    playerNumber = 1;
                    database.ref("Player1/").update({
                        player1Name: player1Name,
                        player1Choice: "",
                        player1Wins: 0,
                        player1Losses: 0,
                        player1Ties: 0,
                        gameOver: false
                    });
                    $("#message").hide();
                    $("#player1Message").show();
                    $("#player1Choice").show();
                    $("#name").val("");
                }
        //if no player2, assigns name inputted to player1 and sets initial player 1 values
        }   else if (!player2 && playerNumber == 0) {
                player2Name = $("#name").val().trim();
                if (!player2Name == "") {
                    playerNumber = 2;
                    player1Message = "Player 2 has just joined the game."
                    database.ref("Messages/").update({
                        player1Message: player1Message
                    });
                    $("#message").hide();
                    $("#player2Message").show();
                    $("#player2Choice").show();
                    database.ref("Player2/").update({
                        player2Name: player2Name,
                        player2Choice: "",
                        player2Wins: 0,
                        player2Losses: 0,
                        player2Ties: 0,
                        gameOver: false
                    });
                    $("#name").val("");
                }
                //if already have player1 and player2, displays message
                //specified if playerNumber == 0 here to only display message if not already a player
            }   else if (playerNumber == 0) {
                    $("#message").html("We already have 2 players. Please wait your turn.").show();
                }
        //displays player names based on player number
        if (playerNumber == 1){
            $('#player1Name').html("Hello, " + player1Name);
        }   else if (playerNumber == 2){
                $("#player2Name").html("Hello, " + player2Name);
            }
        //calls startGame function if both players assigned
        if (!player1Name == "" && !player2Name == "") {
            startGame();
        }
    });

    $('.playerOptions').on('click', function(){
        //assigns choice to player1 if no choices made
        if (player1Choice == "" && player2Choice == "") {
            if (playerNumber == 1) {
                player1Choice = $(this).attr('value');
                $("#player1Choice").html(player1Choice);
                database.ref("Player1/").update({
                    player1Choice: player1Choice
                });
                player1Message = "It is player 2's turn to choose rock, paper, or scissors."
                player2Message = "It is your turn. Please choose rock, paper, or scissors."
                playerTurn = "player2";
                updateTurn();
                updateMessages();
            }
            //assigns choice to player2 if player 1 choice made and not player 2 choice
            //calls function to compare choices
        }   else if (!player1Choice == "" && player2Choice == "") {
                $("#player1Choice").show();
                $("#player2Choice").show();
                if (playerNumber == 2) {
                    player2Choice = $(this).attr('value');
                    $("#player2Choice").html(player2Choice);
                    database.ref("Player2/").update({
                        player2Choice: player2Choice
                    });
                    compareChoices();
                }
            }   
    });

    //updates in Firebase chats inputted in larger browsers
    $('.submitChats').on('click', function(event){
        event.preventDefault();
        chat = $("#chat").val().trim();
        if (!chat == "") {
            if (!playerNumber == 0) {
                var player1Uppercase = player1Name.toUpperCase();
                var player2Uppercase = player2Name.toUpperCase();
                if (playerNumber == 1) {
                    chat = player1Uppercase + ": " + chat;
                }   else if (playerNumber == 2) {
                        chat = player2Uppercase + ": " + chat;
                    }
                updateChats();
                $("#chat").val("");
            }
        }
    });

    //updates in Firebase chats inputted in smaller browsers
    $('.submitChats2').on('click', function(event){
        event.preventDefault();
        chat = $("#chat2").val().trim();
        if (!chat == "") {
            if (!playerNumber == 0) {
                var player1Uppercase = player1Name.toUpperCase();
                var player2Uppercase = player2Name.toUpperCase();
                if (playerNumber == 1) {
                    chat = player1Uppercase + ": " + chat;
                }   else if (playerNumber == 2) {
                        chat = player2Uppercase + ": " + chat;
                    }
                updateChats();
                $("#chat2").val("");
            }
        }
    });

    //updates browser when player 1 values stored in Firebase change
    database.ref("Player1/").on('value', function(snapshot){
        player1Values = snapshot.val();
        if (!player1Values) {
            $('#player1Name').html("Waiting for player 1");
        }   else {
                player1Name = player1Values.player1Name;
                $("#player1Name").html("Player 1 is " + player1Name);
                player1Choice = player1Values.player1Choice;
                player1Wins = player1Values.player1Wins;
                player1Losses = player1Values.player1Losses;
                player1Ties = player1Values.player1Ties;
                $('#player1Ties').html(player1Ties);
                $('#player1Wins').html(player1Wins);
                $('#player1Losses').html(player1Losses);
                $("#player1Choice").html(player1Choice);
            }
    });

    //updates browser when player 2 values stored in Firebase change
    database.ref("Player2/").on('value', function(snapshot){
        player2Values = snapshot.val();
        if (!player2Values) {
            $('#player2Name').html("Waiting for player 2");
        }   else {
                player2Name = player2Values.player2Name;
                $("#player2Name").html("Player 2 is " + player2Name);
                player2Choice = player2Values.player2Choice;
                player2Wins = player2Values.player2Wins;
                player2Losses = player2Values.player2Losses;
                player2Ties = player2Values.player2Ties;
                $('#player2Ties').html(player2Ties);
                $('#player2Wins').html(player2Wins);
                $('#player2Losses').html(player2Losses);
                $("#player2Choice").html(player2Choice);
            }
    });

    //updates browser when chat text stored in Firebase changes
    //adds automatic scroll to chat display div so always see latest chat
    database.ref("Chats/").on('value', function(snapshot){
        chat = snapshot.val().chat + "<br/>";
        $(".displayChats").append(chat);
        element = document.getElementById("displayChats2");
        element.scrollTop = element.scrollHeight;
    });

    //updates browser when message text stored in Firebase changes
    database.ref("Messages/").on('value', function(snapshot){
        player1Message = snapshot.val().player1Message;
        player2Message = snapshot.val().player2Message;
        $("#player1Message").html(player1Message);
        $("#player2Message").html(player2Message);
    });

    //changes border of player div based on players' turn (as stored in Firebase) 
    database.ref("Turn/").on('value', function(snapshot){
        playerTurn = snapshot.val().playerTurn;
        if (playerTurn == "player1") {
              $("#player1ScoreDiv").css("border", "5px solid #B540B5");
              $("#player2ScoreDiv").css("border", "2px solid blue");
        }  else if (playerTurn == "player2") {
              $("#player2ScoreDiv").css("border", "5px solid #B540B5");
              $("#player1ScoreDiv").css("border", "2px solid blue");
           }  else {
                  $("#player1ScoreDiv").css("border", "2px solid blue");
                  $("#player2ScoreDiv").css("border", "2px solid blue");
              }
    });

});//ends document.ready

 


