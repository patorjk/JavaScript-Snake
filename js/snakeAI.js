/**
  * Return the value corresponding to where to go
  * 	0: up
  *		1: right
  *		2: down
  *		3: left
  *       0
  *     3   1
  *		  2
  * currentDirection: The last direction moved
  */

function calculateMove(currentDirection) {
	currentDirection++;
	if (currentDirection == 4)
		currentDirection = 0;
	return currentDirection;
}