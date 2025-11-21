// Clock & Greeting
function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  document.getElementById(
    "clock"
  ).textContent = `${hours}:${minutes}:${seconds}`;

  const hour = now.getHours();
  let greeting = "Chào bạn!";
  if (hour < 12) greeting = "Chào buổi sáng! ☀️";
  else if (hour < 18) greeting = "Chào buổi chiều! 🌤️";
  else greeting = "Chào buổi tối! 🌙";
  document.getElementById("greeting").textContent = greeting;
}
setInterval(updateClock, 1000);
updateClock();

// Particles
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
let particlesEnabled = true;

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;
    this.radius = Math.random() * 2 + 1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }

  draw() {
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

for (let i = 0; i < 50; i++) {
  particles.push(new Particle());
}

function animateParticles() {
  if (particlesEnabled) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();

// Controls
function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

function toggleParticles() {
  particlesEnabled = !particlesEnabled;
  if (!particlesEnabled) ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function emojiRain() {
  const emojis = ["😊", "❤️", "✨", "🌟", "🎉", "🎈", "🌈", "⭐"];
  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      const emoji = document.createElement("div");
      emoji.className = "emoji-drop";
      emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      emoji.style.left = Math.random() * 100 + "%";
      document.body.appendChild(emoji);
      setTimeout(() => emoji.remove(), 3000);
    }, i * 100);
  }
}

const backgrounds = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
];
let bgIndex = 0;
function changeBackground() {
  bgIndex = (bgIndex + 1) % backgrounds.length;
  document.body.style.background = backgrounds[bgIndex];
}

// Game Tabs
function switchGame(index) {
  document.querySelectorAll(".game-content").forEach((el, i) => {
    el.classList.toggle("active", i === index);
  });
  document.querySelectorAll(".tab-btn").forEach((btn, i) => {
    btn.classList.toggle("active", i === index);
  });
}

// RPS Game
function playRPS(player) {
  const choices = ["✊", "✋", "✌️"];
  const computer = choices[Math.floor(Math.random() * 3)];
  let result = "";

  if (player === computer) result = "Hòa!";
  else if (
    (player === "✊" && computer === "✌️") ||
    (player === "✋" && computer === "✊") ||
    (player === "✌️" && computer === "✋")
  )
    result = "Bạn thắng! 🎉";
  else result = "Máy thắng! 😢";

  document.getElementById(
    "rpsResult"
  ).innerHTML = `Bạn: ${player} | Máy: ${computer}<br>${result}`;
}

// Dice Game
const diceEmojis = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
function rollDice() {
  const result = Math.floor(Math.random() * 6) + 1;
  document.getElementById("diceDisplay").textContent = diceEmojis[result - 1];
  document.getElementById(
    "diceResult"
  ).textContent = `Bạn tung được: ${result}`;
}

// Memory Game
const memoryEmojis = ["🍎", "🍌", "🍇", "🍓", "🍊", "🍉", "🥝", "🍍"];
let memoryCards = [...memoryEmojis, ...memoryEmojis].sort(
  () => Math.random() - 0.5
);
let flipped = [];
let matched = 0;
let score = 0;

function initMemory() {
  const grid = document.getElementById("memoryGrid");
  grid.innerHTML = "";
  memoryCards.forEach((emoji, i) => {
    const card = document.createElement("button");
    card.className = "memory-card";
    card.dataset.index = i;
    card.dataset.emoji = emoji;
    card.textContent = "❓";
    card.onclick = () => flipCard(card);
    grid.appendChild(card);
  });
}

