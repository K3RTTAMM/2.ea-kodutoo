
/* TYPER */
const TYPER = function () {
	console.log("TYPER funktsioon.")
	if (TYPER.instance_) {
	  return TYPER.instance_
	}
	TYPER.instance_ = this
  
	this.WIDTH = window.innerWidth
	this.HEIGHT = window.innerHeight
	this.canvas = null
	this.ctx = null
  
	this.words = []
	this.word = null
	this.wordMinLength = 5
	this.guessedWords = 0
	this.guessedLetters = 0
	this.score = 0
	this.playerName = document.getElementById("playerNameText").value
  
	this.init()
  }
  
  window.TYPER = TYPER
  
  TYPER.prototype = {
	  init: function () {
		  console.log("TYPER.prototype")
		  this.canvas = document.getElementsByTagName('canvas')[0]
		  this.ctx = this.canvas.getContext('2d')
		  this.canvas.style.width = this.WIDTH + 'px'
		  this.canvas.style.height = this.HEIGHT + 'px'
		  this.canvas.width = this.WIDTH * 2
		  this.canvas.height = this.HEIGHT * 2
		  this.loadWords()
	  },
  
  loadWords: function () {
	  console.log("loadWords: function")
	  const xmlhttp = new XMLHttpRequest()
	  xmlhttp.onreadystatechange = function () {
		  console.log("xmlhttp.onreadystatechange function")
			  if (xmlhttp.readyState === 4 && (xmlhttp.status === 200 || xmlhttp.status === 0)) {
				  const response = xmlhttp.responseText
				  const wordsFromFile = response.split('\n')
				  typer.words = structureArrayByWordLength(wordsFromFile)
				  typer.start()
		  }
	  }   
	  xmlhttp.open('GET', './lemmad2013.txt', true)
	  xmlhttp.send()
  },
  
  start: function () {
	  console.log("start: function")
	  this.generateWord()
	  this.word.Draw()
	  window.addEventListener('keypress', this.keyPressed.bind(this))
  },
  
  generateWord: function () {
	  console.log("generateWord function")
	  const generatedWordLength = this.wordMinLength + parseInt(this.guessedWords / 2)
	  const randomIndex = (Math.random() * (this.words[generatedWordLength].length - 1)).toFixed()
	  const wordFromArray = this.words[generatedWordLength][randomIndex]
	  this.word = new Word(wordFromArray, this.canvas, this.ctx)
  },
  
	  keyPressed: function (event) {
		  console.log("keypressed: function")
		  const letter = String.fromCharCode(event.which)
  
	  
	  if (letter === this.word.left.charAt(0)) {
		  this.word.removeFirstLetter()
		  this.score += 1 // skoor +1 kui on õige täht
		  console.log(this.score)
		  updateScore(this.score)
  
		  document.body.style.background = "white" // õige täht = background white	  
		
		  if (this.word.left.length === 0) {
		  this.guessedWords += 1
		  if(this.guessedWords%5 ===0){ // peale viit õigesti arvatud sõna lisandub skoorile boonus +10
			  this.score+=10
		  }
		  console.log(this.score)
		  updateScore(this.score)
		  this.generateWord()
		  
		  
  
		}
  
		this.word.Draw()
	  }
	  else{
		  document.body.style.background = "red" // vale täht = background red
		  this.score -=1
		  console.log(this.score)
		  updateScore(this.score)
		  
	  }
	}
  }
  
  /* WORD */
  const Word = function (word, canvas, ctx) {
	  console.log("const Word function")
	  this.word = word
	  this.left = this.word
	  this.canvas = canvas
	  this.ctx = ctx
  }
  
  Word.prototype = {
	  Draw: function () {
	  console.log("Draw: function")
	  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  
	  this.ctx.textAlign = 'center'
	  this.ctx.font = '140px Courier'
	  this.ctx.fillText(this.left, this.canvas.width / 2, this.canvas.height / 2)
	  },
  
	  removeFirstLetter: function () {
		  console.log("removeFirstLetter function")
		  this.left = this.left.slice(1)
	  }
  }
  
  /* HELPERS */
  function structureArrayByWordLength (words) {
	console.log("structureArrayByWordLength function")
	let tempArray = []
  
	  for (let i = 0; i < words.length; i++) {
		  const wordLength = words[i].length
		  if (tempArray[wordLength] === undefined)tempArray[wordLength] = []
  
		  tempArray[wordLength].push(words[i])
	  }
	  return tempArray
  }
  
  function checkNameInput() {
	  if (document.getElementById("playerNameText").value != ""){
		  startGame()
	  } else {
		  document.getElementById("playerNameText").value= "Anonymous"
		  startGame()
	  }
  }
  
  function highScores() {
	  showHide("startGame")
	  showHide("highScores")
	  showHide("playerName")
	  showHide("menuButton")
	  showHide("scores")
  }
  
  function highToMenu() {
	  showHide("startGame")
	  showHide("highScores")
	  showHide("playerName")
	  showHide("menuButton")
	  showHide("scores")
  }
  
  function startGame(){
	  document.getElementById("gameStartDiv").innerHTML="<canvas></canvas>"
	  showHide("gameMenu");
	  showHide("topBar")
	  const typer = new TYPER()
	  window.typer = typer
		  
	  let display = document.querySelector('#time');
	  let time = 10 // timeri aeg sekundites
	  let duration
	  startTimer(time, display);
  }
  
  function newGame(){
  
	  const typer = new TYPER()
	  window.typer = typer
	  typer.guessedWords = 0
	  typer.guessedLetters = 0
	  typer.score = 0
	  document.getElementById("score").innerHTML=""
	  typer.generateWord()
	  typer.word.Draw()
	  startTimer(10, display)
  }
  
  window.onload = function(){
	  showHide("topBar")
	  showHide("scores")
	  showHide("menuButton")
	  
  }
  
  //https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_toggle_hide_show
  function showHide(divID) {
	  var x = document.getElementById(divID);
	  if (x.style.display === "none") {
		  x.style.display = "block";
	  } else {
		  x.style.display = "none";
	  }
  }
  
  function updateScore(score){
	  document.getElementById("score").innerHTML = score+ " punkti (" + typer.guessedWords + " sõna kirjutatud)"
  }
  
  
  function saveScore(){
  
	  let allPlayerData = []
		  let singlePlayerData = {playerName: typer.playerName, playerScore: typer.score}
		  let storageData = null
  
		  if(localStorage.getItem("allPlayerData")){
			  storageData = JSON.parse(localStorage.getItem("allPlayerData"))
			  if(allPlayerData = storageData){
				  allPlayerData = storageData
			  }
  
		  }
  
		  allPlayerData.push(singlePlayerData)
		  localStorage.setItem("allPlayerData", JSON.stringify(allPlayerData))
   }

