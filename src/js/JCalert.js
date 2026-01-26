let score= 0;
let highScore= 0;

function gameOver (score) {
    if (score > highScore) {
        highScore = score;
        alert("New High Score!")
    }
}
