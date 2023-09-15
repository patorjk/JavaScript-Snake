<!DOCTYPE html>
<html>
<head>
    <title>Sudoku Game</title>
    <style>
        table {
            border-collapse: collapse;
        }
        td {
            width: 30px;
            height: 30px;
            text-align: center;
            border: 1px solid #000;
            font-size: 20px;
        }
        input[type="number"] {
            width: 30px;
            height: 30px;
            text-align: center;
            font-size: 20px;
            border: none;
        }
        .readonly {
            background-color: #ccc;
        }
    </style>
</head>
<body>
    <h1>Sudoku Game</h1>
    <table>
        <tbody id="sudoku-board">
        </tbody>
    </table>
    <br>
    <button id="new-game">New Game</button>

    <script>
        const boardSize = 9;
        const boxSize = 3;
        let board = [];

        function createSudokuBoard() {
            const boardContainer = document.getElementById("sudoku-board");
            boardContainer.innerHTML = "";

            for (let i = 0; i < boardSize; i++) {
                const row = document.createElement("tr");
                board.push([]);
                for (let j = 0; j < boardSize; j++) {
                    const cell = document.createElement("td");
                    const input = document.createElement("input");
                    input.type = "number";
                    input.min = 1;
                    input.max = 9;
                    cell.appendChild(input);
                    row.appendChild(cell);
                    board[i].push(input);
                }
                boardContainer.appendChild(row);
            }
        }

        function generateSudoku() {
            // Code to generate a Sudoku puzzle goes here.
            // You can use Sudoku generation algorithms to create a puzzle.
            // For simplicity, you can pre-define a puzzle here.

            const puzzle = [
                [5, 3, 0, 0, 7, 0, 0, 0, 0],
                [6, 0, 0, 1, 9, 5, 0, 0, 0],
                [0, 9, 8, 0, 0, 0, 0, 6, 0],
                [8, 0, 0, 0, 6, 0, 0, 0, 3],
                [4, 0, 0, 8, 0, 3, 0, 0, 1],
                [7, 0, 0, 0, 2, 0, 0, 0, 6],
                [0, 6, 0, 0, 0, 0, 2, 8, 0],
                [0, 0, 0, 4, 1, 9, 0, 0, 5],
                [0, 0, 0, 0, 8, 0, 0, 7, 9]
            ];

            for (let i = 0; i < boardSize; i++) {
                for (let j = 0; j < boardSize; j++) {
                    if (puzzle[i][j] !== 0) {
                        board[i][j].value = puzzle[i][j];
                        board[i][j].readOnly = true;
                    } else {
                        board[i][j].value = "";
                        board[i][j].readOnly = false;
                    }
                }
            }
        }

        document.getElementById("new-game").addEventListener("click", () => {
            createSudokuBoard();
            generateSudoku();
        });

        createSudokuBoard();
        generateSudoku();
    </script>
</body>
</html>