function flipCard(card) {
  if (flipped.length === 2 || card.classList.contains("flipped")) return;

  card.textContent = card.dataset.emoji;
  card.classList.add("flipped");
  flipped.push(card);

  if (flipped.length === 2) {
    setTimeout(() => {
      if (flipped[0].dataset.emoji === flipped[1].dataset.emoji) {
        matched += 2;
        score += 10;
        if (matched === memoryCards.length) {
          alert("Chúc mừng! Bạn đã thắng! 🎉");
          memoryCards = [...memoryEmojis, ...memoryEmojis].sort(
            () => Math.random() - 0.5
          );
          matched = 0;
          initMemory();
        }
      } else {
        flipped.forEach((c) => {
          c.textContent = "❓";
          c.classList.remove("flipped");
        });
      }
      flipped = [];
      document.getElementById("memoryScore").textContent = `Điểm: ${score}`;
    }, 800);
  }
}
initMemory();

// Snake Game
const snakeCanvas = document.getElementById("snakeCanvas");
const snakeCtx = snakeCanvas.getContext("2d");
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let dx = 0,
  dy = 0;
let snakeScore = 0;
let gameRunning = false;

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && dy === 0) {
    dx = 0;
    dy = -1;
  }
  if (e.key === "ArrowDown" && dy === 0) {
    dx = 0;
    dy = 1;
  }
  if (e.key === "ArrowLeft" && dx === 0) {
    dx = -1;
    dy = 0;
  }
  if (e.key === "ArrowRight" && dx === 0) {
    dx = 1;
    dy = 0;
  }
  if (!gameRunning) startSnake();
});

function startSnake() {
  gameRunning = true;
  snakeLoop();
}

function snakeLoop() {
  if (!gameRunning) return;

  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  if (
    head.x < 0 ||
    head.x >= 20 ||
    head.y < 0 ||
    head.y >= 20 ||
    snake.some((s) => s.x === head.x && s.y === head.y)
  ) {
    gameRunning = false;
    alert("Game Over! Điểm: " + snakeScore);
    snake = [{ x: 10, y: 10 }];
    dx = 0;
    dy = 0;
    snakeScore = 0;
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    snakeScore += 10;
    document.getElementById("snakeScore").textContent = "Điểm: " + snakeScore;
    food = {
      x: Math.floor(Math.random() * 20),
      y: Math.floor(Math.random() * 20),
    };
  } else {
    snake.pop();
  }

  snakeCtx.fillStyle = "rgba(0, 0, 0, 0.3)";
  snakeCtx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);

  snakeCtx.fillStyle = "#4ade80";
  snake.forEach((s) => {
    snakeCtx.fillRect(
      s.x * gridSize,
      s.y * gridSize,
      gridSize - 2,
      gridSize - 2
    );
  });

  snakeCtx.fillStyle = "#f87171";
  snakeCtx.fillRect(
    food.x * gridSize,
    food.y * gridSize,
    gridSize - 2,
    gridSize - 2
  );

  setTimeout(snakeLoop, 150);
}

// Music Player
const tracks = [
  "Lofi Chill Beats",
  "Peaceful Piano",
  "Ocean Waves",
  "Rain Sounds",
  "Forest Ambience",
];

const trackList = document.getElementById("trackList");
tracks.forEach((track, i) => {
  const item = document.createElement("div");
  item.className = "track-item";
  item.textContent = track;
  item.onclick = () => {
    document
      .querySelectorAll(".track-item")
      .forEach((t) => t.classList.remove("active"));
    item.classList.add("active");
  };
  trackList.appendChild(item);
});

// Quotes
const quotes = [
  "Cuộc sống là những gì xảy ra khi bạn đang bận lập kế hoạch. - John Lennon",
  "Hạnh phúc không phải là điều gì đó có sẵn. Nó đến từ chính hành động của bạn. - Dalai Lama",
  "Cách tốt nhất để dự đoán tương lai là tạo ra nó. - Peter Drucker",
  "Thành công là tổng của những nỗ lực nhỏ lặp đi lặp lại mỗi ngày. - Robert Collier",
  "Đừng đếm ngày, hãy làm cho ngày có ý nghĩa. - Muhammad Ali",
];

function updateQuote() {
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  document.getElementById("quoteBox").textContent = quote;
}
updateQuote();
setInterval(updateQuote, 10000);

// Resize handler
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
