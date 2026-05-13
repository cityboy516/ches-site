function killPlayer() {
  if (deathTimer > 0 || gameOver) return;
  lives--;
  document.getElementById('livesCount').textContent = Math.max(0, lives);
  if (lives < 0) {
    gameOver = true;
    document.getElementById('gameOverOverlay').classList.add('active');
    document.getElementById('restartBtn').focus();
  } else {
    deathTimer = DEATH_PAUSE;
  }
}

function updatePlayerAir(dt) {
  player.inWater = touchingAny(player.x, player.y, player.w, player.h, TILE_WATER);
  if (player.inWater) {
    player.air = Math.max(0, player.air - PLAYER_AIR_DRAIN * dt);
    if (player.air <= 0) killPlayer();
  } else {
    player.air = Math.min(1, player.air + PLAYER_AIR_RESTORE * dt);
  }
}

function update(dt) {
  if (player.won || gameOver) return;
  if (deathTimer > 0) {
    deathTimer -= dt;
    if (deathTimer <= 0) respawnPlayer(currentLevel);
    return;
  }

  player.inWater = touchingAny(player.x, player.y, player.w, player.h, TILE_WATER);
  const moveSpeed = player.speed * (player.inWater ? WATER_SPEED_MULT : 1);
  let dx = 0, dy = 0;
  if (keys['ArrowLeft'])  { dx = -moveSpeed * dt; player.facing = 'left'; }
  if (keys['ArrowRight']) { dx =  moveSpeed * dt; player.facing = 'right'; }
  if (keys['ArrowUp'])    { dy = -moveSpeed * dt; player.facing = 'up'; }
  if (keys['ArrowDown'])  { dy =  moveSpeed * dt; player.facing = 'down'; }

  const nx = player.x + dx;
  if (!hitsWall(nx, player.y, player.w, player.h)) player.x = nx;
  const ny = player.y + dy;
  if (!hitsWall(player.x, ny, player.w, player.h)) player.y = ny;

  updateEnemies(dt);
  updatePlayerAir(dt);
  if (deathTimer > 0 || gameOver) return;

  // Key collection — opens key gates in this level
  const key = touching(player.x, player.y, player.w, player.h, 6);
  if (key) {
    map[key.r][key.c] = 0;
    player.keys++;
    document.getElementById('keyCount').textContent = player.keys;
    if (player.keys >= TOTAL_KEYS) {
      for (let r = 0; r < ROWS; r++)
        for (let c = 0; c < COLS; c++)
          if (map[r][c] === 7) map[r][c] = 0;
      tryUnlockExit();
    }
  }

  // Coin collection
  const coin = touching(player.x, player.y, player.w, player.h, 2);
  if (coin) {
    map[coin.r][coin.c] = (map[coin.r][coin.c] === TILE_WATER_COIN ? TILE_WATER : 0);
    player.coins++;
    document.getElementById('coinCount').textContent = player.coins;
    tryUnlockExit();
  }

  // Exit reached
  if (touching(player.x, player.y, player.w, player.h, 4)) {
    player.won = true;
    const isLast = currentLevel + 1 >= levels.length;
    document.getElementById('winMsg').textContent = isLast
      ? 'You completed the game!' : 'You made it through.';
    document.getElementById('nextBtn').textContent = isLast ? 'Play Again' : 'Next Level →';
    document.getElementById('winOverlay').classList.add('active');
    document.getElementById('nextBtn').focus();
    return;
  }

  // Fire death — passable but lethal
  if (touching(player.x, player.y, player.w, player.h, TILE_FIRE)) {
    killPlayer();
    return;
  }

  // Enemy collision — AABB overlap with any guard
  for (const enemy of enemies) {
    if (!enemy.dead && overlapsPlayer(enemy)) {
      killPlayer();
      return; // prevent further checks on now-reset state
    }
  }
}
