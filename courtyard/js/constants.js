const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
canvas.focus();

const T = 40; // tile size in pixels
const CONE_RANGE = 220;              // vision distance in pixels (~5.5 tiles)
const CONE_HALF_ANGLE = Math.PI / 4; // 45° either side = 90° total cone

// Waypoint helper — converts tile (row, col) to pixel position matching player offset
function wp(r, c) { return { x: c * T + 6, y: r * T + 6 }; }
