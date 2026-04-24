levels.push(
  {
    name: 'THE GATEHOUSE',
    totalCoins: 8,
    playerStart: { x: 46, y: 46 },
    enemies: [
      // Guard A — watcher, key zone; now chases on sight
      { ...wp(3,18), w:28, h:28, speed:1.55, chaseSpeed:2.6,  path:[wp(3,18), wp(6,18)] },
      // Guard B — gate approach patrol; pressures coin(6,4) and gate crossing
      { ...wp(5,6),  w:28, h:28, speed:1.45, path:[wp(5,6),  wp(7,6)] },
      // Watcher C — cone guard, lower-right; covers coins and exit approach
      { ...wp(9,15), w:28, h:28, speed:1.25, chaseSpeed:2.65, path:[wp(9,15), wp(13,15)] },
      // Guard D — left-side patrol, full lower height; covers left coins from entry row down
      { ...wp(9,3),  w:28, h:28, speed:1.4,  path:[wp(9,3),  wp(13,3)] },
      // Guard E — bottom corridor patrol; guards both lower coins and exit approach
      { ...wp(13,6), w:28, h:28, speed:1.3,  path:[wp(13,6), wp(13,11)] },
    ],
    map: [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,2,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,1,1,0,0,0,1,0,1,1,1,0,0,1,1,0,1,0,1],
      [1,0,0,1,0,0,0,0,0,0,0,1,0,2,0,1,0,1,0,1],
      [1,0,0,0,0,1,1,1,5,0,0,1,0,0,0,0,0,0,0,1],
      [1,1,1,0,0,0,0,0,0,0,0,1,0,1,0,1,6,0,0,1],
      [1,0,0,5,2,1,0,0,0,0,0,0,0,1,0,1,0,0,0,1],
      [1,0,1,1,0,0,0,1,1,1,0,0,0,1,0,0,0,1,0,1],
      [1,1,1,1,1,7,1,1,1,1,1,1,1,1,5,1,1,1,1,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,1,0,0,1],
      [1,0,1,0,1,1,0,5,0,0,1,1,0,0,0,0,1,0,0,1],
      [1,0,1,0,2,0,0,0,0,0,0,1,0,2,0,0,0,1,0,1],
      [1,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,1],
      [1,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,3,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ],
  },
);
