const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const INITIAL_DROP_INTERVAL = 1000;
const MIN_DROP_INTERVAL = 100;
const LINES_PER_LEVEL = 10;

const NOTES = {
  'E5': 659.25,
  'B4': 493.88,
  'C5': 523.25,
  'D5': 587.33,
  'A4': 440.00,
  'G4': 392.00,
  'F5': 698.46,
  'A5': 880.00,
  'G5': 783.99,
  'REST': 0
};

const TETRIS_MELODY = [
  { note: 'E5', duration: 400 },
  { note: 'B4', duration: 200 },
  { note: 'C5', duration: 200 },
  { note: 'D5', duration: 400 },
  { note: 'C5', duration: 200 },
  { note: 'B4', duration: 200 },

  { note: 'A4', duration: 400 },
  { note: 'A4', duration: 200 },
  { note: 'C5', duration: 200 },
  { note: 'E5', duration: 400 },
  { note: 'D5', duration: 200 },
  { note: 'C5', duration: 200 },

  { note: 'B4', duration: 600 },
  { note: 'C5', duration: 200 },
  { note: 'D5', duration: 400 },
  { note: 'E5', duration: 400 },

  { note: 'C5', duration: 400 },
  { note: 'A4', duration: 400 },
  { note: 'A4', duration: 400 },
  { note: 'REST', duration: 400 }
];

const TETROMINOS = {
  I: {
    shape: [[1, 1, 1, 1]],
    color: '#00f0f0'
  },
  O: {
    shape: [[1, 1], [1, 1]],
    color: '#f0f000'
  },
  T: {
    shape: [[0, 1, 0], [1, 1, 1]],
    color: '#a000f0'
  },
  S: {
    shape: [[0, 1, 1], [1, 1, 0]],
    color: '#00f000'
  },
  Z: {
    shape: [[1, 1, 0], [0, 1, 1]],
    color: '#f00000'
  },
  L: {
    shape: [[1, 0, 0], [1, 1, 1]],
    color: '#f0a000'
  },
  J: {
    shape: [[0, 0, 1], [1, 1, 1]],
    color: '#0000f0'
  }
};

const canvas = document.getElementById('gameBoard');
const ctx = canvas.getContext('2d');
const nextCanvas = document.getElementById('nextPiece');
const nextCtx = nextCanvas.getContext('2d');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const startBtn = document.getElementById('startBtn');

let gameBoard = [];
let currentPiece = null;
let nextPiece = null;
let score = 0;
let level = 1;
let totalLinesCleared = 0;
let currentDropInterval = INITIAL_DROP_INTERVAL;
let gameOver = false;
let gameInterval = null;
let gameStarted = false;
let audioContext = null;
let isMuted = false;
let melodyTimeouts = [];

function init() {
  gameBoard = Array(ROWS).fill().map(() => Array(COLS).fill(0));
  score = 0;
  level = 1;
  totalLinesCleared = 0;
  currentDropInterval = INITIAL_DROP_INTERVAL;
  gameOver = false;
  gameStarted = true;
  scoreElement.textContent = score;
  levelElement.textContent = level;

  nextPiece = randomPiece();
  currentPiece = randomPiece();
  nextPiece = randomPiece();

  updateGameSpeed();

  initAudio();
  stopMelody();
  if (!isMuted) {
    playMelody();
  }

  startBtn.textContent = '재시작';
  draw();
  drawNextPiece();
}

function calculateDropInterval(level) {
  return Math.max(MIN_DROP_INTERVAL, INITIAL_DROP_INTERVAL - (level - 1) * 100);
}

function updateGameSpeed() {
  currentDropInterval = calculateDropInterval(level);

  if (gameInterval) {
    clearInterval(gameInterval);
  }

  gameInterval = setInterval(() => {
    if (!gameOver) {
      moveDown();
    }
  }, currentDropInterval);
}

function initAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playNote(frequency, duration) {
  if (isMuted || frequency === 0 || !audioContext) {
    return;
  }

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.type = 'square';
  oscillator.frequency.value = frequency;

  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration / 1000);
}

function playMelody() {
  if (gameOver || isMuted) {
    return;
  }

  stopMelody();

  let totalTime = 0;

  TETRIS_MELODY.forEach((item) => {
    const timeout = setTimeout(() => {
      playNote(NOTES[item.note], item.duration);
    }, totalTime);

    melodyTimeouts.push(timeout);
    totalTime += item.duration;
  });

  const loopTimeout = setTimeout(() => {
    playMelody();
  }, totalTime);

  melodyTimeouts.push(loopTimeout);
}

