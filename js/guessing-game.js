/*

Write your guess-game code here! Don't forget to look at the test specs as a guide. You can run the specs
by running "testem".

In this file, you will also include the event listeners that are needed to interact with your HTML file when
a user clicks a button or adds a guess to the input field.

*/

function generateWinningNumber(){
  let winningNum=Math.ceil(Math.random()*100);
  return winningNum;
}


function shuffle(arr){
  let n= arr.length;
  let t,i;

  //While there are remaining elements to shuffle...
  while(n){
    i=Math.floor(Math.random()*n);
    n--;

    //Swap with current item
    t=arr[n];
    arr[n]=arr[i];
    arr[i]=t;
  }
  return arr;

}

class Game{
  constructor(){
    this.playersGuess=null;
    this.pastGuesses=[];
    this.winningNumber=generateWinningNumber();
    this.direction=[];
    this.temperature=[];
  }
  difference(){
    return Math.abs(this.playersGuess-this.winningNumber);
  }
  isLower(){
    if(this.playersGuess<this.winningNumber){
      this.direction.push('&uarr;');
      return true;
    }else{
      this.direction.push('&darr;');
      return false;
    }
  }
  checkGuess(){
    if(this.playersGuess===this.winningNumber){
      this.pastGuesses.push(this.playersGuess);
      this.direction.push('-');
      this.temperature.push('win')
      return `You Win! The winning number was ${this.winningNumber}`;
    }

    if(this.pastGuesses.includes(this.playersGuess)){
      return 'You have already guessed that number.';
    }else if(this.pastGuesses.length>=4){
      this.pastGuesses.push(this.playersGuess);
      this.temperature.push('lose');
      this.direction.push('');
      return `You Lose. The winning number was ${this.winningNumber}`;
    }else{
      //run isLower to see which direction is needed
      this.isLower();
      this.pastGuesses.push(this.playersGuess);
    }

    let currentDifference=this.difference();
    // console.log(currentDifference)

    if(currentDifference<10){
      this.temperature.push('hot');
      return "You're burning up!";
    }else if(currentDifference<25){
      this.temperature.push('warm');
      return "You're lukewarm.";
    }else if(currentDifference<50){
      this.temperature.push('chilly');
      return "You\'re a bit chilly.";
    }else{
      this.temperature.push('cold');
      return "You\'re ice cold!"
    }
  }
  playersGuessSubmission(num){

    if(num>100|| num<1||isNaN(num)){
      return 'This is an invalid guess. Please guess a # between 0 & 100'
      // throw 'That is an invalid guess.'
    }
    this.playersGuess=num;
    return this.checkGuess(num);
  }
  provideHint(){
    // let num1=generateWinningNumber();
    // let num2=generateWinningNumber();
    //later check to make sure the random numbers aren't same or equal to winning number or any of the players guesses
    let hintArr=[this.winningNumber,generateWinningNumber(),generateWinningNumber()];

    let shuffleArr=shuffle(hintArr);
    return shuffleArr;

  }
}

const newGame=()=> new Game();



$(document).ready( function() {

  let game = newGame();
  console.log('No clue what this is for :$', game.winningNumber);

  //Submits guess and clears the input field when submit button is clicked!
  $('.submit-guess').on('click', function() {
      checkCurrentGuess();
  });

  //Submits guess if enter is keyed
  $('.guess-input').keypress(function() {
    if (event.which === 13) {
      checkCurrentGuess();
    }
  });

  //Reset game
  $('.reset-sign').on('click', function() {
    game=newGame();
    console.log('No clue what this is for :$', game.winningNumber);
    clearGameBoard();
  });

   //hints game
   $('.hint-sign').on('click', function() {
    let hints=game.provideHint();

    let message=document.getElementById('hint');
    message.innerHTML=`The number is either ${hints[0]}, ${hints[1]}, or ${hints[2]}.`;
    $(this).prop("disabled", true);
  });


  function checkCurrentGuess(){
    let input=document.querySelector('.guess-input');
    //must convert the string value to a number
    let userGuess=parseInt(input.value,10);

    //check input
    let response=game.playersGuessSubmission(userGuess);

    //update message to user based on guess
    let message=document.getElementById('hint');
    message.innerHTML=response;

    //clear input field once submit
    input.value='';
    updateGuesses();
  }


  function updateGuesses(){
    let numGuesses=game.pastGuesses.length;

    for(let i=0;i<numGuesses;i++){
      $(".innerguess")[i].innerHTML=game.pastGuesses[i];
      //updates arrows to guide guesses
      $('.direction')[i].innerHTML=game.direction[i];
      //updates border temperature based on how close guess is to winning num
      $('.guess')[i].className=`guess ${game.temperature[i]}`
    }
  }

  function clearGameBoard(){
    $(".innerguess").text('*')
    $('.direction').text(' ')
    $('.guess').removeClass('cold hot chilly warm win lose');
    $('.hint-sign').prop("disabled", false);

  }

});
