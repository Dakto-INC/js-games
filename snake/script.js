const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;
const snakeBlock = 10;
let snakeSpeed = 15;
let snake = [];
let length = 1;
let dx = 0, dy = 0;
let x = width / 2, y = height / 2;
let direction = null;
let food = randomFood();
let gameOver = false;
let paused = false;
let playerName = "";
let highScore = getHighScore();
const titleScreen = document.getElementById("titleScreen");
const pauseScreen = document.getElementById("pauseScreen");
document.getElementById("playButton").onclick = () => {
  const nameInput = document.getElementById("playerName");
  if (nameInput.value.trim()) {
    playerName = nameInput.value.trim();
    titleScreen.classList.add("hidden");
    startGame();
  }
};
document.getElementById("quitButton").onclick = () => {
  window.close();
};
document.addEventListener("keydown", (e) => {
  if (!paused) {
    switch (e.key.toLowerCase()) {
      case "w": dx = 0; dy = -snakeBlock; direction = "UP"; break;
      case "s": dx = 0; dy = snakeBlock; direction = "DOWN"; break;
      case "a": dx = -snakeBlock; dy = 0; direction = "LEFT"; break;
      case "d": dx = snakeBlock; dy = 0; direction = "RIGHT"; break;
      case "p": togglePause(); break;
    }
  } else {
    if (e.key.toLowerCase() === "p") togglePause();
    else if (e.key.toLowerCase() === "m") location.reload();
  }
});
function togglePause() {
  paused = !paused;
  pauseScreen.classList.toggle("hidden");
}
function startGame() {
  snake = [];
  x = width / 2;
  y = height / 2;
  dx = dy = 0;
  length = 1;
  food = randomFood();
  gameOver = false;
  direction = null;
  requestAnimationFrame(gameLoop);
}
function gameLoop() {
  if (gameOver) return gameOverScreen();
  if (!paused) {
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(document.createElement('img'), 0, 0); // Background (can preload if needed)
    x += dx;
    y += dy;
    if (x < 0 || y < 0 || x >= width || y >= height) {
      return endGame();
    }
    let head = { x, y };
    snake.push(head);
    if (snake.length > length) snake.shift();
    for (let i = 0; i < snake.length - 1; i++) {
      if (snake[i].x === x && snake[i].y === y) return endGame();
    }
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, snakeBlock, snakeBlock);
    ctx.fillStyle = "lime";
    snake.forEach(seg => ctx.fillRect(seg.x, seg.y, snakeBlock, snakeBlock));
    ctx.fillStyle = "white";
    ctx.font = "20px comicsansms";
    ctx.fillText("Score: " + (length - 1), 10, 25);
    ctx.fillText("High Score: " + highScore, 10, 50);
    if (x === food.x && y === food.y) {
      length++;
      if ((length - 1) > highScore) {
        highScore = length - 1;
      }
      food = randomFood();
      saveScore(playerName, length - 1);
    }
  }
  setTimeout(() => requestAnimationFrame(gameLoop), 1000 / snakeSpeed);
}
function endGame() {
  gameOver = true;
  setTimeout(() => {
    if (confirm("Game Over!\nPlay Again (OK) or Quit (Cancel)?")) {
      startGame();
    } else {
      location.reload();
    }
  }, 100);
}
function randomFood() {
  const fx = Math.floor(Math.random() * (width / snakeBlock)) * snakeBlock;
  const fy = Math.floor(Math.random() * (height / snakeBlock)) * snakeBlock;
  return { x: fx, y: fy };
}
function saveScore(name, score) {
  let scores = JSON.parse(localStorage.getItem("snakeScores")) || [];
  scores.push({ name, score, timestamp: Date.now() });
  scores.sort((a, b) => b.score - a.score || a.timestamp - b.timestamp);
  localStorage.setItem("snakeScores", JSON.stringify(scores.slice(0, 5)));
  updateLeaderboard();
}
function getHighScore() {
  const scores = JSON.parse(localStorage.getItem("snakeScores")) || [];
  return scores.length ? scores[0].score : 0;
}
function updateLeaderboard() {
  const list = document.getElementById("leaderboardList");
  const scores = JSON.parse(localStorage.getItem("snakeScores")) || [];
  list.innerHTML = "";
  scores.slice(0, 5).forEach((s, i) => {
    const li = document.createElement("li");
    li.textContent = `${i + 1}. ${s.name} - ${s.score}`;
    list.appendChild(li);
  });
}
updateLeaderboard();
