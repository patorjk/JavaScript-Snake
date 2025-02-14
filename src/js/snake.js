/*
JavaScript Snake
First version by Patrick Gillespie - I've since merged in a good number of github pull requests
http://patorjk.com/games/snake
*/

/**
 * @module Snake
 * @class SNAKE
 */

// this will allow us to access the game in other JS files when the app is loaded up in a codesandbox.com sandbox, that's the only reason it's here
if (!window.SNAKE) {
  window.SNAKE = {};
}

/*
    Direction explained (0 = up, etc etc)
            0
          3   1
            2
*/
const MOVE_NONE = -1;
const MOVE_UP = 0;
const MOVE_LEFT = 3;
const MOVE_DOWN = 2;
const MOVE_RIGHT = 1;

const MIN_SNAKE_SPEED = 25;
const RUSH_INCR = 5;

const DEFAULT_SNAKE_SPEED = 80;

const BOARD_NOT_READY = 0;
const BOARD_READY = 1;
const BOARD_IN_PLAY = 2;

const HIGH_SCORE_KEY = "jsSnakeHighScore";

/**
 * @method addEventListener
 * @param {Object} obj The object to add an event listener to.
 * @param {String} event The event to listen for.
 * @param {Function} funct The function to execute when the event is triggered.
 * @param {Boolean} evtCapturing True to do event capturing, false to do event bubbling.
 */
SNAKE.addEventListener = (function () {
  if (window.addEventListener) {
    return function (obj, event, funct, evtCapturing) {
      obj.addEventListener(event, funct, evtCapturing);
    };
  } else if (window.attachEvent) {
    return function (obj, event, funct) {
      obj.attachEvent("on" + event, funct);
    };
  }
})();

/**
 * @method removeEventListener
 * @param {Object} obj The object to remove an event listener from.
 * @param {String} event The event that was listened for.
 * @param {Function} funct The function that was executed when the event is triggered.
 * @param {Boolean} evtCapturing True if event capturing was done, false otherwise.
 */

SNAKE.removeEventListener = (function () {
  if (window.removeEventListener) {
    return function (obj, event, funct, evtCapturing) {
      obj.removeEventListener(event, funct, evtCapturing);
    };
  } else if (window.detachEvent) {
    return function (obj, event, funct) {
      obj.detachEvent("on" + event, funct);
    };
  }
})();

/**
 * This class manages the snake which will reside inside of a SNAKE.Board object.
 * @class Snake
 * @constructor
 * @namespace SNAKE
 * @param {Object} config The configuration object for the class. Contains playingBoard (the SNAKE.Board that this snake resides in), startRow and startCol.
 */
