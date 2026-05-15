const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
canvas.focus();

const T = 40; // tile size in pixels
const CONE_RANGE = 220;              // vision distance in pixels (~5.5 tiles)
const CONE_HALF_ANGLE = Math.PI / 4; // 45° either side = 90° total cone
const TILE_FIRE = 5;
const TILE_WATER = 8;
const TILE_WATER_COIN = 9; // water tile that also contains a coin
const WATER_SPEED_MULT = 0.55;
const PLAYER_AIR_DRAIN = 1 / (60 * 2.888);
const PLAYER_AIR_RESTORE = 1 / (60 * 3);
const ENEMY_AIR_DRAIN = 1 / (60 * 6);
const ENEMY_AIR_RESTORE = 1 / (60 * 2.5);
const ENEMY_DEATH_ANIM_FRAMES = 50;

// Waypoint helper — converts tile (row, col) to pixel position matching player offset
function wp(r, c) { return { x: c * T + 6, y: r * T + 6 }; }
