function playerInCone(e) {
  if (e.dead) return false;
  const cx = e.x + e.w / 2, cy = e.y + e.h / 2;
  const px = player.x + player.w / 2, py = player.y + player.h / 2;
  const dx = px - cx, dy = py - cy;
  if (Math.hypot(dx, dy) > CONE_RANGE) return false;
  const faceAngle = { right: 0, left: Math.PI, up: -Math.PI / 2, down: Math.PI / 2 }[e.facing];
  let diff = Math.abs(Math.atan2(dy, dx) - faceAngle);
  if (diff > Math.PI) diff = 2 * Math.PI - diff; // normalise — prevents wrap-around false negatives
  if (diff > CONE_HALF_ANGLE) return false;
  return hasLineOfSight(cx, cy, px, py);
}

function killEnemy(e, cause) {
  if (e.dead) return;
  e.dead = true;
  e.mode = 'dead';
  e.deathCause = cause;
  e.deathTimer = 0;
  e.deathFallDir = e.facing === 'left' || e.facing === 'up' ? -1 : 1;
  if (cause === 'fire') levelStats.fireKills++;
  if (cause === 'water') levelStats.waterKills++;
  tryUnlockExit();
}

function updateEnemyHazards(e, dt) {
  if (touching(e.x, e.y, e.w, e.h, TILE_FIRE)) {
    killEnemy(e, 'fire');
    return;
  }

  e.inWater = touchingAny(e.x, e.y, e.w, e.h, TILE_WATER);
  if (e.inWater) {
    e.air = Math.max(0, (e.air ?? 1) - ENEMY_AIR_DRAIN * dt);
    if (e.air <= 0) killEnemy(e, 'water');
  } else {
    e.air = Math.min(1, (e.air ?? 1) + ENEMY_AIR_RESTORE * dt);
  }
}

function updateEnemies(dt) {
  for (const e of enemies) {
    if (e.dead) {
      e.deathTimer = Math.min(ENEMY_DEATH_ANIM_FRAMES, (e.deathTimer || 0) + dt);
      continue;
    }
    e.inWater = touchingAny(e.x, e.y, e.w, e.h, TILE_WATER);
    if (e.mode === 'patrol') {
      // Waypoint patrol
      const target = e.path[e.pathIndex];
      const ddx = target.x - e.x, ddy = target.y - e.y;
      const dist = Math.hypot(ddx, ddy);
      if (dist < 3) {
        e.x = target.x; e.y = target.y;
        e.pathIndex = (e.pathIndex + 1) % e.path.length;
      } else {
        const speed = e.speed * (e.inWater ? WATER_SPEED_MULT : 1);
        const moved = moveEntity(e, (ddx / dist) * speed * dt, (ddy / dist) * speed * dt, enemies);
        e.facing = Math.abs(ddx) > Math.abs(ddy)
          ? (ddx > 0 ? 'right' : 'left')
          : (ddy > 0 ? 'down' : 'up');
        // Stuck detection: if completely blocked for ~0.5s, skip to next waypoint
        if (!moved) {
          e.stuckFrames = (e.stuckFrames || 0) + 1;
          if (e.stuckFrames > 30) {
            e.pathIndex = (e.pathIndex + 1) % e.path.length;
            e.stuckFrames = 0;
          }
        } else {
          e.stuckFrames = 0;
        }
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
        const spd = (e.chaseSpeed || e.speed * 2) * (e.inWater ? WATER_SPEED_MULT : 1) * dt;
        const mx = (dx / dist) * spd, my = (dy / dist) * spd;
        // Apply x and y independently for smooth wall-sliding
        moveEntity(e, mx, my, enemies);
        e.facing = Math.abs(dx) > Math.abs(dy)
          ? (dx > 0 ? 'right' : 'left')
          : (dy > 0 ? 'down' : 'up');
      }
      // Return to patrol when player leaves the cone
      if (!playerInCone(e)) e.mode = 'patrol';
    }
    updateEnemyHazards(e, dt);
  }
}