SNAKE.Snake =
  SNAKE.Snake ||
  (function () {
    // -------------------------------------------------------------------------
    // Private static variables and methods
    // -------------------------------------------------------------------------

    const blockPool = [];

    const SnakeBlock = function () {
      this.elm = null;
      this.elmStyle = null;
      this.row = -1;
      this.col = -1;
      this.next = null;
      this.prev = null;
    };

    // this function is adapted from the example at http://greengeckodesign.com/blog/2007/07/get-highest-z-index-in-javascript.html
    function getNextHighestZIndex(myObj) {
      let highestIndex = 0,
        currentIndex = 0,
        ii;
      for (ii in myObj) {
        if (myObj[ii].elm.currentStyle) {
          currentIndex = parseFloat(myObj[ii].elm.style["z-index"], 10);
        } else if (window.getComputedStyle) {
          currentIndex = parseFloat(
            document.defaultView
              .getComputedStyle(myObj[ii].elm, null)
              .getPropertyValue("z-index"),
            10,
          );
        }
        if (!isNaN(currentIndex) && currentIndex > highestIndex) {
          highestIndex = currentIndex;
        }
      }
      return highestIndex + 1;
    }

    // -------------------------------------------------------------------------
    // Contructor + public and private definitions
    // -------------------------------------------------------------------------

    /*
      config options:
          playingBoard - the SnakeBoard that this snake belongs too.
          startRow - The row the snake should start on.
          startCol - The column the snake should start on.
          moveSnakeWithAI - function to move the snake with AI
  */
    return function (config) {
      if (!config || !config.playingBoard) {
        return;
      }
      if (localStorage[HIGH_SCORE_KEY] === undefined)
        localStorage.setItem(HIGH_SCORE_KEY, 0);

      // ----- private variables -----

      const me = this;
      const playingBoard = config.playingBoard;
      const growthIncr = 5;
      const columnShift = [0, 1, 0, -1];
      const rowShift = [-1, 0, 1, 0];
      let prevNode;

      let lastMove = 1,
        preMove = MOVE_NONE,
        isFirstGameMove = true,
        currentDirection = MOVE_NONE, // 0: up, 1: left, 2: down, 3: right
        snakeSpeed = DEFAULT_SNAKE_SPEED,
        isDead = false,
        isPaused = false;

      const modeDropdown = document.getElementById("selectMode");
      if (modeDropdown) {
        modeDropdown.addEventListener("change", function (evt) {
          evt = evt || {};
          let val = evt.target
            ? parseInt(evt.target.value)
            : DEFAULT_SNAKE_SPEED;

          if (isNaN(val)) {
            val = DEFAULT_SNAKE_SPEED;
          } else if (val < MIN_SNAKE_SPEED) {
            val = DEFAULT_SNAKE_SPEED;
          }

          snakeSpeed = val;

          setTimeout(function () {
            document.getElementById("game-area").focus();
          }, 10);
        });
      }

      // ----- public variables -----
      me.snakeBody = {};
      me.snakeBody["b0"] = new SnakeBlock(); // create snake head
      me.snakeBody["b0"].row = config.startRow || 1;
      me.snakeBody["b0"].col = config.startCol || 1;
      me.snakeBody["b0"].elm = createSnakeElement();
      me.snakeBody["b0"].elmStyle = me.snakeBody["b0"].elm.style;
      playingBoard.getBoardContainer().appendChild(me.snakeBody["b0"].elm);
      me.snakeBody["b0"].elm.style.left = getLeftPosition(me.snakeBody["b0"]);
      me.snakeBody["b0"].elm.style.top = getTopPosition(me.snakeBody["b0"]);
      me.snakeBody["b0"].next = me.snakeBody["b0"];
      me.snakeBody["b0"].prev = me.snakeBody["b0"];

      me.snakeLength = 1;
      me.snakeHead = me.snakeBody["b0"];
      me.snakeTail = me.snakeBody["b0"];
      me.snakeHead.elm.className = me.snakeHead.elm.className.replace(
        /\bsnake-snakebody-dead\b/,
        "",
      );
      me.snakeHead.elm.id = "snake-snakehead-alive";
      me.snakeHead.elm.className += " snake-snakebody-alive";

      // ----- private methods -----

      function getTopPosition(block) {
        const num = block.row * playingBoard.getBlockHeight();
        return `${num}px`;
      }

      function getLeftPosition(block) {
        const num = block.col * playingBoard.getBlockWidth();
        return `${num}px`;
      }

      function createSnakeElement() {
        const tempNode = document.createElement("div");
        tempNode.className = "snake-snakebody-block";
        tempNode.style.left = "-1000px";
        tempNode.style.top = "-1000px";
        tempNode.style.width = playingBoard.getBlockWidth() + "px";
        tempNode.style.height = playingBoard.getBlockHeight() + "px";
        return tempNode;
      }

      function createBlocks(num) {
        let tempBlock;
        const tempNode = createSnakeElement();

        for (let ii = 1; ii < num; ii++) {
          tempBlock = new SnakeBlock();
          tempBlock.elm = tempNode.cloneNode(true);
          tempBlock.elmStyle = tempBlock.elm.style;
          playingBoard.getBoardContainer().appendChild(tempBlock.elm);
          blockPool[blockPool.length] = tempBlock;
        }

        tempBlock = new SnakeBlock();
        tempBlock.elm = tempNode;
        playingBoard.getBoardContainer().appendChild(tempBlock.elm);
        blockPool[blockPool.length] = tempBlock;
      }

      function recordScore() {
        const highScore = localStorage[HIGH_SCORE_KEY];
        if (me.snakeLength > highScore) {
          alert(
            "Congratulations! You have beaten your previous high score, which was " +
              highScore +
              ".",
          );
          localStorage.setItem(HIGH_SCORE_KEY, me.snakeLength);
        }
      }

      function handleEndCondition(handleFunc) {
        recordScore();
        me.snakeHead.elm.style.zIndex = getNextHighestZIndex(me.snakeBody);
        me.snakeHead.elm.className = me.snakeHead.elm.className.replace(
          /\bsnake-snakebody-alive\b/,
          "",
        );
        me.snakeHead.elm.className += " snake-snakebody-dead";

        isDead = true;
        handleFunc();
      }

      // ----- public methods -----

      me.setPaused = function (val) {
        isPaused = val;
      };
      me.getPaused = function () {
        return isPaused;
      };

      /**
       * This method sets the snake direction
       * @param direction
       */
      me.setDirection = (direction) => {
        if (currentDirection !== lastMove) {
          // Allow a queue of 1 premove so you can turn again before the first turn registers
          preMove = direction;
        }
        if (Math.abs(direction - lastMove) !== 2 || isFirstGameMove) {
          // Prevent snake from turning 180 degrees
          currentDirection = direction;
          isFirstGameMove = false;
        }
      };

      /**
       * This method is called when a user presses a key. It logs arrow key presses in "currentDirection", which is used when the snake needs to make its next move.
       * @method handleArrowKeys
       * @param {Number} keyNum A number representing the key that was pressed.
       */
      /*
        Handles what happens when an arrow key is pressed.
        Direction explained (0 = up, etc etc)
                0
              3   1
                2
    */
      me.handleArrowKeys = function (keyNum) {
        if (isDead || (isPaused && !config.premoveOnPause)) {
          return;
        }

        let directionFound = MOVE_NONE;

        switch (keyNum) {
          case 37:
          case 65:
            directionFound = MOVE_LEFT;
            break;
          case 38:
          case 87:
            directionFound = MOVE_UP;
            break;
          case 39:
          case 68:
            directionFound = MOVE_RIGHT;
            break;
          case 40:
          case 83:
            directionFound = MOVE_DOWN;
            break;
        }
        me.setDirection(directionFound);
      };

      /**
       * This method is executed for each move of the snake. It determines where the snake will go and what will happen to it. This method needs to run quickly.
       * @method go
       */
      me.go = function () {
        const oldHead = me.snakeHead,
          newHead = me.snakeTail,
          grid = playingBoard.grid; // cache grid for quicker lookup

        if (isPaused === true) {
          setTimeout(function () {
            me.go();
          }, snakeSpeed);
          return;
        }

        // code to execute if snake is being moved by AI
        if (config.moveSnakeWithAI) {
          config.moveSnakeWithAI({
            grid,
            snakeHead: me.snakeHead,
            currentDirection,
            isFirstGameMove,
            setDirection: me.setDirection,
          });
        }

        me.snakeTail = newHead.prev;
        me.snakeHead = newHead;

        // clear the old board position
        if (grid[newHead.row] && grid[newHead.row][newHead.col]) {
          grid[newHead.row][newHead.col] = 0;
        }

        if (currentDirection !== MOVE_NONE) {
          lastMove = currentDirection;
          if (preMove !== MOVE_NONE) {
            // If the user queued up another move after the current one
            currentDirection = preMove; // Execute that move next time (unless overwritten)
            preMove = MOVE_NONE;
          }
        }

        newHead.col = oldHead.col + columnShift[lastMove];
        newHead.row = oldHead.row + rowShift[lastMove];

        if (!newHead.elmStyle) {
          newHead.elmStyle = newHead.elm.style;
        }

        newHead.elmStyle.left = getLeftPosition(newHead);
        newHead.elmStyle.top = getTopPosition(newHead);
        if (me.snakeLength > 1) {
          newHead.elm.id = "snake-snakehead-alive";
          oldHead.elm.id = "";
        }

        // check the new spot the snake moved into

        if (grid[newHead.row][newHead.col] === 0) {
          grid[newHead.row][newHead.col] = 1;
          setTimeout(function () {
            me.go();
          }, snakeSpeed);
        } else if (grid[newHead.row][newHead.col] > 0) {
          me.handleDeath();
        } else if (
          grid[newHead.row][newHead.col] === playingBoard.getGridFoodValue()
        ) {
          grid[newHead.row][newHead.col] = 1;
          if (!me.eatFood()) {
            me.handleWin();
            return;
          }
          setTimeout(function () {
            me.go();
          }, snakeSpeed);
        }
      };

      /**
       * This method is called when it is determined that the snake has eaten some food.
       * @method eatFood
       * @return {bool} Whether a new food was able to spawn (true)
       *   or not (false) after the snake eats food.
       */
      me.eatFood = function () {
        if (blockPool.length <= growthIncr) {
          createBlocks(growthIncr * 2);
        }
        const blocks = blockPool.splice(0, growthIncr);

        let ii = blocks.length,
          index;
        prevNode = me.snakeTail;
        while (ii--) {
          index = "b" + me.snakeLength++;
          me.snakeBody[index] = blocks[ii];
          me.snakeBody[index].prev = prevNode;
          me.snakeBody[index].elm.className =
            me.snakeHead.elm.className.replace(/\bsnake-snakebody-dead\b/, "");
          me.snakeBody[index].elm.className += " snake-snakebody-alive";
          prevNode.next = me.snakeBody[index];
          prevNode = me.snakeBody[index];
        }
        me.snakeTail = me.snakeBody[index];
        me.snakeTail.next = me.snakeHead;
        me.snakeHead.prev = me.snakeTail;

        if (!playingBoard.foodEaten()) {
          return false;
        }

        //Checks if the current selected option is that of "Rush"
        //If so, "increase" the snake speed
        const selectDropDown = document.getElementById("selectMode");
        const selectedOption =
          selectDropDown.options[selectDropDown.selectedIndex];

        if (selectedOption.text.localeCompare("Rush") == 0) {
          if (snakeSpeed > MIN_SNAKE_SPEED + RUSH_INCR) {
            snakeSpeed -= RUSH_INCR;
          }
        }

        return true;
      };

      /**
       * This method handles what happens when the snake dies.
       * @method handleDeath
       */
      me.handleDeath = function () {
        //Reset speed
        const selectedSpeed = document.getElementById("selectMode").value;
        snakeSpeed = parseInt(selectedSpeed);

        handleEndCondition(playingBoard.handleDeath);
      };

      /**
       * This method handles what happens when the snake wins.
       * @method handleDeath
       */
      me.handleWin = function () {
        handleEndCondition(playingBoard.handleWin);
      };

      /**
       * This method sets a flag that lets the snake be alive again.
       * @method rebirth
       */
      me.rebirth = function () {
        isDead = false;
        isFirstGameMove = true;
        preMove = MOVE_NONE;
      };

      /**
       * This method reset the snake so it is ready for a new game.
       * @method reset
       */
      me.reset = function () {
        if (isDead === false) {
          return;
        }

        const blocks = [];
        let curNode = me.snakeHead.next;
        let nextNode;

        while (curNode !== me.snakeHead) {
          nextNode = curNode.next;
          curNode.prev = null;
          curNode.next = null;
          blocks.push(curNode);
          curNode = nextNode;
        }
        me.snakeHead.next = me.snakeHead;
        me.snakeHead.prev = me.snakeHead;
        me.snakeTail = me.snakeHead;
        me.snakeLength = 1;

        for (let ii = 0; ii < blocks.length; ii++) {
          blocks[ii].elm.style.left = "-1000px";
          blocks[ii].elm.style.top = "-1000px";
          blocks[ii].elm.className = me.snakeHead.elm.className.replace(
            /\bsnake-snakebody-dead\b/,
            "",
          );
          blocks[ii].elm.className += " snake-snakebody-alive";
        }

        blockPool.concat(blocks);
        me.snakeHead.elm.className = me.snakeHead.elm.className.replace(
          /\bsnake-snakebody-dead\b/,
          "",
        );
        me.snakeHead.elm.className += " snake-snakebody-alive";
        me.snakeHead.elm.id = "snake-snakehead-alive";
        me.snakeHead.row = config.startRow || 1;
        me.snakeHead.col = config.startCol || 1;
        me.snakeHead.elm.style.left = getLeftPosition(me.snakeHead);
        me.snakeHead.elm.style.top = getTopPosition(me.snakeHead);
      };

      me.getSpeed = () => {
        return snakeSpeed;
      };
      me.setSpeed = (speed) => {
        snakeSpeed = speed;
      };

      // ---------------------------------------------------------------------
      // Initialize
      // ---------------------------------------------------------------------
      createBlocks(growthIncr * 2);
    };
  })();

