// Scale canvas to fit smaller screens while keeping internal resolution
function scaleCanvas() {
  const maxW = Math.min(800, window.innerWidth - 12);
  const verticalChrome = [
    document.getElementById('levelTitle'),
    document.getElementById('hud'),
    document.getElementById('hint'),
    document.getElementById('dpad'),
    document.getElementById('back'),
    document.getElementById('build'),
  ].reduce((total, el) => total + (el ? el.offsetHeight : 0), 80);
  const maxH = Math.min(600, window.innerHeight - verticalChrome - 72);
  const scale = Math.max(0.3, Math.min(maxW / 800, maxH / 600));
  canvas.style.width  = Math.round(800 * scale) + 'px';
  canvas.style.height = Math.round(600 * scale) + 'px';
}
window.addEventListener('resize', scaleCanvas);
scaleCanvas();

// Overlay button handlers
document.getElementById('nextBtn').addEventListener('click', () => {
  player.won = false;
  if (currentLevel + 1 < levels.length) {
    loadLevel(currentLevel + 1);
  } else {
    // All levels complete — reset to start
    lives = 3;
    loadLevel(0);
  }
});

document.getElementById('restartBtn').addEventListener('click', () => {
  lives = 3;
  loadLevel(0);
});

let lastTime = 0;
function loop(timestamp) {
  // dt: how many 60fps-frames worth of time passed (1.0 = perfect 60fps, 2.0 = 30fps, etc.)
  // Capped at 3 to prevent teleporting through walls if the tab was backgrounded
  const dt = lastTime ? Math.min((timestamp - lastTime) / (1000 / 60), 3) : 1;
  lastTime = timestamp;
  tick++;
  update(dt);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMap();
  drawEnemies(); // enemies render below player
  drawPlayer();  // player always on top
  if (deathTimer > 0) {
    const alpha = 0.16 + 0.18 * (deathTimer / DEATH_PAUSE);
    ctx.fillStyle = `rgba(231,76,60,${alpha})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffd6d1';
    ctx.font = 'bold 28px Courier New';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('YOU DIED', canvas.width / 2, canvas.height / 2);
  }
  // Dim canvas when paused (overlay showing)
  if (player.won || gameOver) {
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  requestAnimationFrame(loop);
}

loadLevel(0);
loop();
