function playerInCone(e) {
  const cx = e.x + e.w / 2, cy = e.y + e.h / 2;
  const px = player.x + player.w / 2, py = player.y + player.h / 2;
  const dx = px - cx, dy = py - cy;
  if (Math.hypot(dx, dy) > CONE_RANGE) return false;
  const faceAngle = { right: 0, left: Math.PI, up: -Math.PI / 2, down: Math.PI / 2 }[e.facing];
  let diff = Math.abs(Math.atan2(dy, dx) - faceAngle);
  if (diff > Math.PI) diff = 2 * Math.PI - diff; // normalise — prevents wrap-around false negatives
  return diff <= CONE_HALF_ANGLE;
}

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

function updateEnemies(dt) {
  for (const e of enemies) {
    if (e.mode === 'patrol') {
      // Waypoint patrol
      const target = e.path[e.pathIndex];
      const ddx = target.x - e.x, ddy = target.y - e.y;
      const dist = Math.hypot(ddx, ddy);
      if (dist < 3) {
        e.x = target.x; e.y = target.y;
        e.pathIndex = (e.pathIndex + 1) % e.path.length;
      } else {
        moveEntity(e, (ddx / dist) * e.speed * dt, (ddy / dist) * e.speed * dt);
        e.facing = Math.abs(ddx) > Math.abs(ddy)
          ? (ddx > 0 ? 'right' : 'left')
          : (ddy > 0 ? 'down' : 'up');
      }
      // Only cone-aware enemies (those with chaseSpeed) can switch to chase
      if (e.chaseSpeed && playerInCone(e)) e.mode = 'chase';

    } else {
      // Chase: move toward player with wall-slide collision
      const cx = e.x + e.w / 2, cy = e.y + e.h / 2;
      const px = player.x + player.w / 2, py = player.y + player.h / 2;
      const dx = px - cx, dy = py - cy;
      const dist = Math.hypot(dx, dy);
      if (dist > 1) {
        const spd = (e.chaseSpeed || e.speed * 2) * dt;
        const mx = (dx / dist) * spd, my = (dy / dist) * spd;
        // Apply x and y independently for smooth wall-sliding
        moveEntity(e, mx, my);
        e.facing = Math.abs(dx) > Math.abs(dy)
          ? (dx > 0 ? 'right' : 'left')
          : (dy > 0 ? 'down' : 'up');
      }
      // Return to patrol when player leaves the cone
      if (!playerInCone(e)) e.mode = 'patrol';
    }
  }
}
