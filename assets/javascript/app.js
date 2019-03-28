var goods;
var fails;
var currentQuestion;
var timer;
var timeToGuess;
var gameLibrary; 
var questionLength = 10; // seconds you have to guess
var answerLength = 3; // time while answer is displayed
var gameLength; // Limit of number of questions per game

function initGame(){
	// display intro
	$("#qText").html('From options displayed choose the author of the quote. Some of them are very difficult, and you only have 10 seconds to answer.<button id="startGame">Begin Game</button>');
	$("#result").hide();
	$("#choices").hide();
	$("#choices li").empty();
	$(".scoreboard").empty();
	//add listeners
	$("#choices .answer").off().on("click", makeGuess);
	$("#startGame").off().on("click", newQuestion);
	//reset game variables
	fails = 0;
	goods = 0;
	// creates a fresh clone of the library on each play
	gameLibrary = questionsLibrary.slice(); 
	timeToGuess = questionLength;
	gameLength = gameLibrary.length;
}
function newQuestion(){
	if(goods + fails >= gameLength){
		gameOver();
	} else {
		//select a new random question 
		var questionNumber = Math.floor(Math.random() * gameLibrary.length);
		currentQuestion = gameLibrary[questionNumber];
		gameLibrary.splice(questionNumber, 1);
		resetTimer();
		$("#result").empty().hide();
		$("#qText").html(currentQuestion.question);
		$("#choices").show().find(".answer").each(function(i){
			$(this).html(currentQuestion.answers[i]);
		});
		$("body").css("background-image", "url('"+currentQuestion.image+"')");
		// start Question Timer
		timer = setInterval(showTimer, 1000);
	}
}
function makeGuess(){
	if ($(this).data("choice") == currentQuestion.right){
		goods++;
		showResult("You are right!", "correctResult");
	} else {
		fails++;
		showResult("Wrong. The correct answer was " + currentQuestion.answers[currentQuestion.right], "wrongResult");
	}
}
function timesUp(){
	fails++;
	resetTimer();
	showResult("Time's Up! The correct answer is " + currentQuestion.answers[currentQuestion.right], "timesUp");
}
function showTimer(){
	if (timeToGuess >= 0){
		$("#timer").html(timeToGuess + " seconds left");
		timeToGuess--;
	} else {
		timesUp();
	}
}
function resetTimer(){
	clearInterval(timer);
	timeToGuess = questionLength;
	$("#timer").empty();
}
function showResult(msg, addThisClass){
	resetTimer();
	$("#result").html(msg).show().removeClass().addClass(addThisClass);
	setTimeout(newQuestion, answerLength*1000);
	$("#score").html("correct: " + goods + " <br> wrong: " + fails);
}
function gameOver(){
	$("body").css("background-image", 'url("assets/images/3_word_quotes.jpg")');
	var score = (goods/gameLength);
	var Bye = "Good try, keep up!!!";
	if (score > .8){
		Bye = "Amazing! Your knowledge is remarkable.";
	} else if (score > .5){
		Bye = "Well done; You achieved a rank over the average.";
	} else if (score > .3){
		Bye = "Not bad, you level is kind of acceptable.";
	}
	$("#result").removeClass().html("<h1>Game Over</h1><div class='gameOverText'>You got " + goods + " questions right and " + fails + " wrong. " + Bye + "</div><button id='newGame'>Play Again</button>");
	$("#newGame").on("click", initGame);
}
$(document).ready(initGame);