function killPlayer() {
  lives--;
  document.getElementById('livesCount').textContent = lives;
  if (lives < 0) {
    gameOver = true;
    document.getElementById('gameOverOverlay').classList.add('active');
  } else {
    loadLevel(currentLevel);
  }
}

function update(dt) {
  if (player.won || gameOver) return;

  let dx = 0, dy = 0;
  if (keys['ArrowLeft'])  { dx = -player.speed * dt; player.facing = 'left'; }
  if (keys['ArrowRight']) { dx =  player.speed * dt; player.facing = 'right'; }
  if (keys['ArrowUp'])    { dy = -player.speed * dt; player.facing = 'up'; }
  if (keys['ArrowDown'])  { dy =  player.speed * dt; player.facing = 'down'; }

  const nx = player.x + dx;
  if (!hitsWall(nx, player.y, player.w, player.h)) player.x = nx;
  const ny = player.y + dy;
  if (!hitsWall(player.x, ny, player.w, player.h)) player.y = ny;

  updateEnemies(dt);

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
      const el = document.getElementById('statusMsg');
      if (player.coins >= TOTAL_COINS) {
        el.textContent = 'Key found — gate opened. Reach the exit!';
        el.classList.add('unlocked');
      } else {
        el.textContent = 'Key found — gate opened. Collect all ' + TOTAL_COINS + ' coins.';
        el.classList.remove('unlocked');
      }
    }
  }

  // Coin collection
  const coin = touching(player.x, player.y, player.w, player.h, 2);
  if (coin) {
    map[coin.r][coin.c] = 0;
    player.coins++;
    document.getElementById('coinCount').textContent = player.coins;
    if (player.coins >= TOTAL_COINS) {
      for (let r = 0; r < ROWS; r++)
        for (let c = 0; c < COLS; c++)
          if (map[r][c] === 3) map[r][c] = 4;
      const el = document.getElementById('statusMsg');
      if (TOTAL_KEYS > 0 && player.keys < TOTAL_KEYS) {
        el.textContent = 'Exit unlocked — reach the door, or find the key shortcut.';
        el.classList.remove('unlocked');
      } else {
        el.textContent = '✓ Exit unlocked — reach the door!';
        el.classList.add('unlocked');
      }
    }
  }

  // Exit reached
  if (touching(player.x, player.y, player.w, player.h, 4)) {
    player.won = true;
    const isLast = currentLevel + 1 >= levels.length;
    document.getElementById('winMsg').textContent = isLast
      ? 'You completed the game!' : 'You made it through.';
    document.getElementById('nextBtn').textContent = isLast ? 'Play Again' : 'Next Level →';
    document.getElementById('winOverlay').classList.add('active');
    return;
  }

  // Fire death — tile 5 is passable but lethal
  if (touching(player.x, player.y, player.w, player.h, 5)) {
    killPlayer();
    return;
  }

  // Enemy collision — AABB overlap with any guard
  for (const enemy of enemies) {
    if (overlapsPlayer(enemy)) {
      killPlayer();
      return; // prevent further checks on now-reset state
    }
  }
}
