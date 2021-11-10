import Shoe from "./deck.js"
import {basicStrategy} from './basic-strategy.js';
/*ROBA DA IMPLEMENTARE
risolvere il problema soft Ace ma credo sarà una cosa finale  --- fatto!

risolvere la carta che deve rimanere coperta per il banco all inizio --- fatto!

aggiungere tutti gli altri bottoni situazionali (double split surrender) e aggiungere la cosa di disabilitare quando si passa
da un round ad un altro o in certe situazioni

aggiungere una sorta di "vuoi continuare a giocare?" e "vuoi iniziare a giocare"

aggiungere il testo al centro con scritto vinto perso push etc --- fatto!

aggiungere un bankroll --- fatto!

migliorare la grafica quindi background etc magari aggiungendo pure un menu

aggiungere un algoritmo che calcola la play migliore e se il player l ha effettivamente fatta.

creare una classe Bankroll così da rendere tutto più ordinato

cambiare i nomi delle funzioni che non sono indicativi pe un cazzo!!1


DA FARE LA PROSSIMA SESSIONE::: ELIMINARE TUTTO QUEL BOILER CODE TIPO FLIPCOMPUTERCARD E CREARE UN UNICA FUNZIONE FLIPCARD E USARLA IN MANIERA
PORTABLE

DA FARE DOIPO sostituire i .pop() con un indice che multiplicative inverses tipo [array.length - index] per migliorare il cleanBeforeRound()

FIXARE IL FATTO CHE SE CLICCO DUE O PIù VOLTE SPLIT AL TURNO DOPO RIMANGONO DUE BOARD


*/


const CARD_VALUE_MAP = {
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  "10": 10,
  J: 10,
  Q: 10,
  K: 10,
  A: 11 
}

const computerCardSlot = document.querySelector(".computer-card-slot")
const playerCardSlot = document.querySelector(".player-card-slot")
const computerDeckElement = document.querySelector(".deck")
const text = document.querySelector(".text")
const textRightPlay = document.querySelector(".right")
const textWrongPlay = document.querySelector(".wrong")
const btnHit = document.querySelector("#btnHit")
const btnStand = document.querySelector("#btnStand")
const btnDouble = document.querySelector("#btn-double")
const btnSplit = document.querySelector("#btn-split")
//const btnPlay = document.querySelector(".btn-play")
const bankroll = document.querySelector(".bankroll")
const playercount = document.querySelector(".player-count")
const computercount = document.querySelector(".computer-count")
const playerContainer = document.querySelector(".player-container")
const decks = document.querySelector('#decks-number');
const money = document.querySelector('#money');



// const splitPlayerSlot = document.querySelector(".player-split-slot")


const timebetweenrounds=2000;
let computerDeck, computerCard, playerCard, computerFirstCard, computerFirstCardDOM = null, isPlayerAceDealt,isComputerAceDealt,
isDoubleOn,isSplitOn,isCleanSplittedRound,isSplitHandlerClicked;
let currentCardCount,currentCardSlot;


let playerValue = 0, computerValue = 0, playerBankroll = money.dataset.money, bet = 10,prevCard, nextCard, splitIndex=0;

var playerBoards=[],playerCounts=[],playerValues=[]; //array of boards -- to use in case of splits


//counter for basic strategy tracking
let rightPlay=0,wrongPlay=0,flippedComputerCard=0;
textRightPlay.innerText=rightPlay;
textWrongPlay.innerText=wrongPlay;


computerDeck = new Shoe(decks.dataset.deck); //creating the deck
computerDeck.shuffle();



btnHit.addEventListener('click', hitHandler);
btnStand.addEventListener('click', standHandler);
btnDouble.addEventListener('click', doubleHandler);
btnSplit.addEventListener('click',splitHandler);
/* btnPlay.addEventListener('click',(event)=>{
  clearTimeout(t1);
  btnPlay.disabled=true
}); */

function startGame() {
  

  playerBankroll -= bet; //setting up the bet da rifa!!
  bankroll.innerText = "Your money: " + playerBankroll;
  
  //starting the round
  setupRound()

  enableAllButtons();
  
 


  console.log(computerDeck);


}

