const canvas = document.getElementById("background-shit");
const ctx = canvas.getContext("2d");

const startBtn = document.getElementById("start-btn");
const mainMenu = document.getElementById("main-menu");

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  speed: 5,
  dx: 5,
  dy: 5
};

const paddleWidth = 10, paddleHeight = 100;
const leftPaddle = {
  x: 10,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  dy: 6
};

const rightPaddle = {
  x: canvas.width - paddleWidth - 10,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  dy: 2 // slower AI for easier scoring
};

let leftScore = 0;
let rightScore = 0;

const keys = {};
document.addEventListener("keydown", (e) => keys[e.key] = true);
document.addEventListener("keyup", (e) => keys[e.key] = false);

function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, false);
  ctx.closePath();
  ctx.fill();
}

function drawText(text, x, y, color) {
  ctx.fillStyle = color;
  ctx.font = "35px Arial";
  ctx.fillText(text, x, y);
}

function movePaddles() {
  if (keys["w"] && leftPaddle.y > 0) leftPaddle.y -= leftPaddle.dy;
  if (keys["s"] && leftPaddle.y + leftPaddle.height < canvas.height) leftPaddle.y += leftPaddle.dy;
  if (!keys["ArrowUp"] && !keys["ArrowDown"]) {
    if (ball.y < rightPaddle.y + rightPaddle.height / 2) rightPaddle.y -= rightPaddle.dy;
    else if (ball.y > rightPaddle.y + rightPaddle.height / 2) rightPaddle.y += rightPaddle.dy;
  }
  if (rightPaddle.y < 0) rightPaddle.y = 0;
  if (rightPaddle.y + rightPaddle.height > canvas.height) rightPaddle.y = canvas.height - rightPaddle.height;
}

function collision(b, paddle) {
  return b.x - b.radius < paddle.x + paddle.width &&
         b.x + b.radius > paddle.x &&
         b.y - b.radius < paddle.y + paddle.height &&
         b.y + b.radius > paddle.y;
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.dx = -ball.dx;
  ball.speed = 5;
}

function update() {
  movePaddles();
  ball.x += ball.dx;
  ball.y += ball.dy;
  if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) ball.dy = -ball.dy;
  let paddle = (ball.x < canvas.width / 2) ? leftPaddle : rightPaddle;
  if (collision(ball, paddle)) {
    let collidePoint = (ball.y - (paddle.y + paddle.height / 2)) / (paddle.height / 2);
    let angleRad = collidePoint * (Math.PI / 4);
    let direction = (ball.x < canvas.width / 2) ? 1 : -1;
    ball.dx = direction * ball.speed * Math.cos(angleRad);
    ball.dy = ball.speed * Math.sin(angleRad);
    ball.speed += 0.3;
  }
  if (ball.x - ball.radius < 0) {
    rightScore++;
    resetBall();
  } else if (ball.x + ball.radius > canvas.width) {
    leftScore++;
    resetBall();
  }
}

function render() {
  drawRect(0, 0, canvas.width, canvas.height, "black");
  for (let i = 0; i < canvas.height; i += 20) drawRect(canvas.width / 2 - 1, i, 2, 10, "white");
  drawText(leftScore, canvas.width / 4, 50, "white");
  drawText(rightScore, 3 * canvas.width / 4, 50, "white");
  drawRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height, "white");
  drawRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height, "white");
  drawCircle(ball.x, ball.y, ball.radius, "white");
}

let gameInterval;

function game() {
  update();
  render();
}

startBtn.addEventListener("click", () => {
  mainMenu.style.display = "none";
  canvas.style.display = "block";
  gameInterval = setInterval(game, 1000 / 60);
});
