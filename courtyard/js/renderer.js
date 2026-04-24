let tick = 0;

function roundRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);   ctx.arcTo(x + w, y,     x + w, y + r,     r);
  ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);   ctx.arcTo(x,     y + h, x,     y + h - r, r);
  ctx.lineTo(x, y + r);       ctx.arcTo(x,     y,     x + r, y,         r);
  ctx.closePath();
}

function drawMap() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const x = c * T, y = r * T, t = map[r][c];

      if (t === 1) {
        ctx.fillStyle = '#252545'; ctx.fillRect(x, y, T, T);
        ctx.fillStyle = '#363668'; ctx.fillRect(x + 2, y + 2, T - 4, T - 9);
        ctx.fillStyle = '#1a1a30'; ctx.fillRect(x, y + T - 7, T, 7);
      } else {
        ctx.fillStyle = '#16162a'; ctx.fillRect(x, y, T, T);
        ctx.strokeStyle = '#1e1e38'; ctx.lineWidth = 0.5; ctx.strokeRect(x, y, T, T);

        if (t === 2) {
          const scale = 1 + 0.18 * Math.sin(tick * 0.07 + c * 0.9 + r * 0.7);
          const sparkle = tick * 0.08 + c * 1.3 + r * 0.9;
          const sx = Math.cos(sparkle) * 8;
          const sy = Math.sin(sparkle) * 6;
          ctx.save();
          ctx.translate(x + T / 2, y + T / 2);
          ctx.shadowColor = '#f0b429'; ctx.shadowBlur = 12;
          ctx.fillStyle = '#f0b429';
          ctx.beginPath(); ctx.arc(0, 0, 7 * scale, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#ffe066';
          ctx.beginPath(); ctx.arc(-2, -2, 2.5 * scale, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = 'rgba(255,255,255,0.9)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(sx - 3, sy);
          ctx.lineTo(sx + 3, sy);
          ctx.moveTo(sx, sy - 3);
          ctx.lineTo(sx, sy + 3);
          ctx.stroke();
          ctx.shadowBlur = 0;
          ctx.restore();

        } else if (t === 3) {
          ctx.shadowColor = '#c0392b';
          ctx.shadowBlur = 10;
          ctx.fillStyle = '#160909';
          ctx.fillRect(x + 8, y + 5, T - 16, T - 10);
          ctx.strokeStyle = '#c0392b';
          ctx.lineWidth = 3;
          ctx.strokeRect(x + 8, y + 5, T - 16, T - 10);
          ctx.fillStyle = 'rgba(192,57,43,0.22)';
          ctx.fillRect(x + 13, y + 10, T - 26, T - 20);
          ctx.fillStyle = '#c0392b';
          ctx.fillRect(x + 10, y + T - 8, T - 20, 3);
          ctx.shadowBlur = 0;
          ctx.strokeStyle = '#330808';
          ctx.lineWidth = 5;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(x + 13, y + 10);
          ctx.lineTo(x + T - 13, y + T - 10);
          ctx.moveTo(x + T - 13, y + 10);
          ctx.lineTo(x + 13, y + T - 10);
          ctx.stroke();
          ctx.strokeStyle = '#ff8a80';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(x + 13, y + 10);
          ctx.lineTo(x + T - 13, y + T - 10);
          ctx.moveTo(x + T - 13, y + 10);
          ctx.lineTo(x + 13, y + T - 10);
          ctx.stroke();

        } else if (t === 4) {
          const glow = 0.5 + 0.5 * Math.sin(tick * 0.05);
          ctx.shadowColor = '#2ecc71';
          ctx.shadowBlur = 14 * glow;
          ctx.fillStyle = '#07170f';
          ctx.fillRect(x + 8, y + 5, T - 16, T - 10);
          ctx.strokeStyle = '#2ecc71';
          ctx.lineWidth = 3;
          ctx.strokeRect(x + 8, y + 5, T - 16, T - 10);
          ctx.fillStyle = `rgba(46,204,113,${0.2 + 0.16 * glow})`;
          ctx.fillRect(x + 13, y + 10, T - 26, T - 20);
          ctx.fillStyle = '#2ecc71';
          ctx.fillRect(x + 10, y + T - 8, T - 20, 3);
          ctx.shadowBlur = 0;

        } else if (t === 5) {
          const flicker = Math.sin(tick * 0.14 + c * 1.7 + r * 2.3);
          const sway = Math.sin(tick * 0.09 + c * 2.1);
          ctx.fillStyle = '#321515';
          roundRect(x + 5, y + 7, T - 10, T - 10, 4);
          ctx.fill();

          ctx.save();
          ctx.translate(x + T / 2, y + T / 2 + 5);
          ctx.shadowColor = '#ff6b00';
          ctx.shadowBlur = 16 + 8 * Math.abs(flicker);

          ctx.fillStyle = flicker > 0 ? '#ff7a18' : '#d94b16';
          ctx.beginPath();
          ctx.moveTo(-15, 10);
          ctx.bezierCurveTo(-20, -1, -13, -11 - 2 * flicker, -5 + sway, -16);
          ctx.bezierCurveTo(-4, -5, 2, 1, 0, 11);
          ctx.closePath();
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(0, -15 - flicker * 3);
          ctx.bezierCurveTo(13, -4, 12, 10, 0, 14);
          ctx.bezierCurveTo(-12, 9, -13, -5, 0, -15 - flicker * 3);
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(15, 10);
          ctx.bezierCurveTo(20, 0, 13, -10 + 2 * flicker, 6 + sway, -15);
          ctx.bezierCurveTo(4, -4, -2, 2, 0, 11);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#ffd166';
          ctx.beginPath();
          ctx.moveTo(0, -9 - flicker * 2);
          ctx.bezierCurveTo(8, -2, 8, 8, 0, 11);
          ctx.bezierCurveTo(-8, 8, -8, -2, 0, -9 - flicker * 2);
          ctx.fill();

          ctx.fillStyle = 'rgba(255,226,120,0.45)';
          ctx.fillRect(-16, 8, 32, 5);
          ctx.restore();
          ctx.shadowBlur = 0;
        } else if (t === 6) {
          const bob = Math.sin(tick * 0.08 + c) * 2;
          ctx.save();
          ctx.translate(x + T / 2, y + T / 2 + bob);
          ctx.shadowColor = '#f0b429'; ctx.shadowBlur = 12;
          ctx.strokeStyle = '#f0b429'; ctx.lineWidth = 4; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.arc(-5, -3, 6, 0, Math.PI * 2); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(1, -3); ctx.lineTo(12, -3); ctx.lineTo(12, 4); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(7, -3); ctx.lineTo(7, 2); ctx.stroke();
          ctx.shadowBlur = 0;
          ctx.restore();
        } else if (t === 7) {
          ctx.fillStyle = '#102a43'; ctx.fillRect(x + 4, y + 4, T - 8, T - 8);
          ctx.strokeStyle = '#3498db'; ctx.lineWidth = 2; ctx.strokeRect(x + 4, y + 4, T - 8, T - 8);
          ctx.fillStyle = '#8fd3ff';
          for (let i = 0; i < 4; i++) ctx.fillRect(x + 9 + i * 7, y + 7, 3, T - 14);
          ctx.font = 'bold 9px Courier New';
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('GATE', x + T / 2, y + T / 2);
        }
      }
    }
  }
}

