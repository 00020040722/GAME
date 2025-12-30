const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
let snake, food, direction, game, score;
let running = false;
let hue = 0;

const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");

let highScore = localStorage.getItem("neoSnakeHigh") || 0;
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
  ctx.fillRect(0, 0, 400, 400);
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
    localStorage.setItem("neoSnakeHigh", highScore);
    highScoreEl.textContent = highScore;
  }

  ctx.fillStyle = "rgba(0,0,0,0.8)";
  ctx.fillRect(0, 0, 400, 400);
  ctx.fillStyle = "#f0f";
  ctx.fillText("GAME OVER", 200, 200);
}

function setDir(dir) {
  if (dir === "UP" && direction !== "DOWN") direction = "UP";
  if (dir === "DOWN" && direction !== "UP") direction = "DOWN";
  if (dir === "LEFT" && direction !== "RIGHT") direction = "LEFT";
  if (dir === "RIGHT" && direction !== "LEFT") direction = "RIGHT";
}

// 鍵盤
document.addEventListener("keydown", e => {
  if ((e.code === "Space") && !running) {
    init();
    running = true;
    game = setInterval(draw, 140);
  }
  if (e.key.startsWith("Arrow")) {
    setDir(e.key.replace("Arrow", "").toUpperCase());
  }
});

// 觸控鍵
document.querySelectorAll(".controls button").forEach(btn => {
  btn.addEventListener("touchstart", () => setDir(btn.dataset.dir));
});

// 點擊開始
canvas.addEventListener("touchstart", () => {
  if (!running) {
    init();
    running = true;
    game = setInterval(draw, 140);
  }
});

function draw() {
  ctx.clearRect(0, 0, 400, 400);

  // 幻彩蛇
  snake.forEach((s, i) => {
    ctx.fillStyle = `hsl(${(hue + i * 12) % 360}, 100%, 60%)`;
    ctx.fillRect(s.x, s.y, box, box);
  });

  // 幻彩食物
  ctx.fillStyle = `hsl(${(hue + 180) % 360}, 100%, 60%)`;
  ctx.fillRect(food.x, food.y, box, box);

  hue += 4;

  let head = { ...snake[0] };
  if (direction === "UP") head.y -= box;
  if (direction === "DOWN") head.y += box;
  if (direction === "LEFT") head.x -= box;
  if (direction === "RIGHT") head.x += box;

  if (
    head.x < 0 || head.y < 0 ||
    head.x >= 400 || head.y >= 400 ||
    snake.some(s => s.x === head.x && s.y === head.y)
  ) {
    gameOver();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreEl.textContent = score;
    food = randomFood();
  } else {
    snake.pop();
  }
}

init();

