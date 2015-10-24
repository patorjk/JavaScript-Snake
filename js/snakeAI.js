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
  * snakeBody: A circular linked list of the snake body. Access information as follows:
  *       snakeBody.b0 --- Gets the first node of the list
  *       node.row ------- Gets the row of the block
  *       node.col ------- Gets the col of the block
  *       node.next ------ Gets the next element of the linked list
  *       Note:            Because this is a circular linked list, the last
  *                        node points to the starting node, not Null).
  */

function calculateMove(currentDirection, grid, fRow, fCol, hRow, hCol, snakeBody) {
  return astar(grid, hRow, hCol, fRow, fCol);
  // TODO: Decide whether to do an A-Star for the fruit, or stack off to the side, call the corresponding function, and return its value.
  //       View utilities.js and snake.js for function params
}