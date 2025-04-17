const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let keys = {};
document.addEventListener('keydown', (e) => keys[e.key] = true);
document.addEventListener('keyup', (e) => keys[e.key] = false);

const player = { x: 50, y: 50, w: 30, h: 30, color: 'red', speed: 3 };

const levels = [
  {
    obstacles: [
      { x: 100, y: 150, w: 400, h: 20 },
      { x: 300, y: 250, w: 20, h: 100 }
    ],
    coins: [
      { x: 500, y: 50, collected: false },
      { x: 50, y: 300, collected: false }
    ]
  },
  {
    obstacles: [
      { x: 200, y: 100, w: 200, h: 20 },
      { x: 200, y: 200, w: 20, h: 100 },
      { x: 400, y: 200, w: 20, h: 100 }
    ],
    coins: [
      { x: 50, y: 50, collected: false },
      { x: 550, y: 350, collected: false },
      { x: 300, y: 180, collected: false }
    ]
  },
  {
    obstacles: [
      { x: 100, y: 80, w: 400, h: 20 },
      { x: 100, y: 80, w: 20, h: 200 },
      { x: 480, y: 80, w: 20, h: 200 },
      { x: 200, y: 200, w: 200, h: 20 },
      { x: 300, y: 300, w: 20, h: 60 }
    ],
    coins: [
      { x: 120, y: 100, collected: false },
      { x: 460, y: 100, collected: false },
      { x: 120, y: 340, collected: false },
      { x: 460, y: 340, collected: false },
      { x: 305, y: 280, collected: false }
    ]
  }
];

let currentLevel = 0;

const coinSound = new Audio('coin.ogg');

function rectsCollide(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

function drawRect(obj) {
  ctx.fillStyle = obj.color || 'white';
  ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
}

function update() {
  const level = levels[currentLevel];

  if (keys['ArrowUp'] || keys['w'] || keys['W']) player.y -= player.speed;
  if (keys['ArrowDown'] || keys['s'] || keys['S']) player.y += player.speed;
  if (keys['ArrowLeft'] || keys['a'] || keys['A']) player.x -= player.speed;
  if (keys['ArrowRight'] || keys['d'] || keys['D']) player.x += player.speed;

  for (let obs of level.obstacles) {
    if (rectsCollide(player, obs)) {
      if (keys['ArrowUp'] || keys['w'] || keys['W']) player.y += player.speed;
      if (keys['ArrowDown'] || keys['s'] || keys['S']) player.y -= player.speed;
      if (keys['ArrowLeft'] || keys['a'] || keys['A']) player.x += player.speed;
      if (keys['ArrowRight'] || keys['d'] || keys['D']) player.x -= player.speed;
    }
  }

  if (player.x < 0) player.x = 0;
  if (player.y < 0) player.y = 0;
  if (player.x + player.w > canvas.width) player.x = canvas.width - player.w;
  if (player.y + player.h > canvas.height) player.y = canvas.height - player.h;

  for (let coin of level.coins) {
    if (!coin.collected) {
      if (
        player.x < coin.x + 15 &&
        player.x + player.w > coin.x &&
        player.y < coin.y + 15 &&
        player.y + player.h > coin.y
      ) {
        coin.collected = true;
        coinSound.currentTime = 0;
        coinSound.play();
      }
    }
  }

  const allCollected = level.coins.every(coin => coin.collected);
  if (allCollected) {
    if (currentLevel < levels.length - 1) {
      currentLevel++;
      resetLevel();
    } else {
      alert('🎉 ¡Felicitaciones Francesco Riva!');
      currentLevel = 0;
      resetLevel();
    }
  }
}

function resetLevel() {
  player.x = 50;
  player.y = 50;
  levels[currentLevel].coins.forEach(coin => coin.collected = false);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawRect(player);

  const level = levels[currentLevel];
  for (let obs of level.obstacles) {
    drawRect({ ...obs, color: 'gray' });
  }

  for (let coin of level.coins) {
    if (!coin.collected) {
      ctx.fillStyle = 'gold';
      ctx.beginPath();
      ctx.arc(coin.x + 7.5, coin.y + 7.5, 7.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }


  ctx.font = "16px Arial";
  ctx.fillStyle = 'white';
  ctx.textAlign = "left";
  ctx.fillText(`Nivel ${currentLevel + 1}`, 10, 20);

  ctx.textAlign = "center";
  ctx.fillText("Francesco Riva", canvas.width / 2, canvas.height - 10);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

resetLevel();
gameLoop();