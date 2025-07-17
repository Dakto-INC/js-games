let score = 0;
let round = 1;
const totalRounds = 20;

function computerChooses() {
  const options = ['rock', 'paper', 'scissors'];
  return options[Math.floor(Math.random() * options.length)];
}

function whoWins(user, computer) {
  if (user === computer) return "tie";
  if (
    (user === 'rock' && computer === 'scissors') ||
    (user === 'paper' && computer === 'rock') ||
    (user === 'scissors' && computer === 'paper')
  ) return "win";
  return "lose";
}

function makeChoice(userChoice) {
  if (round > totalRounds) return;

  const computerChoice = computerChooses();
  const result = whoWins(userChoice, computerChoice);

  document.getElementById('computer-choice').textContent = `Computer chose: ${computerChoice}`;
  const resultText = document.getElementById('result');

  if (result === "win") {
    score++;
    resultText.textContent = "You win this round!";
  } else if (result === "lose") {
    resultText.textContent = "You lose this round.";
  } else {
    resultText.textContent = "It's a tie!";
  }

  document.getElementById('scoreboard').textContent = `Score: ${score}/${totalRounds}`;
  document.getElementById('round').textContent = `Round ${round} of ${totalRounds}`;

  round++;

  if (round > totalRounds) {
    setTimeout(endGame, 1500);
  } else {
    setTimeout(() => {
      document.getElementById('computer-choice').textContent = '';
      resultText.textContent = '';
      document.getElementById('round').textContent = `Round ${round} of ${totalRounds}`;
    }, 1500);
  }
}

function endGame() {
  document.getElementById('game').classList.add('hidden');
  document.getElementById('final-score').textContent = `Your final score: ${score}/${totalRounds}`;
  document.getElementById('final').classList.remove('hidden');
}