window.onload = function() {
	top10Players();
};


//http://www.internet-technologies.ru/articles/sortirovka-massivov-v-javascript.html
function sortScores(i, ii) { // Убывание
	if (i.playerScore < ii.playerScore){
	return 1;
	}else if (i.playerScore > ii.playerScore){
	return -1;
	}else{
	return 0;
	}
}

function top10Players() {
	var allPlayerData = JSON.parse(localStorage.getItem("allPlayerData"));
	var content = document.getElementsByClassName('top10players')[0];

	allPlayerData.sort(sortScores);

	for (i = 0; i < 10; i++) {
		content.innerHTML += "<li>" + "Name: " + allPlayerData[i].playerName + " Score: " + allPlayerData[i].playerScore + "</li>";
	}l
}

  
  //https://stackoverflow.com/questions/20618355/the-simplest-possible-javascript-countdown-timer
  function startTimer(duration, display) {
	var timer = duration, minutes, seconds
	setInterval(function () {
		  minutes = parseInt(timer / 60, 10)
		  seconds = parseInt(timer % 60, 10)
  
		  minutes = minutes < 10 ? "0" + minutes : minutes
		  seconds = seconds < 10 ? "0" + seconds : seconds
  
		  display.textContent = minutes + ":" + seconds
  
	  if (--timer < 0) {
		  
  
		  
		  let again = confirm("Mäng läbi! \nSinu skoor on: " + typer.score + " \nMängi uuesti?")
		  
		  if(again === true){
			  timer = duration
			  saveScore()
			  newGame()
			  
		  }else if( again=== false){
			  timer = duration
			  saveScore()
			  window.location.href = "index.html"
		  }
		  
		}
	   }, 1000);	
  }

  //TOP10//
