const mySnakeBoard = new SNAKE.Board({
  boardContainer: "game-area",
  fullScreen: true,
  premoveOnPause: false,
  onLengthUpdate: (length) => {
    console.log(`Length: ${length}`);
  },
  onPauseToggle: (isPaused) => {
    console.log(`Is paused: ${isPaused}`);
  },
  onInit: (params) => {
    console.log("init!");
    console.log(params);
  },
  onWin: () => {
    console.log("wn!");
  },
  onDeath: () => {
    console.log("dead!");
  },
});
