const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")

function resizeCanvas() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}
window.addEventListener("resize", resizeCanvas)
resizeCanvas()

let snake = []
let length = 1
let dx = 0
let dy = 0
let x = 100
let y = 100
let direction = null
let food = randomFood()
let gameOver = false
let paused = false
let playerName = ""
let highScore = getHighScore()

const titleScreen = document.getElementById("titleScreen")
const pauseScreen = document.getElementById("pauseScreen")
const touchControls = document.getElementById("touchControls")
const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0

if (isTouch) touchControls.classList.remove("hidden")

document.getElementById("playButton").onclick = () => {
  const nameInput = document.getElementById("playerName")
  if (nameInput.value.trim()) {
    playerName = nameInput.value.trim()
    titleScreen.classList.add("hidden")
    startGame()
  }
}

document.addEventListener("keydown", (e) => {
  if (!paused) {
    switch (e.key.toLowerCase()) {
      case "w":
      case "arrowup":
        if (direction !== "DOWN") { dx = 0; dy = -10; direction = "UP" }
        break
      case "s":
      case "arrowdown":
        if (direction !== "UP") { dx = 0; dy = 10; direction = "DOWN" }
        break
      case "a":
      case "arrowleft":
        if (direction !== "RIGHT") { dx = -10; dy = 0; direction = "LEFT" }
        break
      case "d":
      case "arrowright":
        if (direction !== "LEFT") { dx = 10; dy = 0; direction = "RIGHT" }
        break
      case "p":
      case "escape":
        togglePause()
        break
    }
  } else {
    if (e.key.toLowerCase() === "p" || e.key.toLowerCase() === "escape") togglePause()
    else if (e.key.toLowerCase() === "m") location.reload()
  }
})

if (isTouch) {
  touchControls.querySelectorAll(".touch-btn").forEach(btn => {
    btn.addEventListener("touchstart", () => {
      const dir = btn.getAttribute("data-dir")
      switch (dir) {
        case "UP":
          if (direction !== "DOWN") { dx = 0; dy = -7; direction = "UP" }
          break
        case "DOWN":
          if (direction !== "UP") { dx = 0; dy = 7; direction = "DOWN" }
          break
        case "LEFT":
          if (direction !== "RIGHT") { dx = -7; dy = 0; direction = "LEFT" }
          break
        case "RIGHT":
          if (direction !== "LEFT") { dx = 7; dy = 0; direction = "RIGHT" }
          break
      }
    })
  })
}

function togglePause() {
  paused = !paused
  pauseScreen.classList.toggle("hidden")
}

function startGame() {
  snake = []
  x = 100
  y = 100
  dx = dy = 0
  length = 1
  food = randomFood()
  gameOver = false
  direction = null
  requestAnimationFrame(gameLoop)
}

function gameLoop() {
  if (gameOver) return
  if (!paused) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    x += dx
    y += dy
    if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) return endGame()
    const head = { x, y }
    snake.push(head)
    if (snake.length > length) snake.shift()
    for (let i = 0; i < snake.length - 1; i++) {
      if (snake[i].x === x && snake[i].y === y) return endGame()
    }
    ctx.fillStyle = "red"
    ctx.fillRect(food.x, food.y, 10, 10)
    ctx.fillStyle = "lime"
    snake.forEach(seg => ctx.fillRect(seg.x, seg.y, 10, 10))
    ctx.fillStyle = "white"
    ctx.font = "20px comicsansms"
    ctx.fillText("Score: " + (length - 1), 10, 25)
    ctx.fillText("High Score: " + highScore, 10, 50)
    if (x === food.x && y === food.y) {
      length++
      if ((length - 1) > highScore) highScore = length - 1
      food = randomFood()
    }
  }
  setTimeout(() => requestAnimationFrame(gameLoop), isTouch ? 1000/10 : 1000/15)
}

function endGame() {
  gameOver = true
  saveScore(playerName, length - 1)
  setTimeout(() => {
    if (confirm("Game Over! Play Again (OK) or Main Menu (Cancel)?")) startGame()
    else location.reload()
  }, 100)
}

function randomFood() {
  const fx = Math.floor(Math.random() * (canvas.width / 10)) * 10
  const fy = Math.floor(Math.random() * (canvas.height / 10)) * 10
  return { x: fx, y: fy }
}

function saveScore(name, score) {
  fetch("https://games.daktoinc.co.uk/snake/api/scores", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, score, timestamp: Date.now() })
  })
  .then(res => res.json())
  .then(() => updateLeaderboard())
  .catch(err => console.error("Failed to save score", err))
}

function getHighScore() {
  fetch("https://games.daktoinc.co.uk/snake/api/scores")
    .then(res => res.json())
    .then(data => {
      if (data.length > 0) {
        highScore = Math.max(...data.map(s => s.score))
      }
    })
    .catch(err => console.error("Failed to fetch high score", err))
}

function updateLeaderboard() {
  fetch("https://games.daktoinc.co.uk/snake/api/scores")
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("leaderboardList")
      list.innerHTML = ""
      data.forEach(s => {
        const li = document.createElement("li")
        const date = new Date(s.timestamp)
        li.textContent = `${s.name} - ${s.score} (${date.toLocaleDateString()} ${date.toLocaleTimeString()})`
        list.appendChild(li)
      })
    })
    .catch(err => console.error("Failed to load leaderboard", err))
}

updateLeaderboard()