function cleanBeforeRound() {
  console.log("isCleanSplittedRound:"+isCleanSplittedRound);
  if(isCleanSplittedRound){
    for(var i=0;i<playerValues.length;i++){
      playerContainer.removeChild(playerBoards.pop())
      playerCounts.pop();
      playerValues.pop();
    }
  }
  isCleanSplittedRound=false;

  // playerValues.splice(0,PlayerValues.length)
  // playerCounts.splice(0,playerCounts.length)
  
  playerCounts.pop();
  playerBoards.pop();
  playerValues.pop();
  console.log("pòlaercounts lenght"+playerCounts.length);
  computerCardSlot.innerHTML = ""
  playerCardSlot.innerHTML = ""
  text.innerText = ""


}

/************************  EVENT HANDLERS *****************************/

function hitHandler(event) {

  basicStrategy(playerValue,flippedComputerCard,isPlayerAceDealt,isSplitOn)==='H' ? incrementRightPlay() : incrementWrongPlay();
  flipPlayerCard();
  //setTimeout(() => { flipPlayerCard(); },500);

}

function standHandler(event) {

  basicStrategy(playerValue,flippedComputerCard,isPlayerAceDealt,isSplitOn)==='S' ? incrementRightPlay() : incrementWrongPlay();

  if(!isSplitOn){
    startComputerRound();
  }else{
    if(playerBoards.length-splitIndex==1 && !isSplitHandlerClicked){
      isSplitOn=false;startComputerRound();return;
    }
    playerValues[splitIndex]=playerValue; //setting the ith plaver value.

    splitIndex++;
    console.log("dove dovrebbe sta l erorre: "+ splitIndex);
    currentCardSlot=playerBoards[playerBoards.length-splitIndex-1] 
    
    currentCardCount=playerCounts[playerCounts.length-splitIndex-1] 
    
    playerValue=playerValues[playerValues.length-splitIndex-1]
    flipPlayerCard();
    //setTimeout(() => { flipPlayerCard(); },500);

    //checking if it's the last board
    if(playerBoards.length-splitIndex==1){isSplitOn=false;isCleanSplittedRound=true;}
  }
}

function doubleHandler(event){

  basicStrategy(playerValue,flippedComputerCard,isPlayerAceDealt,isSplitOn)==='D' ? incrementRightPlay() : incrementWrongPlay();

  isDoubleOn=true;
  playerBankroll-=bet;
  flipPlayerCard();
  //setTimeout(() => { flipPlayerCard(); },500);
  
}

function splitHandler(event) { 

  basicStrategy(playerValue,flippedComputerCard,isPlayerAceDealt,isSplitOn)==='P' ? incrementRightPlay() : incrementWrongPlay();

  isSplitHandlerClicked=true;
  // creating the DOM elements for the other slot 
  //the most important elements are the slot: CURRENTCARDSLOT and CURRENTCARDCOUNT, both of them linked below the board element
  let board = document.createElement("div"); //board element
  board.className+="player-boar";
  let count = document.createElement("div"); //count
  count.className+="player-count";count.className+="text-generic";
  board.appendChild(count);
  board.appendChild(nextCard.playerCardDOM) 
  playerContainer.appendChild(board);

  
  playerValue=CARD_VALUE_MAP[nextCard.cardToReturn];
  playerValues[splitIndex]=playerValue;
  playerValues.push(playerValue);

  currentCardCount.innerText=playerValue;

  currentCardSlot=board; //current card slot
  playerBoards.push(currentCardSlot);
  
  currentCardCount=count;
  playerCounts.push(currentCardCount);
  

  nextCard=flipPlayerCard();
  //setTimeout(() => {nextCard=flipPlayerCard(); },500);

  if(nextCard.cardToReturn!=prevCard.cardToReturn){btnSplit.disabled=true;console.log("button disableD!!!")}
  //now we have 2 cards and we begin to play.
  

}

