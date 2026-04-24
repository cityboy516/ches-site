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

function moveEntity(e, mx, my) {
  let moved = false;
  if (!hitsWall(e.x + mx, e.y, e.w, e.h)) {
    e.x += mx;
    moved = true;
  }
  if (!hitsWall(e.x, e.y + my, e.w, e.h)) {
    e.y += my;
    moved = true;
  }
  return moved;
}
