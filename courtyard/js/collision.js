function tile(r, c) {
  if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return 1;
  return map[r][c];
}

function hitsWall(x, y, w, h) {
  const r0 = Math.floor(y / T),         r1 = Math.floor((y + h - 1) / T);
  const c0 = Math.floor(x / T),         c1 = Math.floor((x + w - 1) / T);
  for (let r = r0; r <= r1; r++)
    for (let c = c0; c <= c1; c++) {
      const t = tile(r, c);
      // 1=wall, 3=locked exit, and 7=key gate are solid. Fire (5) kills, not blocks.
      if (t === 1 || t === 3 || t === 7) return true;
    }
  return false;
}

function touching(x, y, w, h, val) {
  const r0 = Math.floor(y / T),         r1 = Math.floor((y + h - 1) / T);
  const c0 = Math.floor(x / T),         c1 = Math.floor((x + w - 1) / T);
  for (let r = r0; r <= r1; r++)
    for (let c = c0; c <= c1; c++)
      if (tile(r, c) === val) return {r, c};
  return null;
}

function overlapsPlayer(e) {
  return player.x < e.x + e.w && player.x + player.w > e.x &&
         player.y < e.y + e.h && player.y + player.h > e.y;
}

function overlapsEntity(ax, ay, aw, ah, b) {
  return ax < b.x + b.w && ax + aw > b.x &&
         ay < b.y + b.h && ay + ah > b.y;
}

function moveEntity(e, mx, my, others) {
  const blocked = (x, y) => {
    if (hitsWall(x, y, e.w, e.h)) return true;
    if (others) for (const o of others) if (o !== e && overlapsEntity(x, y, e.w, e.h, o)) return true;
    return false;
  };
  let moved = false;
  if (!blocked(e.x + mx, e.y)) { e.x += mx; moved = true; }
  if (!blocked(e.x, e.y + my)) { e.y += my; moved = true; }
  return moved;
}
