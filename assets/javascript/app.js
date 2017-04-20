

//after reset if next player enters name, scores reset??(always update score maybe???) or leave this part alone
//reset score either resets entire game on both browsers or sends message that other player reset the score
//check if chat working
//placeholder missing on one input??
//show image when make choice
//ui design/fonts
//trouble reading playerName.upperCase() around line 300
//not showing other's choice 
//take turns, message, and border
//when refresh says if anyone on and waiting
//person there keeps score

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

  $("#player1Message").hide();
  $("#player2Message").hide();

  function resetPlayer1() {
      if (playerNumber == 1) {
          $("#player1Message").hide();
          $("#message").html("Enter your name to play.").show();
      }
      player1Name = "";
      player1Choice = "";
      player1Wins = 0;
      player1Losses = 0;
      player1Ties = 0;
      database.ref("Player1/").update({
          player1Name: player1Name,
          player1Choice: player1Choice,
          player1Wins: player1Wins,
          player1Losses: player1Losses,
          player1Ties: player1Ties,
          gameOver: false
      });
  }

  function resetPlayer2() {
    if (playerNumber == 2) {
          $("#player2Message").hide();
          $("#message").html("Enter your name to play.").show();
      }
      player2Name = "";
      player2Choice = "";
      player2Wins = 0;
      player2Losses = 0;
      player2Ties = 0;
      database.ref("Player2/").update({
          player2Name: player2Name,
          player2Choice: player2Choice,
          player2Wins: player2Wins,
          player2Losses: player2Losses,
          player2Ties: player2Ties,
          gameOver: false
      });
  }

  database.ref("Chats/").update({
      chat: chat
  });
    
  database.ref("Messages/").update({
      player1Message: player1Message,
      player2Message: player2Message
  });    

  function resetChoices() {
      $("#player1Choice").empty();
      $("#player2Choice").empty();
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

  function compareChoices() {
        if(player1Choice == player2Choice) {
            player1Message = "It's a tie. Choose rock, paper, or scissors to play again."
            player2Message = "It's a tie. Wait for player 1 to choose rock, paper, or scissors to play again."
            database.ref("Messages/").update({
                player1Message: player1Message,
                player2Message: player2Message
            });
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
            database.ref("Messages/").update({
                player1Message: player1Message,
                player2Message: player2Message
            });
            player2Win();
        } else if(player1Choice == "rock" && player2Choice == "scissors"){
            player1Message = "You win! Rock beats scissors. Choose rock, paper, or scissors to play again."
            player2Message = "Player 1 wins. Rock beats scissors. Wait for player 1 to choose rock, paper, or scissors to play again."
            database.ref("Messages/").update({
                player1Message: player1Message,
                player2Message: player2Message
            });
            player1Win();
        } else if(player1Choice == "scissors" && player2Choice == "paper"){
            player1Message = "You win! Scissors beats paper. Choose rock, paper, or scissors to play again."
            player2Message = "Player 1 wins. Scissors beats paper. Wait for player 1 to choose rock, paper, or scissors to play again."
            database.ref("Messages/").update({
                player1Message: player1Message,
                player2Message: player2Message
            });
            player1Win();
        } else if(player1Choice == "scissors" && player2Choice == "rock") {
            player1Message = "Player 2 wins. Rock beats scissors. Choose rock, paper, or scissors to play again."
            player2Message = "You win! Rock beats scissors. Wait for player 1 to choose rock, paper, or scissors to play again."
            database.ref("Messages/").update({
                player1Message: player1Message,
                player2Message: player2Message
            });
            player2Win();
        } else if (player1Choice == "paper" && player2Choice == "scissors") {
            player1Message = "Player 2 wins. Scissors beats paper. Choose rock, paper, or scissors to play again."
            player2Message = "You win! Scissors beats paper. Wait for player 1 to choose rock, paper, or scissors to play again."
            database.ref("Messages/").update({
                player1Message: player1Message,
                player2Message: player2Message
            });
            player2Win();
        } else if(player1Choice == "paper" && player2Choice == "rock"){
            player1Message = "You win! Paper beats rock. Choose rock, paper, or scissors to play again."
            player2Message = "Player 1 wins. Paper beats rock. Wait for player 1 to choose rock, paper, or scissors to play again."
            database.ref("Messages/").update({
                player1Message: player1Message,
                player2Message: player2Message
            });
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

  function startGame() {
      player1Message = "It is your turn. Choose rock, paper, or scissors."
      player2Message = "It is player 1's turn to choose rock, paper, or scissors."
      database.ref("Messages/").update({
          player1Message: player1Message,
          player2Message: player2Message
      });
  }

$(document).ready(function(){

    $("#submitName").on('click', function() {
        database.ref("Player1/").once('value', function(snapshot){
            player1  = snapshot.val();
        });
        database.ref("Player2/").once('value', function(snapshot){
            player2  = snapshot.val();
        });

        if (!player1 && playerNumber == 0) {
                player1Name = $("#name").val().trim();
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
                $("#name").val("");
        }   else if (!player2 && playerNumber == 0) {
                player2Name = $("#name").val().trim();
                playerNumber = 2;
                player1Message = "Player 2 has just joined the game."
                database.ref("Messages/").update({
                    player1Message: player1Message
                });
                $("#message").hide();
                $("#player2Message").show();
                database.ref("Player2/").update({
                    player2Name: player2Name,
                    player2Choice: "",
                    player2Wins: 0,
                    player2Losses: 0,
                    player2Ties: 0,
                    gameOver: false
                });
                $("#name").val("");
            }   else {
                    $("#message").html("We already have 2 players. Please wait your turn.").show();
                }
        if (playerNumber == 1){
            $('#player1Name').html("Hello, " + player1Name);
        }   else if (playerNumber == 2){
                $("#player2Name").html("Hello, " + player2Name);
            }
        if (!player1Name == "" && !player2Name == "") {
            startGame();
        }
    });

    //when Firebase values change, 
    //updates variables with Firebase values, compares values, and displays scores
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

    $('.playerOptions').on('click', function(){
        if (player1Choice == "" && player2Choice == "") {
            if (playerNumber == 1) {
                player1Choice = $(this).attr('value');
                $("#player1Choice").html(player1Choice);
                database.ref("Player1/").update({
                    player1Choice: player1Choice
                });
                player1Message = "It is player 2's turn to choose rock, paper, or scissors."
                player2Message = "It is your turn. Please choose rock, paper, or scissors."
                database.ref("Messages/").update({
                    player1Message: player1Message,
                    player2Message: player2Message
                });
            } 
            $("#message").html("It is player 2's turn to choose rock, paper, or scissors.");  
        }   else if (!player1Choice == "" && player2Choice == "") {
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

    $('.submitChats').on('click', function(){
        if (!playerNumber == 0) {
            var player1Uppercase = player1Name.toUpperCase();
            var player2Uppercase = player2Name.toUpperCase();
            if (playerNumber == 1) {
                chat = player1Uppercase + ": " + $("#chat").val().trim();
            }   else if (playerNumber == 2) {
                    chat = player2Uppercase + ": " + $("#chat").val().trim();
                }
            database.ref("Chats/").update({
                chat: chat
            });
            $("#chat").val("");
        }
    });

    $('.submitChats2').on('click', function(){
        if (!playerNumber == 0) {
            var player1Uppercase = player1Name.toUpperCase();
            var player2Uppercase = player2Name.toUpperCase();
            if (playerNumber == 1) {
                chat = player1Uppercase + ": " + $("#chat2").val().trim();
            }   else if (playerNumber == 2) {
                    chat = player2Uppercase + ": " + $("#chat2").val().trim();
                }
            database.ref("Chats/").update({
                chat: chat
            });
            $("#chat2").val("");
        }
    });

    database.ref("Chats/").on('value', function(snapshot){
        chat = snapshot.val().chat + "<br/>";
        $(".displayChats").append(chat);
        element = document.getElementById("displayChats2");
        element.scrollTop = element.scrollHeight;
    });

    database.ref("Messages/").on('value', function(snapshot){
        player1Message = snapshot.val().player1Message;
        player2Message = snapshot.val().player2Message;
        $("#player1Message").html(player1Message);
        $("#player2Message").html(player2Message);
    });

});//ends document.ready



    var player1Values;
    var player2Values;

    var player1Ref = database.ref("Player1/");
    player1Ref.onDisconnect().remove();

    var player2Ref = database.ref("Player2/");
    player2Ref.onDisconnect().remove();



 //var playerLeft;

  //when close or refresh browser
  // window.onbeforeunload = function() {
    
    // console.log("1" + player1Name);
    // console.log("2" + player2Name);
      // if (playerNumber == 1) {
      //     resetPlayer1();
          //playerLeft = player1Name;
      // }   
      //     else if (playerNumber == 2) {
      //         resetPlayer2();
              //playerLeft = player2Name;
          // }
      // message = playerLeft + "has left the game."
      // database.ref("Chats/").update({
      //       message: messagingSenderId
      // });

      // if (playerNumber == 0) {
      //     resetPlayer1();
      //     resetPlayer2();
      // }
  // }


