levels.push(
  {
    name: 'THE GUARD HOUSE',
    totalCoins: 5,
    playerStart: { x: 46, y: 46 },
    enemies: [
      // Guard A — top corridor, horizontal patrol
      { ...wp(1,2),  w:28, h:28, speed:1.5, path:[wp(1,2),  wp(1,17)] },
      // Guard B — left edge, vertical patrol
      { ...wp(2,1),  w:28, h:28, speed:1.5, path:[wp(2,1),  wp(11,1)] },
      // Guard C — central corridor, rectangular loop
      { ...wp(3,8),  w:28, h:28, speed:1.2, path:[wp(3,8),  wp(3,10), wp(9,10), wp(9,8)] },
      // Guard D — bottom corridor, horizontal patrol
      { ...wp(11,2), w:28, h:28, speed:1.5, path:[wp(11,2), wp(11,17)] },
    ],
    map: [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],  // 0
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],  // 1: top patrol corridor (Guard A)
      [1,0,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,0,1],  // 2: room walls, col 1 & 18 open
      [1,0,1,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,1],  // 3: left room, central gap, right room
      [1,0,1,0,2,0,0,1,0,0,0,1,0,0,2,0,0,1,0,1],  // 4: coins at (4,4) and (4,14)
      [1,0,1,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,1],  // 5
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],  // 6: mid horizontal connector
      [1,0,1,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,1],  // 7
      [1,0,1,0,0,2,0,1,0,0,0,1,0,0,0,2,0,1,0,1],  // 8: coins at (8,5) and (8,15)
      [1,0,1,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,1],  // 9
      [1,0,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,0,1],  // 10: room walls close
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],  // 11: bottom patrol corridor (Guard D)
      [1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],  // 12: partial wall, col 18 open
      [1,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,3,1],  // 13: coin at (13,6), exit at (13,18)
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],  // 14
    ],
  },
);
