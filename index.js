//global variables
const rows = 25;
const cols = 25;
let playing = false;
let grid = new Array(rows);
let nextGrid = new Array(rows);
let timer;
let reproductionTime = 200;

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
//Initialize. Function to start the game
function initialize() {
  createTable();
  initializeGrids();
  resetGrids();
  setupControlButtons();
}

//lay out the board. Function to show the grid using create element method  and for loop inside another for loop
function createTable() {
  let gridContainer = document.getElementById("gridContainer");
  if (!gridContainer) {
    //throw error
    console.error("Problem: no div");
  }
  let table = document.createElement("table");

  for (let i = 0; i < rows; i++) {
    let tr = document.createElement("tr");
    for (let j = 0; j < cols; j++) {
      let cell = document.createElement("td");

      //Adding id numer for every single cell
      cell.setAttribute("id", i + "_" + j);
      //adding class atribute for every single cell
      cell.setAttribute("class", "dead");

      //calling cellclikc handle
      cell.onclick = cellClickHandler;

      //adding the sell element to the tr element
      tr.appendChild(cell);
    }
    //adding row element to the table
    table.appendChild(tr);
  }
  //adding table to the grid container
  gridContainer.appendChild(table);
}

//cellClickHandler. Function that change the color of the cell when the user click an element
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

//Button functionality
function setupControlButtons() {
  //setup for start button
  let = startButton = document.getElementById("start");
  startButton.onclick = startButtonHandler;

  //setup for clear button
  let clearButton = document.getElementById("clear");
  clearButton.onclick = clearButtonHandler;

  //Setup for random button
  let randomButton = document.getElementById("random");
  randomButton.onclick = randomButtonHandler;
}

//clear button functionality
function clearButtonHandler() {
  console.log("Clear");
  playing = false;
  let startButton = document.getElementById("start");
  startButton.innerHTML = "start";
  //clearTimeout(timer);
  let cellsList = document.getElementsByClassName("live");

  //convert the cellsList into an array
  let cells = [];
  for (let i = 0; i < cellsList.length; i++) {
    cells.push(cellsList[i]);
  }

  for (let i = 0; i < cells.length; i++) {
    cells[i].setAttribute("class", "dead");
  }

  //resetGrids(); //Resetea los valores a 0
}

//start button functionality
function startButtonHandler() {
  //Changin the text content of start button
  if (playing) {
    console.log("Pause the game");
    playing = false;
    this.innerHTML = "continue";
    //clearTimeout(timer);
  } else {
    console.log("Continue the game");
    playing = true;
    this.innerHTML = "Pause";
    play();
  }
}

//Random button
function randomButtonHandler() {
  if (playing) return;
  clearButtonHandler();
  resetGrids();
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      var isLive = Math.round(Math.random());
      if (isLive == 1) {
        var cell = document.getElementById(i + "_" + j);
        cell.setAttribute("class", "live");
        grid[i][j] = 1;
      }
    }
  }
}

function play() {
  console.log("Play the game");
  computeNextGen();

  if (playing) {
    timer = setTimeout(play, reproductionTime);
  }
}

//This function take one cell in the grid and passing it to applyRueles method
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
//Start everything
window.onload = initialize;
