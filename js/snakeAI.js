/**
  * Return the value corresponding to where to go
  * 	0: up
  *		1: right
  *		2: down
  *		3: left
  *       0
  *     3   1
  *	      2
  * currentDirection: The last direction moved
  * grid: A 2 dimensional grid corresponding to where things are
  * format is grid[row][col] - I THINK grid[0][0] is the top left of the grid.
  *       0: Empty space
  *       1: Edge of grid OR Snake (basically, somewhere we do not want to be).
  *       -1: Food
  * fRow: The row that the food is at
  * fCol: The column the food is at
  * hRow: The row where the head is at
  * hCol: The column where the head is at
  */

function calculateMove(currentDirection, grid, fRow, fCol, hRow, hCol) {
  // This algorithm simply causes the sanke to go in a circle
	currentDirection++;
	if (currentDirection == 4)
		currentDirection = 0;
	return currentDirection;

  // TODO: Decide whether to do an A-Star for the fruit, or stack off to the side, call the corresponding function, and return its value.
  //       View utilities.js and snake.js for function params
}