function castConePolygon(cx, cy, faceAngle, range, halfAngle) {
  const RAY_COUNT = 60;
  const step = T / 8; // 5px steps — fine enough for clean wall edges
  const maxSteps = Math.floor(range / step);
  const pts = [[cx, cy]];
  for (let i = 0; i <= RAY_COUNT; i++) {
    const angle = faceAngle - halfAngle + (i / RAY_COUNT) * halfAngle * 2;
    const rdx = Math.cos(angle), rdy = Math.sin(angle);
    let hitDist = range;
    for (let j = 1; j <= maxSteps; j++) {
      const d = step * j;
      const tv = tile(Math.floor((cy + rdy * d) / T), Math.floor((cx + rdx * d) / T));
      if (tv === 1 || tv === 3 || tv === 7) { hitDist = step * (j - 1); break; }
    }
    pts.push([cx + rdx * hitDist, cy + rdy * hitDist]);
  }
  return pts;
}

function drawEnemies() {
  for (const e of enemies) {
    const { x, y, w, h, facing } = e;
    const isWatcher = e.chaseSpeed !== undefined;
    const isChasing = e.mode === 'chase';

    // Vision cone — only for cone-aware enemies (those with chaseSpeed)
    if (isWatcher) {
      const faceAngle = { right: 0, left: Math.PI, up: -Math.PI / 2, down: Math.PI / 2 }[facing];
      const cx = x + w / 2, cy = y + h / 2;
      const pts = castConePolygon(cx, cy, faceAngle, CONE_RANGE, CONE_HALF_ANGLE);
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
      ctx.closePath();
      ctx.fillStyle = e.mode === 'chase'
        ? 'rgba(231,76,60,0.18)'    // red when chasing
        : 'rgba(142,68,173,0.10)';  // faint purple when patrolling
      ctx.fill();
    }

    // Drop shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(x + w / 2 + 2, y + h + 3, w / 2 - 2, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body
    roundRect(x, y, w, h, 5);
    ctx.fillStyle = isWatcher ? '#33406f' : '#8e44ad'; ctx.fill();
    ctx.strokeStyle = isChasing ? '#b84848' : (isWatcher ? '#20284f' : '#6c3483');
    ctx.lineWidth = isChasing ? 3 : 2;
    ctx.stroke();

    // Top highlight
    roundRect(x + 3, y + 2, w - 6, 8, 3);
    ctx.fillStyle = isWatcher ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.15)'; ctx.fill();

    if (isWatcher) {
      ctx.fillStyle = isChasing ? '#c85845' : '#d1a84b';
      ctx.beginPath();
      ctx.moveTo(x + w / 2, y + 7);
      ctx.lineTo(x + w / 2 + 5, y + 13);
      ctx.lineTo(x + w / 2, y + 19);
      ctx.lineTo(x + w / 2 - 5, y + 13);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = isChasing ? '#6e2929' : '#7f6424';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    const faceAngle = {
      right: 0,
      down: Math.PI / 2,
      up: -Math.PI / 2,
      left: Math.PI,
    }[facing];

    ctx.save();
    ctx.translate(x + w / 2, y + h / 2);
    if (facing === 'left') {
      ctx.scale(-1, 1);
    } else {
      ctx.rotate(faceAngle);
    }

    ctx.fillStyle = isChasing ? '#ffd6d1' : '#fff';
    ctx.beginPath(); ctx.arc(w / 2 - 7, 0, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = isChasing ? '#c0392b' : '#1a1a1a';
    ctx.beginPath(); ctx.arc(w / 2 - 7, 0, 2, 0, Math.PI * 2); ctx.fill();

    ctx.strokeStyle = isChasing ? '#6e2929' : '#211529';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(w / 2 - 13, 7);
    ctx.lineTo(w / 2 - 7, 8);
    ctx.stroke();
    ctx.restore();
  }
}

function drawPlayer() {
  const { x, y, w, h, facing } = player;

  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath();
  ctx.ellipse(x + w / 2 + 2, y + h + 3, w / 2 - 2, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  roundRect(x, y, w, h, 5);
  ctx.fillStyle = '#e74c3c'; ctx.fill();
  ctx.strokeStyle = '#c0392b'; ctx.lineWidth = 2; ctx.stroke();

  roundRect(x + 3, y + 2, w - 6, 8, 3);
  ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.fill();

  const faceAngle = {
    right: 0,
    down: Math.PI / 2,
    up: -Math.PI / 2,
    left: Math.PI,
  }[facing];

  ctx.save();
  ctx.translate(x + w / 2, y + h / 2);
  if (facing === 'left') {
    ctx.scale(-1, 1);
  } else {
    ctx.rotate(faceAngle);
  }

  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(w / 2 - 7, 0, 4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath(); ctx.arc(w / 2 - 7, 0, 2, 0, Math.PI * 2); ctx.fill();

  ctx.strokeStyle = '#7f1d1d';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(w / 2 - 10, 6, 4, 0.15, Math.PI - 0.15);
  ctx.stroke();
  ctx.restore();
}
