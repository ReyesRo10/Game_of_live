//Global Variables
const rows = 25;
const cols = 25;
let playing = false;
let grid = new Array(rows);
let nextGrid = new Array(rows);
let timer;
let generation = 0;
let reproductionTime = 200;

//Creating Elements
let gridContainer = document.querySelector(".gridContainer");
const startButton = document.querySelector(".start");
const clearButton = document.querySelector(".clear");
const randomButton = document.querySelector(".random");
const resetButton = document.querySelector(".reset");
const generationCount = document.querySelector(".generation_count");

//Start interface
//Create the grid using create element method
function createTable() {
  let table = document.createElement("table");

  for (let i = 0; i < rows; i++) {
    let tr = document.createElement("tr");
    for (let j = 0; j < cols; j++) {
      let cell = document.createElement("td");

      //Adding id numer for every single cell
      cell.setAttribute("id", i + "_" + j);
      //adding dead class atribute for every single cell
      cell.setAttribute("class", "dead");

      //calling cellclikc handler function
      cell.onclick = cellClickHandler;

      //adding the cell element to the tr element
      tr.appendChild(cell);
    }
    //adding row element to the table
    table.appendChild(tr);
  }
  //adding table to the grid container
  gridContainer.appendChild(table);
}

//Function that change the color of the cell when the user click an element
function cellClickHandler() {
  //get the position of each cell
  let rowcol = this.id.split("_");
  let row = rowcol[0];
  let col = rowcol[1];

  //get the current class for the element
  let classes = this.getAttribute("class");
  if (classes.indexOf("live") > -1) {
    this.setAttribute("class", "dead");
    grid[row][col] = 0;
  } else {
    this.setAttribute("class", "live");
    grid[row][col] = 1;
  }
}

//Update view of the table
function updateView() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let cell = document.getElementById(i + "_" + j);
      if (grid[i][j] == 0) {
        cell.setAttribute("class", "dead");
      } else {
        cell.setAttribute("class", "live");
      }
    }
  }
}
//End interface

//Start game logic
//Create a 2d array for storage the value of each cell
function initializeGrids() {
  for (let i = 0; i < rows; i++) {
    grid[i] = new Array(cols);
    nextGrid[i] = new Array(cols);
  }
}

//Put the value of all cell in zero
function resetGrids() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      grid[i][j] = 0;
      nextGrid[i][j] = 0;
    }
  }
}

//Swap the values between next grid and grid
function copyAndResetGrid() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      grid[i][j] = nextGrid[i][j];
      nextGrid[i][j] = 0;
    }
  }
}

//Start playing the game
function play() {
  generation++;
  generationCount.textContent = `Generation: ${generation}`;

  //create the next generation
  computeNextGen();

  if (playing) {
    timer = setTimeout(play, reproductionTime);
  }
}

//This function take one cell in the grid and passing it to applyRules function
function computeNextGen() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      applyRules(i, j);
    }
  }
  //copy nextGrid to grid, and reset nextGrid
  copyAndResetGrid();

  //copy all 1 values to "Live" in the table
  updateView();
}

//This function apply the game rules
function applyRules(row, col) {
  let numNeighbors = countNeighbors(row, col);
  if (grid[row][col] == 1) {
    if (numNeighbors < 2) {
      nextGrid[row][col] = 0;
    } else if (numNeighbors == 2 || numNeighbors == 3) {
      nextGrid[row][col] = 1;
    } else if (numNeighbors > 3) {
      nextGrid[row][col] = 0;
    }
  } else if (grid[row][col] == 0) {
    if (numNeighbors == 3) {
      nextGrid[row][col] = 1;
    }
  }
}

//This function count the neighbors of each cell
function countNeighbors(row, col) {
  let count = 0;
  if (row - 1 >= 0) {
    if (grid[row - 1][col] == 1) count++;
  }
  if (row - 1 >= 0 && col - 1 >= 0) {
    if (grid[row - 1][col - 1] == 1) count++;
  }
  if (row - 1 >= 0 && col + 1 < cols) {
    if (grid[row - 1][col + 1] == 1) count++;
  }
  if (col - 1 >= 0) {
    if (grid[row][col - 1] == 1) count++;
  }
  if (col + 1 < cols) {
    if (grid[row][col + 1] == 1) count++;
  }
  if (row + 1 < rows) {
    if (grid[row + 1][col] == 1) count++;
  }
  if (row + 1 < rows && col - 1 >= 0) {
    if (grid[row + 1][col - 1] == 1) count++;
  }
  if (row + 1 < rows && col + 1 < cols) {
    if (grid[row + 1][col + 1] == 1) count++;
  }
  return count;
}
//End Game logic

//Start Buttons functionality
//Start button
function startButtonHandler() {
  //Changin the text content of start button
  if (playing) {
    playing = false;
    startButton.textContent = "continue";
    //clearTimeout(timer);
  } else {
    playing = true;
    startButton.textContent = "Pause";
    //calling function play
    play();
  }
}

//Clear button
function clearButtonHandler() {
  //First pause the game before clear the board
  playing = false;
  startButton.textContent = "start";
  //get all cells with live class
  let cellsList = document.getElementsByClassName("live");

  //convert the cellsList into an array
  let cells = [];
  for (let i = 0; i < cellsList.length; i++) {
    cells.push(cellsList[i]);
  }
  //Adding class dead
  for (let i = 0; i < cells.length; i++) {
    cells[i].setAttribute("class", "dead");
  }
}

//random button
function randomButtonHandler() {
  //clean the board before create the random pattern
  clearButtonHandler();
  resetGrids();
  generation = 0;
  generationCount.textContent = `Generation: ${generation}`;
  //create random pattern
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let isLive = Math.round(Math.random());
      if (isLive == 1) {
        let cell = document.getElementById(i + "_" + j);
        cell.setAttribute("class", "live");
        grid[i][j] = 1;
      }
    }
  }
}

//Reset button
function resetButtonHandler() {
  clearButtonHandler();
  resetGrids();
  generation = 0;
  generationCount.textContent = `Generation: ${generation}`;
}
//End Buttons functionality

//Start with the page
function initialize() {
  createTable();
  initializeGrids();
  resetGrids();
}

//Use for start the initialize function
window.onload = initialize;

//Event listener
startButton.addEventListener("click", startButtonHandler);
clearButton.addEventListener("click", clearButtonHandler);
randomButton.addEventListener("click", randomButtonHandler);
resetButton.addEventListener("click", resetButtonHandler);
