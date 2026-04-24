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
          ctx.save();
          ctx.translate(x + T / 2, y + T / 2);
          ctx.shadowColor = '#f0b429'; ctx.shadowBlur = 12;
          ctx.fillStyle = '#f0b429';
          ctx.beginPath(); ctx.arc(0, 0, 7 * scale, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#ffe066';
          ctx.beginPath(); ctx.arc(-2, -2, 2.5 * scale, 0, Math.PI * 2); ctx.fill();
          ctx.shadowBlur = 0;
          ctx.restore();

        } else if (t === 3) {
          ctx.fillStyle = '#5a0a0a'; ctx.fillRect(x + 4, y + 4, T - 8, T - 8);
          ctx.strokeStyle = '#c0392b'; ctx.lineWidth = 2; ctx.strokeRect(x + 4, y + 4, T - 8, T - 8);
          ctx.fillStyle = '#ff6b6b'; ctx.font = 'bold 11px Courier New';
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('LOCKED', x + T / 2, y + T / 2);

        } else if (t === 4) {
          const glow = 0.5 + 0.5 * Math.sin(tick * 0.05);
          ctx.shadowColor = '#2ecc71'; ctx.shadowBlur = 20 * glow;
          ctx.fillStyle = `rgba(39,174,96,${0.55 + 0.3 * glow})`;
          ctx.fillRect(x + 4, y + 4, T - 8, T - 8);
          ctx.strokeStyle = '#2ecc71'; ctx.lineWidth = 2;
          ctx.strokeRect(x + 4, y + 4, T - 8, T - 8);
          ctx.fillStyle = '#afffcf'; ctx.font = 'bold 11px Courier New';
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('EXIT', x + T / 2, y + T / 2);
          ctx.shadowBlur = 0;

        } else if (t === 5) {
          // Fire tile — each tile flickers independently using its grid position as offset
          const flicker = Math.sin(tick * 0.13 + c * 1.7 + r * 2.3);
          ctx.shadowColor = '#ff6b00';
          ctx.shadowBlur = 14 + 8 * Math.abs(flicker);
          ctx.fillStyle = flicker > 0 ? '#ff6b00' : '#c0392b';
          ctx.fillRect(x + 5, y + 5, T - 10, T - 10);
          // Inner hot spot
          ctx.fillStyle = 'rgba(255,220,100,0.55)';
          ctx.beginPath(); ctx.arc(x + T / 2, y + T / 2, 5, 0, Math.PI * 2); ctx.fill();
          ctx.shadowBlur = 0; // always reset — glow bleeds into adjacent tiles if left set
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

function drawEnemies() {
  for (const e of enemies) {
    const { x, y, w, h, facing } = e;

    // Vision cone — only for cone-aware enemies (those with chaseSpeed)
    if (e.chaseSpeed !== undefined) {
      const faceAngle = { right: 0, left: Math.PI, up: -Math.PI / 2, down: Math.PI / 2 }[facing];
      const cx = x + w / 2, cy = y + h / 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, CONE_RANGE, faceAngle - CONE_HALF_ANGLE, faceAngle + CONE_HALF_ANGLE);
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

    // Body — purple
    roundRect(x, y, w, h, 5);
    ctx.fillStyle = '#8e44ad'; ctx.fill();
    ctx.strokeStyle = '#6c3483'; ctx.lineWidth = 2; ctx.stroke();

    // Top highlight
    roundRect(x + 3, y + 2, w - 6, 8, 3);
    ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.fill();

    // Directional eye (same layout as player)
    const eyePos = {
      right: [x + w - 10, y + h / 2 - 3],
      left:  [x + 4,      y + h / 2 - 3],
      up:    [x + w / 2 - 3, y + 4],
      down:  [x + w / 2 - 3, y + h - 10],
    };
    const [ex, ey] = eyePos[facing];
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(ex + 3, ey + 3, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath(); ctx.arc(ex + 3, ey + 3, 2, 0, Math.PI * 2); ctx.fill();
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

  const eyePos = {
    right: [x + w - 10, y + h / 2 - 3],
    left:  [x + 4,      y + h / 2 - 3],
    up:    [x + w / 2 - 3, y + 4],
    down:  [x + w / 2 - 3, y + h - 10],
  };
  const [ex, ey] = eyePos[facing];
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(ex + 3, ey + 3, 4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath(); ctx.arc(ex + 3, ey + 3, 2, 0, Math.PI * 2); ctx.fill();
}