/**
 * This class manages the food which the snake will eat.
 * @class Food
 * @constructor
 * @namespace SNAKE
 * @param {Object} config The configuration object for the class. Contains playingBoard (the SNAKE.Board that this food resides in).
 */

SNAKE.Food =
  SNAKE.Food ||
  (function () {
    // -------------------------------------------------------------------------
    // Private static variables and methods
    // -------------------------------------------------------------------------

    let instanceNumber = 0;

    function getRandomPosition(x, y) {
      return Math.floor(Math.random() * (y + 1 - x)) + x;
    }

    // -------------------------------------------------------------------------
    // Contructor + public and private definitions
    // -------------------------------------------------------------------------

    /*
      config options:
          playingBoard - the SnakeBoard that this object belongs too.
  */
    return function (config) {
      if (!config || !config.playingBoard) {
        return;
      }

      // ----- private variables -----

      const me = this;
      const playingBoard = config.playingBoard;
      let fRow, fColumn;
      const myId = instanceNumber++;

      const elmFood = document.createElement("div");
      elmFood.setAttribute("id", "snake-food-" + myId);
      elmFood.className = "snake-food-block";
      elmFood.style.width = playingBoard.getBlockWidth() + "px";
      elmFood.style.height = playingBoard.getBlockHeight() + "px";
      elmFood.style.left = "-1000px";
      elmFood.style.top = "-1000px";
      playingBoard.getBoardContainer().appendChild(elmFood);

      // ----- public methods -----

      /**
       * @method getFoodElement
       * @return {DOM Element} The div the represents the food.
       */
      me.getFoodElement = function () {
        return elmFood;
      };

      /**
       * Randomly places the food onto an available location on the playing board.
       * @method randomlyPlaceFood
       * @return {bool} Whether a food was able to spawn (true) or not (false).
       */
      me.randomlyPlaceFood = function () {
        // if there exist some food, clear its presence from the board
        if (
          playingBoard.grid[fRow] &&
          playingBoard.grid[fRow][fColumn] === playingBoard.getGridFoodValue()
        ) {
          playingBoard.grid[fRow][fColumn] = 0;
        }

        let row = 0,
          col = 0,
          numTries = 0;

        const maxRows = playingBoard.grid.length - 1;
        const maxCols = playingBoard.grid[0].length - 1;

        while (playingBoard.grid[row][col] !== 0) {
          row = getRandomPosition(1, maxRows);
          col = getRandomPosition(1, maxCols);

          // in some cases there may not be any room to put food anywhere
          // instead of freezing, exit out (and return false to indicate
          // that the player beat the game)
          numTries++;
          if (numTries > 20000) {
            return false;
          }
        }

        playingBoard.grid[row][col] = playingBoard.getGridFoodValue();
        fRow = row;
        fColumn = col;
        elmFood.style.top = row * playingBoard.getBlockHeight() + "px";
        elmFood.style.left = col * playingBoard.getBlockWidth() + "px";
        return true;
      };
    };
  })();