function stopMelody() {
  melodyTimeouts.forEach(timeout => clearTimeout(timeout));
  melodyTimeouts = [];
}

function toggleMute() {
  isMuted = !isMuted;
  const muteBtn = document.getElementById('muteBtn');

  if (isMuted) {
    stopMelody();
    muteBtn.textContent = '🔇';
  } else {
    muteBtn.textContent = '🔊';
    if (gameStarted && !gameOver) {
      playMelody();
    }
  }
}

function randomPiece() {
  const pieces = Object.keys(TETROMINOS);
  const randomType = pieces[Math.floor(Math.random() * pieces.length)];
  const piece = TETROMINOS[randomType];

  return {
    type: randomType,
    shape: piece.shape,
    color: piece.color,
    x: Math.floor(COLS / 2) - Math.floor(piece.shape[0].length / 2),
    y: 0
  };
}

function drawBlock3D(x, y, color) {
  const blockX = x * BLOCK_SIZE;
  const blockY = y * BLOCK_SIZE;
  const size = BLOCK_SIZE - 2;

  // 메인 블록 (그라데이션)
  const gradient = ctx.createLinearGradient(blockX, blockY, blockX + size, blockY + size);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, shadeColor(color, -30));
  ctx.fillStyle = gradient;
  ctx.fillRect(blockX + 1, blockY + 1, size, size);

  // 하이라이트 (왼쪽 상단)
  ctx.fillStyle = shadeColor(color, 40);
  ctx.fillRect(blockX + 1, blockY + 1, size, 3);
  ctx.fillRect(blockX + 1, blockY + 1, 3, size);

  // 그림자 (오른쪽 하단)
  ctx.fillStyle = shadeColor(color, -50);
  ctx.fillRect(blockX + size - 2, blockY + 1, 3, size);
  ctx.fillRect(blockX + 1, blockY + size - 2, size, 3);

  // 테두리
  ctx.strokeStyle = shadeColor(color, -60);
  ctx.lineWidth = 1;
  ctx.strokeRect(blockX + 1, blockY + 1, size, size);
}

function shadeColor(color, percent) {
  const num = parseInt(color.slice(1), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, Math.max(0, (num >> 16) + amt));
  const G = Math.min(255, Math.max(0, (num >> 8 & 0x00FF) + amt));
  const B = Math.min(255, Math.max(0, (num & 0x0000FF) + amt));
  return '#' + (0x1000000 + (R << 16) + (G << 8) + B).toString(16).slice(1);
}

function draw() {
  ctx.fillStyle = '#16213e';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 고정된 블록 그리기
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (gameBoard[y][x]) {
        drawBlock3D(x, y, gameBoard[y][x]);
      }
    }
  }

  // 현재 블록 그리기
  if (currentPiece) {
    for (let y = 0; y < currentPiece.shape.length; y++) {
      for (let x = 0; x < currentPiece.shape[y].length; x++) {
        if (currentPiece.shape[y][x]) {
          drawBlock3D(currentPiece.x + x, currentPiece.y + y, currentPiece.color);
        }
      }
    }
  }

  if (gameOver) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 36px "Malgun Gothic"';
    ctx.textAlign = 'center';
    ctx.fillText('게임 오버!', canvas.width / 2, canvas.height / 2);
  }
}

function drawNextBlock3D(x, y, color) {
  const size = BLOCK_SIZE - 2;

  // 메인 블록 (그라데이션)
  const gradient = nextCtx.createLinearGradient(x, y, x + size, y + size);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, shadeColor(color, -30));
  nextCtx.fillStyle = gradient;
  nextCtx.fillRect(x + 1, y + 1, size, size);

  // 하이라이트 (왼쪽 상단)
  nextCtx.fillStyle = shadeColor(color, 40);
  nextCtx.fillRect(x + 1, y + 1, size, 3);
  nextCtx.fillRect(x + 1, y + 1, 3, size);

  // 그림자 (오른쪽 하단)
  nextCtx.fillStyle = shadeColor(color, -50);
  nextCtx.fillRect(x + size - 2, y + 1, 3, size);
  nextCtx.fillRect(x + 1, y + size - 2, size, 3);

  // 테두리
  nextCtx.strokeStyle = shadeColor(color, -60);
  nextCtx.lineWidth = 1;
  nextCtx.strokeRect(x + 1, y + 1, size, size);
}

