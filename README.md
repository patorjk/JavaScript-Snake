JavaScript Snake<br/>
Originaly By Patrick Gillespie<br/>
Now by<br/>
http://redstonermoves.com

This is a DOM-based game of Snake that I wrote in JavaScript a few years back.

Other than the full screen mode demonstrated in the code, it can also be 
initialized in div tags within a page. Example:

    var mySnakeBoard = new SNAKE.Board( {
                                            boardContainer: "game-area",
                                            fullScreen: false,
                                            width: 580,
                                            height:400
                                        });
                                    
The comments are formatted a little strange because at the time I was playing
around with YUI Doc.
