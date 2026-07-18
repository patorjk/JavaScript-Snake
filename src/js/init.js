// Reserve room for the on-screen gamepad (visible on touch devices only) so
// the board ends above it instead of underneath it. When the gamepad is
// hidden (desktop), offsetHeight is 0 and no space is reserved.
const gamepad = document.getElementById("snake-gamepad");
const gamepadOffset =
  gamepad && gamepad.offsetHeight
    ? Math.round(window.innerHeight - gamepad.getBoundingClientRect().top)
    : 0;

const mySnakeBoard = new SNAKE.Board({
  boardContainer: "game-area",
  fullScreen: true,
  bottomOffset: gamepadOffset,
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

// Wire up the on-screen gamepad shown on touch devices (markup in index.html).
document.querySelectorAll("#snake-gamepad button").forEach((btn) => {
  btn.addEventListener("pointerdown", (evt) => {
    evt.preventDefault();
    mySnakeBoard.simulateKeyPress(parseInt(btn.dataset.key, 10));
  });
});
