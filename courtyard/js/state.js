let map = [], ROWS, COLS, TOTAL_COINS, TOTAL_KEYS;
let currentLevel = 0;
let lives = 3;
let gameOver = false;
let enemies = [];
let deathTimer = 0;
const DEATH_PAUSE = 38;
let levelStats = { fireKills: 0, waterKills: 0 };

const player = {
  x: 46, y: 46,
  w: 28, h: 28,
  speed: 3,
  facing: 'right',
  air: 1,
  inWater: false,
  coins: 0,
  keys: 0,
  won: false,
};

function resetLevelStats() {
  levelStats = { fireKills: 0, waterKills: 0 };
}

function openExitTiles() {
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      if (map[r][c] === 3) map[r][c] = 4;
}

function updateObjectiveStatus() {
  const el = document.getElementById('statusMsg');
  const coinsLeft = Math.max(0, TOTAL_COINS - player.coins);
  if (coinsLeft === 0) {
    el.textContent = '✓ Exit unlocked — reach the door!';
    el.classList.add('unlocked');
  } else if (coinsLeft === TOTAL_COINS) {
    el.textContent = 'Find all ' + TOTAL_COINS + ' coins to unlock the exit';
    el.classList.remove('unlocked');
  } else {
    el.textContent = 'Exit locked — collect ' + coinsLeft + ' more coin' + (coinsLeft === 1 ? '' : 's') + '.';
    el.classList.remove('unlocked');
  }
}

function tryUnlockExit() {
  if (player.coins >= TOTAL_COINS) openExitTiles();
  updateObjectiveStatus();
}

function resetPlayerAir() {
  player.air = 1;
  player.inWater = false;
}

function resetEnemies(preserveDead) {
  const previousEnemies = enemies;
  enemies = (levels[currentLevel].enemies || []).map((e, i) => {
    const wasDead = preserveDead && previousEnemies[i] && previousEnemies[i].dead;
    return {
      ...e,
      pathIndex: 0,
      facing: e.facing || 'right',
      mode: 'patrol',
      air: 1,
      inWater: false,
      dead: !!wasDead,
      deathTimer: wasDead ? ENEMY_DEATH_ANIM_FRAMES : 0,
      deathCause: wasDead ? previousEnemies[i].deathCause : null,
      deathFallDir: wasDead ? previousEnemies[i].deathFallDir : 1,
    };
  });
}

function countTiles(val) {
  let total = 0;
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      if (map[r][c] === val) total++;
  return total;
}

function loadLevel(n) {
  currentLevel = n;
  deathTimer = 0;
  // Deep-copy map so collected coins / opened exits don't persist across respawns
  map = levels[n].map.map(row => [...row]);
  ROWS = map.length;
  COLS = map[0].length;
  TOTAL_COINS = levels[n].totalCoins;
  TOTAL_KEYS = countTiles(6);
  resetLevelStats();

  // Reset player
  player.x = levels[n].playerStart.x;
  player.y = levels[n].playerStart.y;
  player.coins = 0;
  player.keys = 0;
  player.won = false;
  player.facing = 'right';
  resetPlayerAir();

  // Reset enemies — shallow spread is safe: path array is read-only, only runtime fields change
  resetEnemies(false);

  // Update HUD
  document.getElementById('levelTitle').textContent = 'LEVEL ' + (n + 1) + ' — ' + levels[n].name;
  document.getElementById('coinCount').textContent = '0';
  document.getElementById('coinTotal').textContent = TOTAL_COINS;
  document.getElementById('livesCount').textContent = lives;
  document.getElementById('keyCount').textContent = '0';
  document.getElementById('keyTotal').textContent = TOTAL_KEYS;
  document.getElementById('keyHud').style.display = TOTAL_KEYS > 0 ? '' : 'none';
  tryUnlockExit();

  // Hide overlays
  document.getElementById('winOverlay').classList.remove('active');
  document.getElementById('gameOverOverlay').classList.remove('active');

  gameOver = false;
}

function respawnPlayer(n) {
  deathTimer = 0;

  // Preserve map state (collected coins, opened exits, opened gates) and player.coins/keys
  player.x = levels[n].playerStart.x;
  player.y = levels[n].playerStart.y;
  player.won = false;
  player.facing = 'right';
  resetPlayerAir();

  // Reset living enemies to start; killed enemies stay gone, like collected coins.
  resetEnemies(true);

  // Update HUD lives only — coins and keys are unchanged
  document.getElementById('livesCount').textContent = lives;
  tryUnlockExit();

  // Hide overlays
  document.getElementById('winOverlay').classList.remove('active');
  document.getElementById('gameOverOverlay').classList.remove('active');

  gameOver = false;
}
