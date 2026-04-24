const keys = {};
window.addEventListener('keydown', e => {
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) e.preventDefault();
  keys[e.key] = true;
});
window.addEventListener('keyup', e => { delete keys[e.key]; });

// D-pad touch + click controls
function bindBtn(id, key) {
  const btn = document.getElementById(id);
  const press   = e => { e.preventDefault(); keys[key] = true;  btn.classList.add('pressed'); };
  const release = e => { e.preventDefault(); delete keys[key]; btn.classList.remove('pressed'); };
  btn.addEventListener('touchstart',  press,   { passive: false });
  btn.addEventListener('touchend',    release, { passive: false });
  btn.addEventListener('touchcancel', release, { passive: false });
  btn.addEventListener('mousedown',   press);
  btn.addEventListener('mouseup',     release);
  btn.addEventListener('mouseleave',  release);
}
bindBtn('btn-up',    'ArrowUp');
bindBtn('btn-down',  'ArrowDown');
bindBtn('btn-left',  'ArrowLeft');
bindBtn('btn-right', 'ArrowRight');

function releaseDpadKeys() {
  for (const key of ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']) delete keys[key];
  for (const id of ['btn-up', 'btn-down', 'btn-left', 'btn-right']) {
    document.getElementById(id).classList.remove('pressed');
  }
}

// ============================================================
// DEV MODE — type DEV_CODE during play to enable level-skip keys.
const DEV_CODE = 'debug';
let devBuffer = '';
let devModeEnabled = false;
window.addEventListener('keydown', e => {
  if (!devModeEnabled && e.key.length === 1) {
    devBuffer = (devBuffer + e.key.toLowerCase()).slice(-DEV_CODE.length);
    if (devBuffer === DEV_CODE) devModeEnabled = true;
  }
  if (!devModeEnabled) return;
  if (e.key === 'n' || e.key === 'N') {
    player.won = false; gameOver = false;
    loadLevel(Math.min(currentLevel + 1, levels.length - 1));
  }
  if (e.key === 'b' || e.key === 'B') {
    player.won = false; gameOver = false;
    loadLevel(Math.max(currentLevel - 1, 0));
  }
  if (e.key === '+' || e.key === '=') {
    lives++;
    document.getElementById('livesCount').textContent = lives;
  }
  if (e.key === '-' || e.key === '_') {
    lives = Math.max(0, lives - 1);
    document.getElementById('livesCount').textContent = lives;
  }
});
// ============================================================
