levels.push(
  {
    name: 'THE FLOODGATE',
    totalCoins: 10,
    playerStart: { x: 46, y: 46 },
    enemies: [
      // Fire watcher: controls the central route to the top vault coin.
      { ...wp(3,11), w:28, h:28, speed:0.85, chaseSpeed:2.3, facing:'down', path:[wp(3,11), wp(5,11)] },
      // Water watcher: blocks the far bank and final coin until lured through the flood.
      { ...wp(7,16), w:28, h:28, speed:0.8, chaseSpeed:1.2, facing:'left', path:[wp(7,16), wp(7,17)] },
      // Lower patrol: pressures the long lower loop and lower water coins.
      { ...wp(13,2), w:28, h:28, speed:1.15, path:[wp(13,2), wp(13,10)] },
      // Entry patrol: makes the first route require timing.
      { ...wp(3,2), w:28, h:28, speed:1.05, path:[wp(3,2), wp(3,6)] },
    ],
    map: [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,2,0,0,0,1,1,1,1,0,2,1,1,1,0,2,0,1],
      [1,0,1,1,1,0,0,1,0,1,1,0,1,8,8,8,8,8,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,1,8,2,8,0,8,0,1],
      [1,1,1,0,1,0,1,1,0,1,1,0,1,8,8,8,0,8,0,1],
      [1,0,0,0,0,0,1,0,0,0,0,0,1,8,8,8,0,8,0,1],
      [1,0,1,1,1,0,1,0,1,5,5,5,1,8,2,8,0,8,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,8,8,8,0,2,3,1],
      [1,1,1,0,1,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1],
      [1,0,0,0,0,0,2,1,0,1,0,8,8,8,8,0,0,1,1,1],
      [1,0,1,1,1,1,0,1,0,1,0,8,1,1,8,1,0,1,1,1],
      [1,0,0,0,0,1,0,0,0,0,0,8,2,0,8,0,0,0,0,1],
      [1,0,1,1,0,1,1,1,1,1,0,8,1,0,8,1,1,1,0,1],
      [1,0,0,2,0,0,0,0,0,0,0,8,8,8,8,0,0,2,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ],
  },
);
