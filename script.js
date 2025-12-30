const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
const size = 400;

let snake, food, direction, game, score;
let running = false;
let flash = 0;

const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");

let highScore = localStorage.getItem("crtSnakeHigh") || 0;
highScoreEl.textContent = highScore;

function init() {
  snake = [{ x: 200, y: 200 }];
  direction = "RIGHT";
  score = 0;
  scoreEl.textContent = score;
  food = randomFood();
  running = false;
  drawStart();
}

function randomFood() {
  return {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
  };
}

function drawStart() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "#0ff";
  ctx.font = "14px 'Press Start 2P'";
  ctx.textAlign = "center";
  ctx.fillText("TAP / SPACE", 200, 190);
  ctx.fillText("TO START", 200, 220);
}

function gameOver() {
  clearInterval(game);
  running = false;

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("crtSnakeHigh", highScore);
    highScoreEl.textContent = highScore;
  }

  ctx.fillStyle = "rgba(0,0,0,0.85)";
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "#fff";
  ctx.fillText("GAME OVER", 200, 210);
}

function setDir(dir) {
  if (dir === "UP" && direction !== "DOWN") direction = "UP";
  if (dir === "DOWN" && direction !== "UP") direction = "DOWN";
  if (dir === "LEFT" && direction !== "RIGHT") direction = "LEFT";
  if (dir === "RIGHT" && direction !== "LEFT") direction = "RIGHT";
}

document.addEventListener("keydown", e => {
  if (e.code === "Space" && !running) {
    init();
    running = true;
    game = setInterval(draw, 140);
  }
  if (e.key.startsWith("Arrow")) {
    setDir(e.key.replace("Arrow", "").toUpperCase());
  }
});

document.querySelectorAll(".controls button").forEach(btn => {
  btn.addEventListener("touchstart", e => {
    e.preventDefault();
    setDir(btn.dataset.dir);
  });
});

canvas.addEventListener("touchstart", () => {
  if (!running) {
    init();
    running = true;
    game = setInterval(draw, 140);
  }
});

function draw() {
  ctx.clearRect(0, 0, size, size);

  /* 吃到食物閃一下 */
  if (flash > 0) {
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fillRect(0, 0, size, size);
    flash--;
  }

  // 蛇（固定色）
  snake.forEach((s, i) => {
    ctx.fillStyle = i === 0 ? "#ffffff" : "#cfcfcf";
    ctx.fillRect(s.x, s.y, box, box);
  });

  // 食物（微發光）
  ctx.shadowColor = "#d62828";
  ctx.shadowBlur = 10;
  ctx.fillStyle = "#d62828";
  ctx.fillRect(food.x, food.y, box, box);
  ctx.shadowBlur = 0;

  let head = { ...snake[0] };

  if (direction === "UP") head.y -= box;
  if (direction === "DOWN") head.y += box;
  if (direction === "LEFT") head.x -= box;
  if (direction === "RIGHT") head.x += box;

  /* ===== 穿牆邏輯 ===== */
  if (head.x < 0) head.x = size - box;
  if (head.x >= size) head.x = 0;
  if (head.y < 0) head.y = size - box;
  if (head.y >= size) head.y = 0;

  /* 只撞自己才輸 */
  if (snake.some(s => s.x === head.x && s.y === head.y)) {
    gameOver();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreEl.textContent = score;
    flash = 6;
    food = randomFood();
  } else {
    snake.pop();
  }
}

init();
