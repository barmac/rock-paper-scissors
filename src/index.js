const mainElement = document.getElementById('main');
const navElement = document.getElementById('nav');

const COMPUTER_PLAYER = 'Computer';
const HUMAN_PLAYER = 'Player';

function startGame(firstPlayerName, secondPlayerName) {
  document.getElementById('first-player-name').innerText = firstPlayerName;
  document.getElementById('second-player-name').innerText = secondPlayerName;
}

document.querySelector('.nav-pvc')
  .addEventListener('click', () => startGame(HUMAN_PLAYER, COMPUTER_PLAYER));
document.querySelector('.nav-cvc')
  .addEventListener('click', () => startGame(COMPUTER_PLAYER, COMPUTER_PLAYER));
