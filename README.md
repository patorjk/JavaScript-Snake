# JavaScript Snake Game

This is a DOM-based game of Snake that I wrote in JavaScript over a decade ago. It was made to have sort of a nostalgic feel to it.

## Play Game

http://patorjk.com/games/snake


## How to use
The index.html file should give an idea of how to use this code. However, below you can see how to initialize it into any div within a webpage.

    var mySnakeBoard = new SNAKE.Board( {
                                            boardContainer: "game-area",
                                            fullScreen: false,
                                            width: 580,
                                            height:400
                                        });
                                    
The comments within the source code are formatted a little strange because at the time I was playing around with YUI Doc which generates documentation from code. Kind of sucks that there's so much churn in the JavaScript world. However, I'm glad the rest of the code doesn't use any external libraries, as this game still works the same after over a decade.
