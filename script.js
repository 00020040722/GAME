const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
let snake, food, direction, game, score;
let running = false;

const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");

let highScore = localStorage.getItem("nesSnakeHigh") || 0;
highScoreEl.textContent = highScore;

// 初始化
function init() {
  snake = [{ x: 200, y: 200 }];
  direction = "RIGHT";
  score = 0;
  scoreEl.textContent = score;
  food = randomFood();
  running = false;
  drawStartScreen();
}

// 隨機食物
function randomFood() {
  return {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box,
  };
}

// 開始畫面
function drawStartScreen() {
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#ffffff";
  ctx.font = "14px 'Press Start 2P'";
  ctx.textAlign = "center";
  ctx.fillText("PRESS SPACE", 200, 190);
  ctx.fillText("TO START", 200, 220);
}

// Game Over
function gameOver() {
  clearInterval(game);
  running = false;

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("nesSnakeHigh", highScore);
    highScoreEl.textContent = highScore;
  }

  ctx.fillStyle = "rgba(0,0,0,0.85)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#ffffff";
  ctx.font = "14px 'Press Start 2P'";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER", 200, 190);
  ctx.fillText("PRESS SPACE", 200, 230);
}

// 控制
document.addEventListener("keydown", e => {
  if (e.code === "Space" && !running) {
    init();
    running = true;
    game = setInterval(draw, 150);
  }

  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

// 主循環
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 蛇
  snake.forEach((s, i) => {
    ctx.fillStyle = i === 0 ? "#ffffff" : "#bfbfbf";
    ctx.fillRect(s.x, s.y, box, box);
  });

  // 食物
  ctx.fillStyle = "#d62828";
  ctx.fillRect(food.x, food.y, box, box);

  let head = { ...snake[0] };

  if (direction === "UP") head.y -= box;
  if (direction === "DOWN") head.y += box;
  if (direction === "LEFT") head.x -= box;
  if (direction === "RIGHT") head.x += box;

  // 撞牆或自己
  if (
    head.x < 0 ||
    head.y < 0 ||
    head.x >= canvas.width ||
    head.y >= canvas.height ||
    snake.some(s => s.x === head.x && s.y === head.y)
  ) {
    gameOver();
    return;
  }

  snake.unshift(head);

  // 吃食物
  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreEl.textContent = score;
    food = randomFood();
  } else {
    snake.pop();
  }
}

// 啟動
init();
