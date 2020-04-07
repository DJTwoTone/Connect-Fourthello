//hardcoded width and height of the board
const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

//pushes an array representing the board to the hardcoded board
function makeBoard(height, width) {
  //creates the board array
  for (let h = 0; h < height; h++) {
    //creates rows
    const row = [];
    for (let w = 0; w < width; w++) {
      //adds place holders to each row
      row.push(null);
    }
    //add rows to the board
    board.push(row);
  }
  return board;
}

//creates an html representation of the hardcoded board

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.querySelector("#board");
  //creates the top table row used for selecting where to drop game pieces
  const top = document.createElement("tr");
  //adds the column-top id
  top.setAttribute("id", "column-top");
  //makes the top column clickable
  top.addEventListener("click", handleClick);

  //adds the WIDTH number of td cells
  for (let x = 0; x < WIDTH; x++) {
    //creates the cell
    const headCell = document.createElement("td");
    //gives the cell a numbered id
    headCell.setAttribute("id", x);
    // puts the cell in the row
    top.append(headCell);
  }
  // puts the top row on
  htmlBoard.append(top);

  // creates the HEIGHT number of rows
  for (let y = 0; y < HEIGHT; y++) {
    // creates a row
    const row = document.createElement("tr");
    // creates wIdth number of cells for each row
    for (let x = 0; x < WIDTH; x++) {
      // creates the cell
      const cell = document.createElement("td");
      // gives the cell the correct id for its position
      cell.setAttribute("id", `${y}-${x}`);
      // puts the cell in the row
      row.append(cell);
    }
    // puts the row on the board
    htmlBoard.append(row);
  }
}

//finds the lowest spot in the selected column to place a players piece

function findSpotForCol(x) {
  //return null if the column is full
  // TODO: write the real version of this, rather than always returning 0
  for (let i = HEIGHT - 1; i >= 0; i--) {
    if (board[i][x] === null) {
      return i;
    }
  }
}

//puts the player's piece in the hardcoded board

const placeInBoard = (y, x) => (board[y][x] = currPlayer);

//puts the player's peiece in the HTML representation

function placeInTable(y, x) {
  // makes a div and inserts piece into correct table cell
  const htmlBoard = document.querySelector("#board");
  const gamePiece = document.createElement("div");
  gamePiece.classList.add("piece", `p${currPlayer}`);
  const cell = document.getElementById(`${y}-${x}`);
  cell.append(gamePiece);
}

//announces a winner

function endGame() {
  const showWin = document.querySelector("#win-overlay");
  showWin.innerText = `Player-${currPlayer} WINS!`;
}

//announces a tie

function tieGame() {
  const showTie = document.querySelector("#tie-overlay");
  showTie.innerText = "YOU BOTH DISAPOINT ME!";
}

//handles players clicks

function handleClick(evt) {
  // get x from ID of clicked cell
  const x = +evt.target.id;
  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  placeInBoard(y, x);
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  if (checkFilledBoard()) {
    console.log("tie");
    tieGame();
  }
  // switch players

  // switches currPlayer 1 <-> 2
  switchPlayer();
}
//switch ? to if statement
//checks if every element in the board is not set to null
const checkFilledBoard = () =>
  board.flat().every((val) => {
    return val !== null;
  });

//switches betwwen player 1 and 2
function switchPlayer() {
  currPlayer === 1 ? currPlayer++ : currPlayer--;
  const oneIndicator = document.querySelector("#player-1");
  const twoIndicator = document.querySelector("#player-2");

  if (currPlayer === 2) {
    twoIndicator.classList.toggle("glow");
    oneIndicator.classList.toggle("glow");
  } else {
    oneIndicator.classList.toggle("glow");
    twoIndicator.classList.toggle("glow");
  }
}
//checks board cell-by-cell for "does a win start here?"

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  //read and understand this code. Add comments to help you.

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      //finds 4 matching horizontally
      const horiz = [
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3],
      ];
      //finds 4 matching vertically
      const vert = [
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x],
      ];
      //finds 4 matching diagonally to the right
      const diagDR = [
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3],
      ];
      //finds 4 matching diagonally to the left
      const diagDL = [
        [y, x],
        [y + 1, x - 1],
        [y + 2, x - 2],
        [y + 3, x - 3],
      ];
      //checks for all possible winning situations
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

//resets the board
function reset() {
  board = [];
  const showWin = document.querySelector("#win-overlay");
  showWin.innerText = "";
  const toResetBoard = document.querySelector("#board");
  toResetBoard.innerHTML = "";
  makeBoard(HEIGHT, WIDTH);
  makeHtmlBoard();
}

//handles a board reset
function handleReset() {
  const resetBtn = document.querySelector("#reset");
  resetBtn.addEventListener("click", reset);
}

// 3 strikes and you're out
let strikes = 0;
function dont() {
  if (strikes === 0) {
    alert("I TOLD YOU NOT TO!");
    strikes++;
  } else if (strikes === 1) {
    alert("WHAT DID I SAY?!? DON'T CLICK IT");
    strikes++;
  } else {
    alert("you were warned...");
    reset();
  }
}

//handles clicks on the don't button
function handleDont() {
  const dontBtn = document.querySelector("#dont");
  dontBtn.addEventListener("click", dont);
}

makeBoard(HEIGHT, WIDTH);
makeHtmlBoard();
handleReset();
handleDont();
