let deck = [];
let playerHand = [];
let dealerHand = [];
let playerScore = 0;
let dealerScore = 0;
let showDealerHand = false;

function createDeck() {
  const suits = ['♠', '♥', '♦', '♣'];
  const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  deck = [];

  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value });
    }
  }

  // Shuffle
  deck.sort(() => Math.random() - 0.5);
}

function getCardValue(card) {
  if (['J', 'Q', 'K'].includes(card.value)) return 10;
  if (card.value === 'A') return 11;
  return parseInt(card.value);
}

function calculateScore(hand) {
  let score = 0;
  let aceCount = 0;

  for (let card of hand) {
    score += getCardValue(card);
    if (card.value === 'A') aceCount++;
  }

  while (score > 21 && aceCount > 0) {
    score -= 10;
    aceCount--;
  }

  return score;
}

function renderHand(hand, elementId, hideSecondCard = false) {
    const element = document.getElementById(elementId);
    element.innerHTML = '';
  
    hand.forEach((card, index) => {
      const cardDiv = document.createElement('div');
      cardDiv.classList.add('simple-card');
  
      if (hideSecondCard && index === 1) {
        cardDiv.textContent = '🂠'; // face-down card symbol
        cardDiv.classList.add('card-back');
      } else {
        const isRed = card.suit === '♥' || card.suit === '♦';
        cardDiv.style.color = isRed ? 'red' : 'black';
        cardDiv.textContent = `${card.value}${card.suit}`;
      }
  
      element.appendChild(cardDiv);
    });
  }
  
  

function startGame() {
  createDeck();
  playerHand = [deck.pop(), deck.pop()];
  dealerHand = [deck.pop(), deck.pop()];
  showDealerHand = false;

  updateScores();
  updateUI();
  document.getElementById('result').textContent = '';
}

function hit() {
  if (playerScore >= 21) return;
  playerHand.push(deck.pop());
  updateScores();
  updateUI();
  if (playerScore > 21) {
    document.getElementById('result').textContent = 'You busted!';
    showDealerHand = true;
    updateUI();
  }
}

function stand() {
  showDealerHand = true;

  while (dealerScore < 17) {
    dealerHand.push(deck.pop());
    dealerScore = calculateScore(dealerHand);
  }

  updateScores();
  updateUI();
  checkWinner();
}

function updateScores() {
  playerScore = calculateScore(playerHand);
  dealerScore = calculateScore(dealerHand);
}

function updateUI() {
  renderHand(playerHand, 'player-cards');
  renderHand(dealerHand, 'dealer-cards', !showDealerHand);
  document.getElementById('player-score').textContent = `Score: ${playerScore}`;
  document.getElementById('dealer-score').textContent = `Score: ${showDealerHand ? dealerScore : '??'}`;
}

function checkWinner() {
  let result = '';
  if (playerScore > 21) {
    result = 'You busted!';
  } else if (dealerScore > 21) {
    result = 'Dealer busted. You win!';
  } else if (playerScore > dealerScore) {
    result = 'You win!';
  } else if (dealerScore > playerScore) {
    result = 'Dealer wins.';
  } else {
    result = 'It\'s a tie!';
  }

  document.getElementById('result').textContent = result;
}

