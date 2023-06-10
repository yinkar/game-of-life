
let config = {
  cell: {
    size: 16,
    color: 'rgb(0, 255, 255)'
  },
  world: {
    rowSize: null,
    colSize: null,
    color: 'rgb(30, 30, 30)',
    pausedColor: 'rgb(45, 45, 45)',
    borderColor: 'rgb(75, 75, 75)',
    width: 640,
    height: 480
  },
  duration: 1000,
  paused: true,
  animationFps: 15
};

let startButton = null;
let clearButton = null;

let pencilButton = null;
let eraserButton = null;

let fpsSlider = null;

let cellMatrix = [];
let shadowCellMatrix = [];

let timer = null;

const TouchTool = {
  PENCIL: 0,
  ERASER: 1,
};

let touchActiveTool = TouchTool.PENCIL;

document.oncontextmenu = function() {
  return false;
};

let samplePattern = [
  [0, 0, 1, 1, 1],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0],
  [1, 0, 1, 0, 0],
  [0, 1, 1, 0, 0]
];

let checkPosition = null;
let activate = null;
let deactivate = null;
let toggle = null;

const checkMobile = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

function getCellPosition(x, y) {
  return {
    x: parseInt(x / config.cell.size),
    y: parseInt(y / config.cell.size)
  }
}

function setup() {
  if (windowWidth < 600) {
    config.world.width = 300;
    config.cell.size = 8;
  }

  createCanvas(config.world.width, config.world.height);

  config.world.rowSize =  int(height / config.cell.size);
  config.world.colSize = int(width / config.cell.size);

  cellMatrix = resetCellMatrix(cellMatrix);
  shadowCellMatrix = resetCellMatrix(shadowCellMatrix);

  for (let i = 0; i < samplePattern.length; i++) {
    for (let j = 0; j < samplePattern[0].length; j++) {
      cellMatrix[
        parseInt(config.world.rowSize / 3) + i
      ][
        parseInt(config.world.colSize / 3) + j
      ] = samplePattern[i][j];
    }
  }

  checkPosition = () => {
    let positions = getCellPosition(mouseX, mouseY);

    return (
      positions.y >= 0 &&
      positions.y < config.world.rowSize &&
      positions.x >= 0 &&
      positions.x < config.world.colSize
    );
  };

  activate = () => {
    let positions = getCellPosition(mouseX, mouseY);

    if (checkPosition()) {
      cellMatrix[positions.y][positions.x] = 1;
    }
  };

  deactivate = () => {
    let positions = getCellPosition(mouseX, mouseY);

    if (checkPosition()) {
      cellMatrix[positions.y][positions.x] = 0;
    }
  };

  toggle = () => {
    let positions = getCellPosition(mouseX, mouseY);
    if (checkPosition()) {
      if (mouseButton === LEFT) {
        cellMatrix[positions.y][positions.x] = 1;
      }
      else {
        cellMatrix[positions.y][positions.x] = 0;
      }
    }
  };

  frameRate(config.animationFps);

  startButton = createButton('Start');
  startButton.mousePressed(startStop);
  startButton.style('background-color', 'firebrick');
  startButton.style('font-size', '.8rem');

  clearButton = createButton('Clear');
  clearButton.mousePressed(clearCellMatrix);

  if (checkMobile()) {
    pencilButton = createButton('✏️');
    pencilButton.mousePressed(() => {
      touchActiveTool = TouchTool.PENCIL;
      pencilButton.style('background-color', 'crimson');
      eraserButton.style('background-color', 'firebrick');
    });
    pencilButton.style('background-color', 'crimson');
    pencilButton.style('font-size', '.8rem');
    pencilButton.style('border-radius', '50%');

    eraserButton = createButton('🧹');
    eraserButton.mousePressed(() => {
      touchActiveTool = TouchTool.ERASER;
      pencilButton.style('background-color', 'firebrick');
      eraserButton.style('background-color', 'crimson');
    });
    eraserButton.style('background-color', 'firebrick');
    eraserButton.style('font-size', '.8rem');
    eraserButton.style('border-radius', '50%');
  }
  
  fpsSlider = createSlider(0, 30, config.animationFps);
  fpsSlider.style('margin-left', '20px');
  fpsSlider.input(() => {
    config.animationFps = fpsSlider.value();
    frameRate(config.animationFps);
  });
}

function draw() {
  if (!config.paused) {
    era();
  }

  background(color(config.world.color));
  stroke(color(config.world.borderColor));

  for (let i = 0; i < config.world.rowSize; i++) {    
    for (let j = 0; j < config.world.colSize; j++) {

      if (config.paused) {
        fill(color(config.world.pausedColor));
      }
      else {
        fill(color(config.world.color));
      }

      if (cellMatrix[i][j] === 1) {
        fill(color(config.cell.color));
      }

      rect(
        j * config.cell.size, 
        i * config.cell.size, 
        config.cell.size, 
        config.cell.size
      );
    }
  }

  if (mouseIsPressed) {
    if (checkMobile()) return;
    toggle();
  }

}

function startStop() {
  config.paused = !config.paused;

  if (config.paused) {
    startButton.html('Start');
    startButton.style('background-color', 'firebrick');
  }
  else {
    startButton.html('Stop');
    startButton.style('background-color', 'rebeccapurple');
  }
}

function era() {
  shadowCellMatrix = resetCellMatrix(shadowCellMatrix);

  for (let i = 0; i < config.world.rowSize; i++) {    
    for (let j = 0; j < config.world.colSize; j++) {

      let neighbourCount = 0;

      if (cellMatrix[i-1] !== undefined) {
        if (cellMatrix[i-1][j-1] === 1) {
          neighbourCount++;
        }

        if (cellMatrix[i-1][j] === 1) {
          neighbourCount++;
        }

        if (cellMatrix[i-1][j+1] === 1) {
          neighbourCount++;
        }
      }

      if (cellMatrix[i][j-1] === 1) {
        neighbourCount++;
      }

      if (cellMatrix[i][j+1] === 1) {
        neighbourCount++;
      }

      if (cellMatrix[i+1] !== undefined) {
        if (cellMatrix[i+1][j-1] === 1) {
          neighbourCount++;
        }

        if (cellMatrix[i+1][j] === 1) {
          neighbourCount++;
        }

        if (cellMatrix[i+1][j+1] === 1) {
          neighbourCount++;
        }
      }


      if (cellMatrix[i][j] === 1 && [2, 3].includes(neighbourCount)) {
        shadowCellMatrix[i][j] = 1;
      }
      else if (cellMatrix[i][j] === 0 && neighbourCount === 3) {
        shadowCellMatrix[i][j] = 1;
      }
      else {
        shadowCellMatrix[i][j] = 0;
      }

    }
  }

  cellMatrix = shadowCellMatrix;
}

function resetCellMatrix(matrix) {
  matrix = [];
  for (let i = 0; i < config.world.rowSize; i++) {
    let row = [];

    for (let j = 0; j < config.world.colSize; j++) {
      row.push(0);
    }

    matrix.push(row);
  }

  return matrix;
}

function clearCellMatrix() {
    cellMatrix = resetCellMatrix(cellMatrix);

    // Stop animation
    config.paused = false;
    startStop();
}

function mousePressed() {
  if (checkMobile()) return;

  if (config.paused) {
    frameRate(60);
  }
}

function mouseReleased() {
  if (checkMobile()) return;

  if (config.paused) {
    frameRate(config.animationFps);
  }
}

function touchMoved() {
  if (touchActiveTool === TouchTool.PENCIL) {
    activate();
  }
  if (touchActiveTool === TouchTool.ERASER) {
    deactivate();
  }
}