//pops a card from the deck and adds it into the specified div slot
function flipPlayerCard() {
  playerCard = computerDeck.pop();

  let playerCardDOM=currentCardSlot.appendChild(playerCard.getHTML());
  playerValue += CARD_VALUE_MAP[playerCard.value];
  if(CARD_VALUE_MAP[playerCard.value]==11){ isPlayerAceDealt=true }

  if(isPlayerAceDealt && playerValue>21) { playerValue-=10;isPlayerAceDealt=false;}
  updateDeckCount();
  currentCardCount.innerText=playerValue;

  //checking if the player can still hit
  if (playerValue > 21) {

    if(isSplitOn){
      //we reach this point if we bust after we have split.
      console.log("player busted after splitting!!");

      //console.log("splitIndex: "+splitIndex + " e anche playerValue: "[])
      playerValues[splitIndex]=-1; //setting the ith value to -1 so that I can calculate the winning boards at the end.

      //checking if it's the last board
      if(playerBoards.length-splitIndex==1){isSplitOn=false;isCleanSplittedRound=true; startComputerRound();return;} //lazy implementation, it would be
      //better if the computer checks if all the boards are busted, if so he doesn't start his turn, instead he should go next round.
      
      splitIndex++;
      
      currentCardSlot=playerBoards[playerBoards.length-splitIndex-1] 
      currentCardCount=playerCounts[playerCounts.length-splitIndex-1]
      playerValue=playerValues[playerValues.length-splitIndex-1]

      flipPlayerCard();
      //setTimeout(() => {flipPlayerCard(); },500);

      
    }

    //if player straight bursts.
    disableAllButtons();
    revealBlankedComputerCard();
    console.log("player busted!!");
    text.innerText += "Player Busted, you lose!"
    setTimeout(() => { startGame(); },timebetweenrounds);
    return;
  }

  if(isDoubleOn)
  startComputerRound();

  let cardToReturn =playerCard.value;
  return {cardToReturn, playerCardDOM};
}




function flipComputerCard() {
  computerCard = computerDeck.pop();
  computerCardSlot.appendChild(computerCard.getHTML());
  //computerValue += CARD_VALUE_MAP[computerCard.value];
  computerValue += CARD_VALUE_MAP[computerCard.value];
  flippedComputerCard = CARD_VALUE_MAP[computerCard.value];
  if(CARD_VALUE_MAP[computerCard.value]==11){ isComputerAceDealt=true }

  if(isComputerAceDealt && computerValue>21) { computerValue-=10;isComputerAceDealt=false;}
  updateDeckCount();
  computercount.innerText=computerValue;
}


function flipComputerFirstCard() {
  computerFirstCard = computerDeck.pop(); //saving the first card
  computerFirstCardDOM = computerCardSlot.appendChild(computerFirstCard.getBlankHTML()); //adding the first flipped card
  computerValue += CARD_VALUE_MAP[computerFirstCard.value];
  if(CARD_VALUE_MAP[computerFirstCard.value]==11){ isComputerAceDealt=true }

  if(isComputerAceDealt && computerValue>21) { computerValue-=10;isComputerAceDealt=false;}
  updateDeckCount();

  computercount.innerText=computerValue;
}

function updateDeckCount() {
  computerDeckElement.innerText = computerDeck.numberOfCards

}

