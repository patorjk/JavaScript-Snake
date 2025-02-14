const mySnakeBoard = new SNAKE.Board({
  boardContainer: "game-area",
  fullScreen: true,
  premoveOnPause: false,
  moveSnakeWithAI: ({
                      grid,
                      snakeHead,
                      currentDirection,
                      isFirstGameMove,
                      setDirection,
                    }) => {

    /*
    Direction:
                0
              3   1
                2
     */

    // This is NOT a real hamiltonian cycle. It misses some values, I'm just including this here as an example of
    // a look-up type table that you could do.
    const hamiltonianCycleGrid = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0],
      [0, 0, 2, 3, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 0],
      [0, 0, 2, 0, 0, 3, 0, 2, 0, 2, 0, 2, 0, 2, 0],
      [0, 0, 2, 0, 2, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0],
      [0, 0, 3, 0, 3, 3, 3, 3, 0, 3, 0, 3, 0, 3, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]

    console.log(JSON.parse(JSON.stringify(grid)))
    console.log(snakeHead, currentDirection)

    const newDirection = hamiltonianCycleGrid[snakeHead.row][snakeHead.col];
    console.log(newDirection);
    setDirection(newDirection);
  },
  onLengthUpdate: (length) => {
    console.log(`Length: ${length}`);
  },
  onPauseToggle: (isPaused) => {
    console.log(`Is paused: ${isPaused}`);
  },
  onInit: (params) => {
    console.log("init!");
    console.log(params);
    params.startAIGame();
  },
  onWin: (params) => {
    console.log("win!");
    //params.startAIGame();
  },
  onDeath: (params) => {
    console.log("dead!");
    //params.startAIGame();
  },
});
