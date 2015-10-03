/**
  * Finds a move that is in the direction of stacking off to the side.
  * currentDirection: the most recent direction moved by the snake.
  * grid: defined as in snakeAI.js
  * startX, startY: The head of the snake
  * endX, endY: The food location
  * returns: 0..3 depending on where the first move towards stacking off to the side is. View snakeAi.js for defintions of 0..3.
  */

function stackOff(currentDirection, grid, startX, startY, endX, endY) {
	// Direction to move
	var directionToMove = 0;

	// Determine if we want to seek to an edge or stack
	var numBlocksByHead = 0;
	numBlocksByHead += (grid[startX][startY-1] > 0) ? 1 : 0;
	numBlocksByHead += (grid[startX][startY+1] > 0) ? 1 : 0;
	numBlocksByHead += (grid[startX-1][startY] > 0) ? 1 : 0;
	numBlocksByHead += (grid[startX+1][startY] > 0) ? 1 : 0;
	
	console.log("direction: " + currentDirection);
	if (numBlocksByHead > 1) {
		console.log("stacking");
		// stack
		var turn = false;
		switch (currentDirection) {
			case 0:
				// Up
				if (grid[startX][startY - 1] > 0) {
					console.log("up occupied: " + grid[startX][startY - 1]);
					if (grid[startX-1][startY] <= 0) {
						console.log("Moving left: " + grid[startX-1][startY]);
						directionToMove = 3;
					} else if (grid[startX+1][startY] <= 0) {
						directionToMove = 1;
					}
					turn = true;
				}
				break;
			case 1:
				// Right
				if (grid[startX+1][startY] > 0) {
					console.log("right occupied: " + grid[startX+1][startY]);
					if (grid[startX][startY+1] <= 0) {
						directionToMove = 2;
					} else if (grid[startX][startY-1] <= 0) {
						directionToMove = 0;
					}
					turn = true;
				}
				break;
			case 2:
				// Down
				if (grid[startX][startY + 1] > 0) {
					console.log("down occupied: " + grid[startX][startY + 1]);
					if (grid[startX-1][startY] <= 0) {
						console.log("Moving left: " + grid[startX-1][startY]);
						directionToMove = 3;
					} else if (grid[startX+1][startY] <= 0) {
						directionToMove = 1;
					}
					turn = true;
				}
				break;
			case 3:
				// Left
				if (grid[startX-1][startY] > 0) {
					console.log("left occupied: " + grid[startX-1][startY]);
					if (grid[startX][startY+1] <= 0) {
						directionToMove = 2;
					} else if (grid[startX][startY-1] <= 0) {
						directionToMove = 0;
					}
					turn = true;
				}
				break;
		}
		if (!turn) {
			console.log("Not changing direction in stack, moving: " + currentDirection);
			directionToMove = currentDirection;
		}
	} else {
		console.log("Seeking");
		// seek to the edge we came from
		directionToMove = currentDirection;
		//directionToMove = (currentDirection + 1) % 4;
	}
	
	// Seek to an edge
	// 	closest edge that is relatively free
	// 	return direction to move there
	//
	// 	better:
	// 		go back to the side we came from
	//
	//
	// Stack against the edge
	// 	if we are against an edge and next block is not an edge
	// 	if the next block is an edge, check left/right to figure out which to turn to
	//
	// 	better:
	// 		pick direction which is most open

	return directionToMove;
}