function setupRound() {

  //play another hand block
  cleanBeforeRound();

  //setting up the buttons variables
  isSplitHandlerClicked=false;
  isComputerAceDealt=false;
  isPlayerAceDealt=false;
  isDoubleOn=false;
  isSplitOn=false;
  splitIndex=0;

  currentCardSlot=playerCardSlot; // I assign the current card slot
  currentCardCount=playercount;
  playerBoards.push(currentCardSlot); //add the slot to the array
  playerCounts.push(currentCardCount);
  playerValue=0; computerValue=0;
  
  
    
  
  

  flipComputerFirstCard();
  //setTimeout(() => {flipComputerFirstCard(); },500);

  flipComputerCard();

  //setTimeout(() => {flipComputerCard(); },500);
  
  prevCard=flipPlayerCard();
  //setTimeout(() => {prevCard=flipPlayerCard(); },500);
  
  nextCard=flipPlayerCard();
  //setTimeout(() => {nextCard=flipPlayerCard(); },500);
  computercount.innerText = CARD_VALUE_MAP[computerCard.value]

  playerValues.push(playerValue);

  //checking if the cards are the same, if it's true set the current count to half 
  if(prevCard.cardToReturn==nextCard.cardToReturn){/* currentCardCount.innerText=playerValue/2; */ isSplitOn=true;} 

  if(playerValue==21){
    console.log("you iwn!!");
    text.innerText += "Player wins!"
    
    setTimeout(() => {  playerBankroll+=bet+(bet*1.5); startGame(); },timebetweenrounds); 
    return;
  }
}



//it starts the computer round so all the checking and hitting if the computer is below 17
function startComputerRound() {

  //tuning over the blank card 
  revealBlankedComputerCard();
  computercount.innerText = computerValue;

  while (computerValue < 17) { //it reaches this point only if the player is standing 

    flipComputerCard();
    console.log("computervalue : "+computerValue);
  }
  if (computerValue > 21) { 
    console.log("computer Busted, player wins!");
    text.innerText += "Computer Busted! "
    computerValue=0;
    // if(isCleanSplittedRound){ setTimeout(() => { playerBankroll+=bet*splitIndex; startGame(); },timebetweenrounds); return; }
    // setTimeout(() => { playerBankroll+=bet*2; startGame(); },timebetweenrounds);
    // return;
  }
  checkWinner();

}

function revealBlankedComputerCard() {
  computerFirstCardDOM.innerText = computerFirstCard.suit;
  computerFirstCardDOM.classList.replace("blankcard", "card");
  computerFirstCardDOM.dataset.value = `${computerFirstCard.value} ${computerFirstCard.suit}`
}

function checkWinner() {

  //if i reach this point it means it is the computer's turn.
  disableAllButtons();

  //managing the bets of every board in case we used Split.
  console.log(isCleanSplittedRound+" se è true prima di sbustare")
  if(isCleanSplittedRound){
    for(var i=0;i<playerValues.length;i++){
    
      if (computerValue > playerValues[i]) {
        console.log(i+"th board: computer wins!");
        //text.innerText += "Computer wins!"

        playerBankroll-= bet;
        
      } else if (computerValue < playerValues[i]) {
        console.log(i+"th board: player wins!");
        //text.innerText += "Player wins!"
        playerBankroll+=bet*2
       
      }else { //push
        console.log(i+"th pushes");
        //text.innerText += "Push."
        playerBankroll+=bet;
      }
    }

    setTimeout(() => { startGame(); },timebetweenrounds);
    return;
  }

  if (computerValue > playerValue) {
    console.log("computer wins!");
    text.innerText += "Computer wins!"
    setTimeout(() => { startGame(); },timebetweenrounds);
    return;
  } else if (computerValue < playerValue) {
    console.log("player wins!");
    text.innerText += "Player wins!"
    playerBankroll+= isDoubleOn==true ? bet*4 : bet*2
    setTimeout(() => { startGame(); },timebetweenrounds);
    return;
  }
  else { //push
    console.log("push");
    text.innerText += "Push."
    setTimeout(() => { playerBankroll+=bet;startGame(); },timebetweenrounds);
    return;
  }

}

function disableAllButtons() {
  btnHit.disabled = true;
  btnStand.disabled = true;
  btnDouble.disabled= true;
  btnSplit.disabled=true
}

function enableAllButtons() {
  btnHit.disabled = false;
  btnStand.disabled = false;
  btnDouble.disabled= false;
  isSplitOn ? btnSplit.disabled=false : btnSplit.disabled=true;
}

function incrementRightPlay(){
  rightPlay++;
  textRightPlay.innerText=rightPlay;
}

function incrementWrongPlay(){
  wrongPlay++;
  textWrongPlay.innerText=wrongPlay;
}

startGame()