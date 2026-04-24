levels.push(
  {
    name: 'THE WATCH',
    totalCoins: 5,
    playerStart: { x: 46, y: 46 },
    enemies: [
      // Guard A — top corridor horizontal patrol
      { ...wp(1,2),  w:28, h:28, speed:1.2, chaseSpeed:2.5, path:[wp(1,2),  wp(1,17)] },
      // Guard B — right edge vertical patrol
      { ...wp(1,18), w:28, h:28, speed:1.2, chaseSpeed:2.5, path:[wp(1,18), wp(10,18)] },
      // Guard C — large outer rectangle loop
      { ...wp(4,1),  w:28, h:28, speed:1.0, chaseSpeed:2.5, path:[wp(4,1),  wp(4,18), wp(10,18), wp(10,1)] },
      // Guard D — exit approach patrol
      { ...wp(13,8), w:28, h:28, speed:1.2, chaseSpeed:2.5, path:[wp(13,8), wp(13,16)] },
    ],
    map: [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],  // 0
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],  // 1  player start at (1,1)
      [1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1],  // 2  corner pillars (hide spots)
      [1,0,1,0,0,2,0,0,0,0,0,0,0,0,2,0,0,1,0,1],  // 3  coins at (3,5) and (3,14)
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],  // 4  wide open (Guard C patrol row)
      [1,0,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,0,0,1],  // 5  T-wall tops
      [1,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,1],  // 6  alcove recesses
      [1,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,1],  // 7  central coin at (7,9)
      [1,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,1],  // 8  alcove recesses (mirror)
      [1,0,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,0,0,1],  // 9  T-wall bottoms (mirror)
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],  // 10 wide open (Guard C patrol row)
      [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],  // 11 single pillars
      [1,0,1,0,0,0,0,0,0,0,0,0,0,0,2,0,0,1,0,1],  // 12 coin at (12,14)
      [1,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1],  // 13 coin at (13,4), exit at (13,18)
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],  // 14
    ],
  },
);
