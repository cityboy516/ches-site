let map = [], ROWS, COLS, TOTAL_COINS, TOTAL_KEYS;
let currentLevel = 0;
let lives = 3;
let gameOver = false;
let enemies = [];

const player = {
  x: 46, y: 46,
  w: 28, h: 28,
  speed: 3,
  facing: 'right',
  coins: 0,
  keys: 0,
  won: false,
};

function countTiles(val) {
  let total = 0;
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      if (map[r][c] === val) total++;
  return total;
}

function loadLevel(n) {
  currentLevel = n;
  // Deep-copy map so collected coins / opened exits don't persist across respawns
  map = levels[n].map.map(row => [...row]);
  ROWS = map.length;
  COLS = map[0].length;
  TOTAL_COINS = levels[n].totalCoins;
  TOTAL_KEYS = countTiles(6);

  // Reset player
  player.x = levels[n].playerStart.x;
  player.y = levels[n].playerStart.y;
  player.coins = 0;
  player.keys = 0;
  player.won = false;
  player.facing = 'right';

  // Reset enemies — shallow spread is safe: path array is read-only, only pathIndex/facing change
  enemies = (levels[n].enemies || []).map(e => ({ ...e, pathIndex: 0, facing: 'right', mode: 'patrol' }));

  // Update HUD
  document.getElementById('levelTitle').textContent = 'LEVEL ' + (n + 1) + ' — ' + levels[n].name;
  document.getElementById('coinCount').textContent = '0';
  document.getElementById('coinTotal').textContent = TOTAL_COINS;
  document.getElementById('livesCount').textContent = lives;
  document.getElementById('keyCount').textContent = '0';
  document.getElementById('keyTotal').textContent = TOTAL_KEYS;
  document.getElementById('keyHud').style.display = TOTAL_KEYS > 0 ? '' : 'none';
  const status = document.getElementById('statusMsg');
  status.textContent = 'Find all ' + TOTAL_COINS + ' coins to unlock the exit';
  status.classList.remove('unlocked');

  // Hide overlays
  document.getElementById('winOverlay').classList.remove('active');
  document.getElementById('gameOverOverlay').classList.remove('active');

  gameOver = false;
}

function respawnPlayer(n) {
  // Preserve map state (collected coins, opened exits, opened gates) and player.coins/keys
  player.x = levels[n].playerStart.x;
  player.y = levels[n].playerStart.y;
  player.won = false;
  player.facing = 'right';

  // Reset enemies to start so they don't accumulate in unpredictable positions
  enemies = (levels[n].enemies || []).map(e => ({ ...e, pathIndex: 0, facing: 'right', mode: 'patrol' }));

  // Update HUD lives only — coins and keys are unchanged
  document.getElementById('livesCount').textContent = lives;

  // Hide overlays
  document.getElementById('winOverlay').classList.remove('active');
  document.getElementById('gameOverOverlay').classList.remove('active');

  gameOver = false;
}
