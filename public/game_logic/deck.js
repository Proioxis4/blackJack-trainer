const SUITS = ["♠", "♣", "♥", "♦"]
const VALUES = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K"
]



export default class Shoe {
  constructor(numOfDecks, freshdeck = freshDeck()) { //this class generates a Shoe object with numOfDecks*52 cards.
    let arr = [];

    for (let i = 0; i < numOfDecks; i++) {

      arr = arr.concat(freshdeck)
    }
    this.cards = arr
  }

  get numberOfCards() {
    return this.cards.length
  }

  pop() {
    return this.cards.shift()
  }

  push(card) {
    this.cards.push(card)
  }

  shuffle() { //this function for every card-1 will take a random card inbetween and replace it with the card is currently checking returning a random deck.
    for (let i = this.numberOfCards - 1; i > 0; i--) {
      const newIndex = Math.floor(Math.random() * (i + 1))
      const temp = this.cards[newIndex]
      this.cards[newIndex] = this.cards[i];
      this.cards[i] = temp
    }
    return this.cards;
  }

}


class Card {
  constructor(suit, value) {
    this.suit = suit
    this.value = value
  }

  get color() {
    return this.suit === "♣" || this.suit === "♠" ? "black" : "red"
  }

  getHTML() {
    const cardDiv = document.createElement("div")
    cardDiv.innerText = this.suit
    cardDiv.classList.add("card", this.color)
    cardDiv.dataset.value = `${this.value} ${this.suit}`
    return cardDiv
  }

  getBlankHTML() {
    const cardDiv = document.createElement("div")
    //cardDiv.innerText = this.suit
    cardDiv.classList.add("blankcard")
    //cardDiv.dataset.value = `${this.value} ${this.suit}`
    return cardDiv
  }
}

function freshDeck() {
  return SUITS.flatMap(suit => { //here I use flatMap so I don't get an array for every suit which would result in 4 arrays of values. Instead I get a single array.
    return VALUES.map(value => {
      return new Card(suit, value) // creating an object Card with the constructor and I return it at every VALUES element with .map();
    })
  })
}



