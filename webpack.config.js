const webpack = require('webpack');

/*
	TODO: Idea here was to make it so the game could be accessible via codesandbox.io, however, it looks like 
	that will require larger charges than I realized.
*/

module.exports = {
	entry: {
		app: './js/snake.js'
	}
};
