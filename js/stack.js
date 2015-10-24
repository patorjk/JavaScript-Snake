/**
  * Finds a move that is in the direction of stacking off to the side.
  * currentDirection: the most recent direction moved by the snake.
  * grid: defined as in snakeAI.js
  * headCol, headRow: The head of the snake
  * foodCol, foodRow: The food location
  * returns: 0..3 depending on where the first move towards stacking off to the side is. View snakeAi.js for defintions of 0..3.
  */

function stackOff(currentDirection, grid, headRow,  headCol, foodRow, foodCol, snakeLength, recurseCounter) {
	// Direction to move
	var directionToMove = 0;
	console.log(headCol + " " + headRow);

	// Determine if we want to seek to an edge or stack
	var numBlocksByHead = 0;
	numBlocksByHead += (grid[headRow][headCol-1] > 0) ? 1 : 0;
	numBlocksByHead += (grid[headRow][headCol+1] > 0) ? 1 : 0;
	numBlocksByHead += (grid[headRow-1][headCol] > 0) ? 1 : 0;
	numBlocksByHead += (grid[headRow+1][headCol] > 0) ? 1 : 0;
	console.log("blocks by head:" + numBlocksByHead);	
	
	console.log("l" + grid[headRow][headCol-1]);
	console.log("r" + grid[headRow][headCol+1]);
	console.log("u" + grid[headRow-1][headCol]);
	console.log("d" + grid[headRow+1][headCol]);
	console.log("h" + grid[headRow][headCol]);

	
	console.log("direction: " + currentDirection);
	if (numBlocksByHead > 1) {
		console.log("stacking");
		// stack
		var turn = false;
		switch (currentDirection) {
			case 0:
				// Up
				if (grid[headRow - 1][headCol] > 0) {
					console.log("up occupied: " + grid[headRow - 1][headCol]);
					if (grid[headRow][headCol-1] <= 0) {
						console.log("Moving left: " + grid[headRow][headCol - 1]);
						directionToMove = 3;
					} else if (grid[headRow][headCol+1] <= 0) {
						directionToMove = 1;
					}
					turn = true;
				}
				break;
			case 1:
				// Right
				if (grid[headRow][headCol+1] > 0) {
					console.log("right occupied: " + grid[headRow][headCol+1]);
					if (grid[headRow+1][headCol] <= 0) {
						directionToMove = 2;
					} else if (grid[headRow-1][headCol] <= 0) {
						directionToMove = 0;
					}
					turn = true;
				}
				break;
			case 2:
				// Down
				if (grid[headRow+1][headCol] > 0) {
					console.log("down occupied: " + grid[headRow+1][headCol]);
					if (grid[headRow][headCol-1] <= 0) {
						console.log("Moving left: " + grid[headRow][headCol-1]);
						directionToMove = 3;
					} else if (grid[headRow][headCol+1] <= 0) {
						directionToMove = 1;
					}
					turn = true;
				}
				break;
			case 3:
				// Left
				if (grid[headRow][headCol-1] > 0) {
					console.log("left occupied: " + grid[headRow][headCol-1]);
					if (grid[headRow+1][headCol] <= 0) {
						directionToMove = 2;
					} else if (grid[headRow-1][headCol] <= 0) {
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
		//directionToMove = currentDirection;
		directionToMove = (currentDirection + 1) % 4;
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
	
	var deltaRow;
	var deltaColumn;
	if (directionToMove === 0) {
		deltaRow = 0;
		deltaColumn = -1;
	} else if (directionToMove === 1) {
		deltaRow = 1;
		deltaColumn = 0;
	} else if (directionToMove === 2) {
		deltaRow = 0;
		deltaColumn = 1;
	} else {
		deltaRow = -1;
		deltaColumn = 0;
	}
	console.log("plz");
	var lengthOfPath = floodFill(grid, headRow + deltaRow, headCol + deltaColumn);
	//numBlocksByHead = 0;
	//numBlocksByHead += (grid[headRow + deltaRow][headCol-1 + deltaColumn] > 0) ? 1 : 0;
	//numBlocksByHead += (grid[headRow + deltaRow][headCol+1 + deltaColumn] > 0) ? 1 : 0;
	//numBlocksByHead += (grid[headRow-1 + deltaRow][headCol + deltaColumn] > 0) ? 1 : 0;
	//numBlocksByHead += (grid[headRow+1 + deltaRow][headCol + deltaColumn] > 0) ? 1 : 0;
	console.log("Path Size: " + lengthOfPath + ", snake size: " + snakeLength);
	if (lengthOfPath < snakeLength && recurseCounter < 1) {
		console.log("Recursing due to possible trap");
		console.log("Want to move in direction: " + directionToMove);
		var date = new Date();
		var curDate = null
		//isPaused = true;
		//do {
		//	curDate = newDate();
		//} while (curDate - date < 100000);
		grid[headRow + deltaRow][headCol + deltaColumn] = 2;
		directionToMove = stackOff(currentDirection, grid, headRow, headCol, foodRow, foodCol, recurseCounter + 1);
		grid[headRow + deltaRow][headCol + deltaColumn] = 0;
	}
	console.log("Moving in direction: " + directionToMove);
	return directionToMove;
}
