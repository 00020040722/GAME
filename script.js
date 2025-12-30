const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
const size = 400;

/* === 速度相關設定 === */
const BASE_SPEED = 140;   // 初始速度（數字越小越快）
const SPEED_STEP = 5;     // 每次加速幅度
const SPEED_SCORE = 3;    // 每幾分加速一次
const MIN_SPEED = 70;     // 最高速度限制

let snake, food, direction, game, score;
let running = false;
let flash = 0;

const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");

let highScore = localStorage.getItem("crtSnakeHigh") || 0;
highScoreEl.textContent = highScore;

/* 初始化 */
function init() {
  snake = [{ x: 200, y: 200 }];
  direction = "RIGHT";
  score = 0;
  scoreEl.textContent = score;
  food = randomFood();
  running = false;
  drawStart();
}

/* 食物 */
function randomFood() {
  return {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
  };
}

/* 開始畫面 */
function drawStart() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "#0ff";
  ctx.font = "14px 'Press Start 2P'";
  ctx.textAlign = "center";
  ctx.fillText("TAP / SPACE", 200, 190);
  ctx.fillText("TO START", 200, 220);
}

/* Game Over */
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

/* 計算當前速度 */
function getSpeed() {
  const level = Math.floor(score / SPEED_SCORE);
  return Math.max(
    BASE_SPEED - level * SPEED_STEP,
    MIN_SPEED
  );
}

/* 改方向 */
function setDir(dir) {
  if (dir === "UP" && direction !== "DOWN") direction = "UP";
  if (dir === "DOWN" && direction !== "UP") direction = "DOWN";
  if (dir === "LEFT" && direction !== "RIGHT") direction = "LEFT";
  if (dir === "RIGHT" && direction !== "LEFT") direction = "RIGHT";
}

/* 鍵盤 */
document.addEventListener("keydown", e => {
  if (e.code === "Space" && !running) {
    init();
    running = true;
    game = setInterval(draw, getSpeed());
  }

  if (e.key.startsWith("Arrow")) {
    setDir(e.key.replace("Arrow", "").toUpperCase());
  }
});

/* 觸控方向鍵 */
document.querySelectorAll(".controls button").forEach(btn => {
  btn.addEventListener("touchstart", e => {
    e.preventDefault();
    setDir(btn.dataset.dir);
  });
});

/* 點擊畫面開始 */
canvas.addEventListener("touchstart", () => {
  if (!running) {
    init();
    running = true;
    game = setInterval(draw, getSpeed());
  }
});

/* 主循環 */
function draw() {
  ctx.clearRect(0, 0, size, size);

  /* 吃到食物閃一下 */
  if (flash > 0) {
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fillRect(0, 0, size, size);
    flash--;
  }

  /* 蛇 */
  snake.forEach((s, i) => {
    ctx.fillStyle = i === 0 ? "#ffffff" : "#cfcfcf";
    ctx.fillRect(s.x, s.y, box, box);
  });

  /* 食物 */
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

  /* 穿牆 */
  if (head.x < 0) head.x = size - box;
  if (head.x >= size) head.x = 0;
  if (head.y < 0) head.y = size - box;
  if (head.y >= size) head.y = 0;

  /* 撞自己 */
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

    /* === 關鍵：動態更新速度 === */
    clearInterval(game);
    game = setInterval(draw, getSpeed());

  } else {
    snake.pop();
  }
}

/* 啟動 */
init();