/**
 * This class manages playing board for the game.
 * @class Board
 * @constructor
 * @namespace SNAKE
 * @param {Object} config The configuration object for the class. Set fullScreen equal to true if you want the game to take up the full screen, otherwise, set the top, left, width and height parameters.
 */

SNAKE.Board =
  SNAKE.Board ||
  (function () {
    // -------------------------------------------------------------------------
    // Private static variables and methods
    // -------------------------------------------------------------------------

    let instanceNumber = 0;

    // this function is adapted from the example at http://greengeckodesign.com/blog/2007/07/get-highest-z-index-in-javascript.html
    function getNextHighestZIndex(myObj) {
      let highestIndex = 0,
        currentIndex = 0,
        ii;
      for (ii in myObj) {
        if (myObj[ii].elm.currentStyle) {
          currentIndex = parseFloat(myObj[ii].elm.style["z-index"], 10);
        } else if (window.getComputedStyle) {
          currentIndex = parseFloat(
            document.defaultView
              .getComputedStyle(myObj[ii].elm, null)
              .getPropertyValue("z-index"),
            10,
          );
        }
        if (!isNaN(currentIndex) && currentIndex > highestIndex) {
          highestIndex = currentIndex;
        }
      }
      return highestIndex + 1;
    }

    /*
      This function returns the width of the available screen real estate that we have
  */
    function getClientWidth() {
      let myWidth = 0;
      if (typeof window.innerWidth === "number") {
        myWidth = window.innerWidth; //Non-IE
      } else if (
        document.documentElement &&
        (document.documentElement.clientWidth ||
          document.documentElement.clientHeight)
      ) {
        myWidth = document.documentElement.clientWidth; //IE 6+ in 'standards compliant mode'
      } else if (
        document.body &&
        (document.body.clientWidth || document.body.clientHeight)
      ) {
        myWidth = document.body.clientWidth; //IE 4 compatible
      }
      return myWidth;
    }

    /*
      This function returns the height of the available screen real estate that we have
  */
    function getClientHeight() {
      let myHeight = 0;
      if (typeof window.innerHeight === "number") {
        myHeight = window.innerHeight; //Non-IE
      } else if (
        document.documentElement &&
        (document.documentElement.clientWidth ||
          document.documentElement.clientHeight)
      ) {
        myHeight = document.documentElement.clientHeight; //IE 6+ in 'standards compliant mode'
      } else if (
        document.body &&
        (document.body.clientWidth || document.body.clientHeight)
      ) {
        myHeight = document.body.clientHeight; //IE 4 compatible
      }
      return myHeight;
    }

    // -------------------------------------------------------------------------
    // Contructor + public and private definitions
    // -------------------------------------------------------------------------

    return function (inputConfig) {
      // --- private variables ---
      const me = this;
      const myId = instanceNumber++;
      const config = inputConfig || {};
      const MAX_BOARD_COLS = 250;
      const MAX_BOARD_ROWS = 250;
      const blockWidth = 20;
      const blockHeight = 20;
      const GRID_FOOD_VALUE = -1; // the value of a spot on the board that represents snake food; MUST BE NEGATIVE

      // defaults
      if (!config.onLengthUpdate) {
        config.onLengthUpdate = () => {};
      }

      if (!config.onPauseToggle) {
        config.onPauseToggle = () => {};
      }
      if (!config.onWin) {
        config.onWin = () => {};
      }
      if (!config.onDeath) {
        config.onDeath = () => {};
      }

      let myFood,
        mySnake,
        boardState = BOARD_READY, // 0: in active, 1: awaiting game start, 2: playing game
        myKeyListener,
        myWindowListener,
        isPaused = false; //note: both the board and the snake can be paused

      // Board components
      let elmContainer,
        elmPlayingField,
        elmAboutPanel,
        elmLengthPanel,
        elmHighscorePanel,
        elmWelcome,
        elmTryAgain,
        elmWin,
        elmPauseScreen;

      // --- public variables ---
      me.grid = [];

      // ---------------------------------------------------------------------
      // private functions
      // ---------------------------------------------------------------------

      function getStartRow() {
        return config.startRow || 2;
      }

      function getStartCol() {
        return config.startCol || 2;
      }

      function createBoardElements() {
        elmPlayingField = document.createElement("div");
        elmPlayingField.setAttribute("id", "playingField");
        elmPlayingField.className = "snake-playing-field";

        SNAKE.addEventListener(
          elmPlayingField,
          "click",
          function () {
            elmContainer.focus();
          },
          false,
        );

        elmPauseScreen = document.createElement("div");
        elmPauseScreen.className = "snake-pause-screen";
        elmPauseScreen.innerHTML =
          "<div style='padding:10px;'>[Paused]<p/>Press [space] to unpause.</div>";

        elmAboutPanel = document.createElement("div");
        elmAboutPanel.className = "snake-panel-component";
        elmAboutPanel.innerHTML =
          "<a href='http://patorjk.com/blog/software/' class='snake-link'>more patorjk.com apps</a> - <a href='https://github.com/patorjk/JavaScript-Snake' class='snake-link'>source code</a> - <a href='https://www.youtube.com/channel/UCpcCLm9y6CsjHUrCvJHYHUA' class='snake-link'>pat's youtube</a>";

        elmLengthPanel = document.createElement("div");
        elmLengthPanel.className = "snake-panel-component";
        elmLengthPanel.innerHTML = "Length: 1";

        elmHighscorePanel = document.createElement("div");
        elmHighscorePanel.className = "snake-panel-component";
        elmHighscorePanel.innerHTML =
          "Highscore: " + (localStorage[HIGH_SCORE_KEY] || 0);

        // if it's not AI, show the dialogs
        if (!config.moveSnakeWithAI) {
          elmWelcome = createWelcomeElement();
          elmTryAgain = createTryAgainElement();
          elmWin = createWinElement();
        }

        SNAKE.addEventListener(
          elmContainer,
          "keyup",
          function (evt) {
            if (!evt) evt = window.event;
            evt.cancelBubble = true;
            if (evt.stopPropagation) {
              evt.stopPropagation();
            }
            if (evt.preventDefault) {
              evt.preventDefault();
            }
            return false;
          },
          false,
        );

        elmContainer.className = "snake-game-container";

        elmPauseScreen.style.zIndex = 10000;
        elmContainer.appendChild(elmPauseScreen);
        elmContainer.appendChild(elmPlayingField);
        elmContainer.appendChild(elmAboutPanel);
        elmContainer.appendChild(elmLengthPanel);
        elmContainer.appendChild(elmHighscorePanel);

        // nothing to attach if using AI
        if (!config.moveSnakeWithAI) {
          elmContainer.appendChild(elmWelcome);
          elmContainer.appendChild(elmTryAgain);
          elmContainer.appendChild(elmWin);
        }

        mySnake = new SNAKE.Snake({
          playingBoard: me,
          startRow: getStartRow(),
          startCol: getStartCol(),
          premoveOnPause: config.premoveOnPause,
          moveSnakeWithAI: config.moveSnakeWithAI,
        });
        myFood = new SNAKE.Food({ playingBoard: me });

        if (elmWelcome) {
          elmWelcome.style.zIndex = 1000;
        }
      }

      function maxBoardWidth() {
        return MAX_BOARD_COLS * me.getBlockWidth();
      }

      function maxBoardHeight() {
        return MAX_BOARD_ROWS * me.getBlockHeight();
      }

      function createWelcomeElement() {
        const tmpElm = document.createElement("div");
        tmpElm.id = "sbWelcome" + myId;
        tmpElm.className = "snake-welcome-dialog";

        const welcomeTxt = document.createElement("div");
        let fullScreenText = "";
        if (config.fullScreen) {
          fullScreenText = "On Windows, press F11 to play in Full Screen mode.";
        }
        welcomeTxt.innerHTML =
          "JavaScript Snake<p></p>Use the <strong>arrow keys</strong> on your keyboard to play the game. " +
          fullScreenText +
          "<p></p>";
        const welcomeStart = document.createElement("button");
        welcomeStart.appendChild(document.createTextNode("Play Game"));

        const loadGame = function () {
          SNAKE.removeEventListener(window, "keyup", kbShortcut, false);
          tmpElm.style.display = "none";
          me.setBoardState(BOARD_READY);
          me.getBoardContainer().focus();
        };

        const kbShortcut = function (evt) {
          if (!evt) evt = window.event;
          const keyNum = evt.which ? evt.which : evt.keyCode;
          if (keyNum === 32 || keyNum === 13) {
            loadGame();
          }
        };

        SNAKE.addEventListener(window, "keyup", kbShortcut, false);
        SNAKE.addEventListener(welcomeStart, "click", loadGame, false);

        tmpElm.appendChild(welcomeTxt);
        tmpElm.appendChild(welcomeStart);
        return tmpElm;
      }

      function createGameEndElement(message, elmId, elmClassName) {
        const tmpElm = document.createElement("div");
        tmpElm.id = elmId + myId;
        tmpElm.className = elmClassName;

        const gameEndTxt = document.createElement("div");
        gameEndTxt.innerHTML = "JavaScript Snake<p></p>" + message + "<p></p>";
        const gameEndStart = document.createElement("button");
        gameEndStart.appendChild(document.createTextNode("Play Again?"));

        const reloadGame = function () {
          tmpElm.style.display = "none";
          me.resetBoard();
          me.setBoardState(BOARD_READY);
          me.getBoardContainer().focus();
        };

        const kbGameEndShortcut = function (evt) {
          if (boardState !== 0 || tmpElm.style.display !== "block") {
            return;
          }
          if (!evt) evt = window.event;
          const keyNum = evt.which ? evt.which : evt.keyCode;
          if (keyNum === 32 || keyNum === 13) {
            reloadGame();
          }
        };
        SNAKE.addEventListener(window, "keyup", kbGameEndShortcut, true);

        SNAKE.addEventListener(gameEndStart, "click", reloadGame, false);
        tmpElm.appendChild(gameEndTxt);
        tmpElm.appendChild(gameEndStart);
        return tmpElm;
      }

      function createTryAgainElement() {
        return createGameEndElement(
          "You died :(",
          "sbTryAgain",
          "snake-try-again-dialog",
        );
      }

      function createWinElement() {
        return createGameEndElement("You win! :D", "sbWin", "snake-win-dialog");
      }

      function handleEndCondition(elmDialog) {
        const index = Math.max(
          getNextHighestZIndex(mySnake.snakeBody),
          getNextHighestZIndex({ tmp: { elm: myFood.getFoodElement() } }),
        );
        if (elmDialog) {
          elmContainer.removeChild(elmDialog);
          elmContainer.appendChild(elmDialog);
          elmDialog.style.zIndex = index;
          elmDialog.style.display = "block";
        }
        me.setBoardState(BOARD_NOT_READY);
      }

      // ---------------------------------------------------------------------
      // public functions
      // ---------------------------------------------------------------------

      me.setPaused = function (val) {
        isPaused = val;
        mySnake.setPaused(val);
        if (isPaused) {
          elmPauseScreen.style.display = "block";
        } else {
          elmPauseScreen.style.display = "none";
        }
        config.onPauseToggle(isPaused);
      };
      me.getPaused = function () {
        return isPaused;
      };

      /**
       * Resets the playing board for a new game.
       * @method resetBoard
       */
      me.resetBoard = function () {
        SNAKE.removeEventListener(
          elmContainer,
          "keydown",
          myKeyListener,
          false,
        );
        SNAKE.removeEventListener(
          elmContainer,
          "visibilitychange",
          myWindowListener,
          false,
        );
        mySnake.reset();
        config.onLengthUpdate(1);
        elmLengthPanel.innerHTML = "Length: 1";
        me.setupPlayingField();
        me.grid[getStartRow()][getStartCol()] = 1; // snake head
      };
      /**
       * Gets the current state of the playing board. There are 3 states: 0 - Welcome or Try Again dialog is present. 1 - User has pressed "Start Game" on the Welcome or Try Again dialog but has not pressed an arrow key to move the snake. 2 - The game is in progress and the snake is moving.
       * @method getBoardState
       * @return {Number} The state of the board.
       */
      me.getBoardState = function () {
        return boardState;
      };
      /**
       * Sets the current state of the playing board. There are 3 states: 0 - Welcome or Try Again dialog is present. 1 - User has pressed "Start Game" on the Welcome or Try Again dialog but has not pressed an arrow key to move the snake. 2 - The game is in progress and the snake is moving.
       * @method setBoardState
       * @param {Number} state The state of the board.
       */
      me.setBoardState = function (state) {
        boardState = state;
      };
      /**
       * @method getGridFoodValue
       * @return {Number} A number that represents food on a number representation of the playing board.
       */
      me.getGridFoodValue = function () {
        return GRID_FOOD_VALUE;
      };
      /**
       * @method getPlayingFieldElement
       * @return {DOM Element} The div representing the playing field (this is where the snake can move).
       */
      me.getPlayingFieldElement = function () {
        return elmPlayingField;
      };
      /**
       * @method setBoardContainer
       * @param {DOM Element or String} myContainer Sets the container element for the game.
       */
      me.setBoardContainer = function (myContainer) {
        if (typeof myContainer === "string") {
          myContainer = document.getElementById(myContainer);
        }
        if (myContainer === elmContainer) {
          return;
        }
        elmContainer = myContainer;
        elmPlayingField = null;
        me.setupPlayingField();
        me.grid[getStartRow()][getStartCol()] = 1; // snake head
      };
      /**
       * @method getBoardContainer
       * @return {DOM Element}
       */
      me.getBoardContainer = function () {
        return elmContainer;
      };
      /**
       * @method getBlockWidth
       * @return {Number}
       */
      me.getBlockWidth = function () {
        return blockWidth;
      };
      /**
       * @method getBlockHeight
       * @return {Number}
       */
      me.getBlockHeight = function () {
        return blockHeight;
      };
      /**
       * Sets up the playing field.
       * @method setupPlayingField
       */
      me.setupPlayingField = function () {
        if (!elmPlayingField) {
          createBoardElements();
        } // create playing field

        // calculate width of our game container
        let cWidth, cHeight;
        let cTop, cLeft;
        if (config.fullScreen === true) {
          cTop = 0;
          cLeft = 0;
          cWidth = getClientWidth() - 20;
          cHeight = getClientHeight() - 20;
        } else {
          cTop = config.top;
          cLeft = config.left;
          cWidth = config.width;
          cHeight = config.height;
        }

        // define the dimensions of the board and playing field
        const wEdgeSpace =
          me.getBlockWidth() * 2 + (cWidth % me.getBlockWidth());
        const fWidth = Math.min(
          maxBoardWidth() - wEdgeSpace,
          cWidth - wEdgeSpace,
        );
        const hEdgeSpace =
          me.getBlockHeight() * 3 + (cHeight % me.getBlockHeight());
        const fHeight = Math.min(
          maxBoardHeight() - hEdgeSpace,
          cHeight - hEdgeSpace,
        );

        elmContainer.style.left = cLeft + "px";
        elmContainer.style.top = cTop + "px";
        elmContainer.style.width = cWidth + "px";
        elmContainer.style.height = cHeight + "px";
        elmPlayingField.style.left = me.getBlockWidth() + "px";
        elmPlayingField.style.top = me.getBlockHeight() + "px";
        elmPlayingField.style.width = fWidth + "px";
        elmPlayingField.style.height = fHeight + "px";

        // the math for this will need to change depending on font size, padding, etc
        // assuming height of 14 (font size) + 8 (padding)
        const bottomPanelHeight = hEdgeSpace - me.getBlockHeight();
        const pLabelTop =
          me.getBlockHeight() +
          fHeight +
          Math.round((bottomPanelHeight - 30) / 2) +
          "px";

        elmAboutPanel.style.top = pLabelTop;
        elmAboutPanel.style.width = "450px";
        elmAboutPanel.style.left =
          Math.round(cWidth / 2) - Math.round(450 / 2) + "px";

        elmLengthPanel.style.top = pLabelTop;
        elmLengthPanel.style.left = 30 + "px";

        elmHighscorePanel.style.top = pLabelTop;
        elmHighscorePanel.style.left = cWidth - 140 + "px";

        // if width is too narrow, hide the about panel
        if (cWidth < 700) {
          elmAboutPanel.style.display = "none";
        } else {
          elmAboutPanel.style.display = "block";
        }

        me.grid = [];
        const numBoardCols = fWidth / me.getBlockWidth() + 2;
        const numBoardRows = fHeight / me.getBlockHeight() + 2;

        for (let row = 0; row < numBoardRows; row++) {
          me.grid[row] = [];
          for (let col = 0; col < numBoardCols; col++) {
            if (
              col === 0 ||
              row === 0 ||
              col === numBoardCols - 1 ||
              row === numBoardRows - 1
            ) {
              me.grid[row][col] = 1; // an edge
            } else {
              me.grid[row][col] = 0; // empty space
            }
          }
        }

        myFood.randomlyPlaceFood();
        config.onLengthUpdate(1);

        myKeyListener = function (evt) {
          if (!evt) evt = window.event;
          const keyNum = evt.which ? evt.which : evt.keyCode;

          if (me.getBoardState() === BOARD_READY) {
            if (
              !(keyNum >= 37 && keyNum <= 40) &&
              !(
                keyNum === 87 ||
                keyNum === 65 ||
                keyNum === 83 ||
                keyNum === 68
              )
            ) {
              return;
            } // if not an arrow key, leave

            // This removes the listener added at the #listenerX line
            SNAKE.removeEventListener(
              elmContainer,
              "keydown",
              myKeyListener,
              false,
            );
            SNAKE.removeEventListener(
              elmContainer,
              "visibilitychange",
              myWindowListener,
              false,
            );

            myKeyListener = function (evt) {
              if (!evt) evt = window.event;
              const keyNum = evt.which ? evt.which : evt.keyCode;

              if (keyNum === 32) {
                if (me.getBoardState() != BOARD_NOT_READY)
                  me.setPaused(!me.getPaused());
              }

              mySnake.handleArrowKeys(keyNum);

              evt.cancelBubble = true;
              if (evt.stopPropagation) {
                evt.stopPropagation();
              }
              if (evt.preventDefault) {
                evt.preventDefault();
              }
              return false;
            };

            //listener for pausing the game if user change tab or minimize the browser window
            document.addEventListener("visibilitychange", () => {
              if (document.visibilityState === "hidden") {
                if (me.getBoardState() != BOARD_NOT_READY && !me.getPaused())
                  me.setPaused(true);
              }
            });

            SNAKE.addEventListener(
              elmContainer,
              "keydown",
              myKeyListener,
              false,
            );
            SNAKE.addEventListener(
              elmContainer,
              "visibilitychange",
              myWindowListener,
              false,
            );

            mySnake.rebirth();
            mySnake.handleArrowKeys(keyNum);
            me.setBoardState(BOARD_IN_PLAY); // start the game!
            mySnake.go();
          }

          evt.cancelBubble = true;
          if (evt.stopPropagation) {
            evt.stopPropagation();
          }
          if (evt.preventDefault) {
            evt.preventDefault();
          }
          return false;
        };

        // Search for #listenerX to see where this is removed
        if (!config.moveSnakeWithAI) {
          SNAKE.addEventListener(elmContainer, "keydown", myKeyListener, false);
          SNAKE.addEventListener(
            elmContainer,
            "visibilitychange",
            myWindowListener,
            false,
          );
        }
      };

      /**
       * This method is called when the snake has eaten some food.
       * @method foodEaten
       * @return {bool} Whether a new food was able to spawn (true)
       *   or not (false) after the snake eats food.
       */
      me.foodEaten = function () {
        config.onLengthUpdate(mySnake.snakeLength);
        elmLengthPanel.innerHTML = "Length: " + mySnake.snakeLength;
        if (mySnake.snakeLength > localStorage[HIGH_SCORE_KEY]) {
          localStorage.setItem(HIGH_SCORE_KEY, mySnake.snakeLength);
          elmHighscorePanel.innerHTML =
            "Highscore: " + localStorage[HIGH_SCORE_KEY];
        }
        if (!myFood.randomlyPlaceFood()) {
          return false;
        }
        return true;
      };

      /**
       * This method is called when the snake dies.
       * @method handleDeath
       */
      me.handleDeath = function () {
        handleEndCondition(elmTryAgain);
        config.onDeath({ startAIGame: me.startAIGame });
      };

      /**
       * This method is called when the snake wins.
       * @method handleWin
       */
      me.handleWin = function () {
        handleEndCondition(elmWin);
        config.onWin({ startAIGame: me.startAIGame });
      };

      me.setSpeed = (speed) => {
        mySnake.setSpeed(speed);
      };
      me.getSpeed = () => {
        return mySnake.getSpeed();
      };

      me.startAIGame = () => {
        me.resetBoard();
        mySnake.rebirth();
        me.setBoardState(BOARD_IN_PLAY); // start the game!
        mySnake.go();
      };

      // ---------------------------------------------------------------------
      // Initialize
      // ---------------------------------------------------------------------

      config.fullScreen =
        typeof config.fullScreen === "undefined" ? false : config.fullScreen;
      config.top = typeof config.top === "undefined" ? 0 : config.top;
      config.left = typeof config.left === "undefined" ? 0 : config.left;
      config.width = typeof config.width === "undefined" ? 400 : config.width;
      config.height =
        typeof config.height === "undefined" ? 400 : config.height;
      config.premoveOnPause =
        typeof config.premoveOnPause === "undefined"
          ? false
          : config.premoveOnPause;

      if (config.fullScreen) {
        SNAKE.addEventListener(
          window,
          "resize",
          function () {
            me.setupPlayingField();
          },
          false,
        );
      }

      me.setBoardState(BOARD_NOT_READY);

      if (config.boardContainer) {
        me.setBoardContainer(config.boardContainer);
      }

      const reloadGame = function () {
        me.resetBoard();
        me.setBoardState(BOARD_READY);
        me.getBoardContainer().focus();
      };

      if (config.onInit) {
        config.onInit({
          reloadGame,
          getSpeed: me.getSpeed,
          setSpeed: me.setSpeed,
          startAIGame: me.startAIGame,
        });
      }
    }; // end return function
  })();