function drawNextPiece() {
  nextCtx.fillStyle = '#16213e';
  nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);

  if (nextPiece) {
    const offsetX = (nextCanvas.width - nextPiece.shape[0].length * BLOCK_SIZE) / 2;
    const offsetY = (nextCanvas.height - nextPiece.shape.length * BLOCK_SIZE) / 2;

    for (let y = 0; y < nextPiece.shape.length; y++) {
      for (let x = 0; x < nextPiece.shape[y].length; x++) {
        if (nextPiece.shape[y][x]) {
          drawNextBlock3D(
            offsetX + x * BLOCK_SIZE,
            offsetY + y * BLOCK_SIZE,
            nextPiece.color
          );
        }
      }
    }
  }
}

function isCollision(piece, offsetX = 0, offsetY = 0) {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const newX = piece.x + x + offsetX;
        const newY = piece.y + y + offsetY;

        if (newX < 0 || newX >= COLS || newY >= ROWS) {
          return true;
        }

        if (newY >= 0 && gameBoard[newY][newX]) {
          return true;
        }
      }
    }
  }
  return false;
}

function moveLeft() {
  if (!gameOver && currentPiece && !isCollision(currentPiece, -1, 0)) {
    currentPiece.x--;
    draw();
  }
}

function moveRight() {
  if (!gameOver && currentPiece && !isCollision(currentPiece, 1, 0)) {
    currentPiece.x++;
    draw();
  }
}

function moveDown() {
  if (!gameOver && currentPiece) {
    if (!isCollision(currentPiece, 0, 1)) {
      currentPiece.y++;
      draw();
    } else {
      lockPiece();
    }
  }
}

function rotate() {
  if (!gameOver && currentPiece) {
    const rotated = currentPiece.shape[0].map((_, i) =>
      currentPiece.shape.map(row => row[i]).reverse()
    );

    const rotatedPiece = { ...currentPiece, shape: rotated };

    if (!isCollision(rotatedPiece, 0, 0)) {
      currentPiece.shape = rotated;
      draw();
    }
  }
}

function lockPiece() {
  for (let y = 0; y < currentPiece.shape.length; y++) {
    for (let x = 0; x < currentPiece.shape[y].length; x++) {
      if (currentPiece.shape[y][x]) {
        const boardY = currentPiece.y + y;
        const boardX = currentPiece.x + x;

        if (boardY >= 0) {
          gameBoard[boardY][boardX] = currentPiece.color;
        }
      }
    }
  }

  clearLines();
  currentPiece = nextPiece;
  nextPiece = randomPiece();
  drawNextPiece();

  if (isCollision(currentPiece, 0, 0)) {
    gameOver = true;
    clearInterval(gameInterval);
    stopMelody();
  }

  draw();
}

function clearLines() {
  let linesCleared = 0;

  for (let y = ROWS - 1; y >= 0; y--) {
    if (gameBoard[y].every(cell => cell !== 0)) {
      gameBoard.splice(y, 1);
      gameBoard.unshift(Array(COLS).fill(0));
      linesCleared++;
      y++;
    }
  }

  if (linesCleared > 0) {
    const points = [0, 100, 300, 500, 800];
    score += points[linesCleared];
    scoreElement.textContent = score;

    totalLinesCleared += linesCleared;
    const newLevel = Math.floor(totalLinesCleared / LINES_PER_LEVEL) + 1;

    if (newLevel > level) {
      level = newLevel;
      levelElement.textContent = level;
      updateGameSpeed();
    }
  }
}

document.addEventListener('keydown', (e) => {
  if (!gameStarted) return;

  switch(e.key) {
    case 'ArrowLeft':
      e.preventDefault();
      moveLeft();
      break;
    case 'ArrowRight':
      e.preventDefault();
      moveRight();
      break;
    case 'ArrowDown':
      e.preventDefault();
      moveDown();
      break;
    case 'ArrowUp':
    case ' ':
      e.preventDefault();
      rotate();
      break;
  }
});

startBtn.addEventListener('click', () => {
  init();
});

const muteBtn = document.getElementById('muteBtn');
if (muteBtn) {
  muteBtn.addEventListener('click', () => {
    toggleMute();
  });
}

draw();
drawNextPiece();
