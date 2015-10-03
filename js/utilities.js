/**
  * Finds the shortest path from start to end using the A-Star algorithm.
  * grid: defined as in snakeAI.js
  * startX, startY: The head of the snake
  * endX, endY: The food location
  * returns: 0..3 depending on where the first move towards the goal from the start is. View snakeAI.js for what 0..3 correspond to.
  */

 function point(endX, endY, value) {
 	this.x = endX;
 	this.y = endY;
 	this.visited = false;
 	this.value = value;
 }

function getAdjacent(gridPoints,point) {
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
}

function g(obj) {
	return obj.list.length -1;
}

function h(obj,endX,endY) {
	return Math.sqrt(Math.pow((obj.point.x - endX), 2) + Math.pow(obj.point.y - endY, 2)); 
}

function f(obj,endX,endY) {
	return g(obj) + h(obj,endX,endY);
}
  
function astar(grid, startX, startY, endX, endY) {
	// TODO
	var gridPoints = [];
	for (var i = 0; i < grid.length; i++) {
		gridPoints.push([]);
		for(var j = 0; j < grid.length; j++){
			gridPoints[i].push(point(i,j));
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
		var adjacent = getAdjacent(gridPoints, current);
		for(var i =  0; i < adjacent.length; i++)
		{
			if(!adjacent[i].visited)
			{
				adjacent[i].visited = true;
				var newlist = current.list.splice();
				newlist.push(adjacent[i]);
				if (adjacent[i].x == endX && adjacent[i].y == endY) {
					var secondItem = newlist[1];
					if (secondItem.point.x > startX) 
						return 1;
					else if (secondItem.point.x < startX)
						return 3;
					else if (secondItem.point.y > startY)
						return 0;
					else
						return 2;
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
