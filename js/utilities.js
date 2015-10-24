// Returns a point object, given where it is in the grid and what its value is.
 function pointOfGrid(endX, endY, pValue) {
 	var toReturn = {
 		x: endX,
 		y: endY,
 		visited: false,
 		value: pValue
 	};
 	return toReturn;
 }

// Returns a list of adjacent points, given a grid of Point objects, and a point object
function getAdjacent(gridPoints,point) {
	try {
		var adjTiles = [];
		var up = gridPoints[point.x][point.y + 1];
        if (up !== null && up.value <= 0) {
            adjTiles.push(up);
		}
		var down = gridPoints[point.x][point.y - 1];
        if (down !== null && down.value <= 0) {
            adjTiles.push(down);
		}
		var left = gridPoints[point.x - 1][point.y];
        if (left !== null && left.value <= 0) {
            adjTiles.push(left);
		}
        var right = gridPoints[point.x + 1][point.y];
        if (right !== null && right.value <= 0) {
            adjTiles.push(right);
		}
        return adjTiles;
	} catch(err) {
		return [];
	}

}

// g, h, f are used in astar
function g(obj) {
	return obj.list.length -1;
}

function h(obj,endX,endY) {
	return Math.sqrt(Math.pow((obj.point.x - endX), 2) + Math.pow(obj.point.y - endY, 2)); 
}

function f(obj,endX,endY) {
	return g(obj) + h(obj,endX,endY);
}

/**
  * Finds the shortest path from start to end using the A-Star algorithm.
  * grid: defined as in snakeAI.js
  * startX, startY: The head of the snake
  * endX, endY: The food location
  * snakeBody: A circular linked list of the snake body. View snakeAI.js for more info
  * returns: 0..3 depending on where the first move towards the goal from the start is. View snakeAI.js for what 0..3 correspond to.
  */
  
function astar(grid, startX, startY, endX, endY, snakeBody) {
	var gridPoints = [];
	for (var i = 0; i < grid.length; i++) {
		gridPoints.push([]);
		for(var j = 0; j < grid.length; j++){
			gridPoints[i].push(pointOfGrid(i,j, grid[i][j]));
		}
	}
	var first = {
		point:gridPoints[startX][startY],
		list:[gridPoints[startX][startY]],
	};
	first.point.visited = true;
	var processingList = [];
	processingList.push(first);
	while(processingList.length !== 0) {
		var current = processingList[0];
		var remove = 0;
		for (var i = 1; i < processingList.length; i++) {
			if (f(current, endX, endY) > f(processingList[i],endX, endY)) {
				current = processingList[i];
				remove = i;
			}
		}
		processingList.splice(remove,1);
		var adjacent = getAdjacent(gridPoints, current.point);
		for(var i =  0; i < adjacent.length; i++)
		{
			if(!adjacent[i].visited)
			{
				adjacent[i].visited = true;
				var newlist = current.list.slice();
				newlist.push(adjacent[i]);
				if (adjacent[i].x == endX && adjacent[i].y == endY) {
					var secondItem = newlist[1];
					if (secondItem.x > startX) 
						return 2;
					else if (secondItem.x < startX)
						return 0;
					else if (secondItem.y > startY)
						return 1;
					else
						return 3;
				}
				var addTo = {
					point: gridPoints[adjacent[i].x][adjacent[i].y],
					list: newlist
				};
				processingList.push(addTo);
			}
		}
	}
	console.log("A* has been executed and has been unable to find a path.");
	return null;
}