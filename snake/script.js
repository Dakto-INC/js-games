const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

let snake = [];
let length = 1;
let dx = 0, dy = 0;
let x = 100, y = 100;
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
      case "w": if (direction !== "DOWN")  { dx = 0; dy = -10; direction = "UP"; } break;
      case "s": if (direction !== "UP")    { dx = 0; dy = 10;  direction = "DOWN"; } break;
      case "a": if (direction !== "RIGHT") { dx = -10; dy = 0; direction = "LEFT"; } break;
      case "d": if (direction !== "LEFT")  { dx = 10; dy = 0;  direction = "RIGHT"; } break;
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
  x = 100;
  y = 100;
  dx = dy = 0;
  length = 1;
  food = randomFood();
  gameOver = false;
  direction = null;
  requestAnimationFrame(gameLoop);
}

function gameLoop() {
  if (gameOver) return;

  if (!paused) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    x += dx;
    y += dy;

    if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) {
      return endGame();
    }

    const head = { x, y };
    snake.push(head);
    if (snake.length > length) snake.shift();

    for (let i = 0; i < snake.length - 1; i++) {
      if (snake[i].x === x && snake[i].y === y) return endGame();
    }

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, 10, 10);

    ctx.fillStyle = "lime";
    snake.forEach(seg => ctx.fillRect(seg.x, seg.y, 10, 10));

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

  setTimeout(() => requestAnimationFrame(gameLoop), 1000 / 15);
}

function endGame() {
  gameOver = true;
  setTimeout(() => {
    if (confirm("Game Over! Play Again (OK) or Quit (Cancel)?")) {
      startGame();
    } else {
      location.reload();
    }
  }, 100);
}

function randomFood() {
  const fx = Math.floor(Math.random() * (canvas.width / 10)) * 10;
  const fy = Math.floor(Math.random() * (canvas.height / 10)) * 10;
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
