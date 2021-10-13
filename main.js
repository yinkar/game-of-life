
let config = {
    cell: {
      size: 16,
      color: 'rgb(0, 255, 255)'
    },
    world: {
      rowSize: null,
      colSize: null,
      color: 'rgb(30, 30, 30)',
      borderColor: 'rgb(75, 75, 75)',
      width: 640,
      height: 480
    },
    duration: 1000,
    paused: true,
    animationFps: 15
  };
  
  let startButton = null;
  
  let cellMatrix = [];
  let shadowCellMatrix = [];
  
  document.oncontextmenu = function() {return false;};
  
  let examplePattern = [
    [0, 0, 1, 1, 1],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [1, 0, 1, 0, 0],
    [0, 1, 1, 0, 0]
  ];
  
  function setup() {
    createCanvas(config.world.width, config.world.height);
  
    config.world.rowSize =  height / config.cell.size;
    config.world.colSize = width / config.cell.size;
    
    cellMatrix = resetCellMatrix(cellMatrix);
    shadowCellMatrix = resetCellMatrix(shadowCellMatrix);
    
    for (let i = 0, r = examplePattern.length; i < r; i++) {
      for (let j = 0, c = examplePattern[0].length; j < c; j++) {
        cellMatrix[
          parseInt(config.world.rowSize / 3) + i
        ][
          parseInt(config.world.colSize / 3) + j
        ] = examplePattern[i][j];
      }
    }
    
    frameRate(config.animationFps);
    
    startButton = createButton('Start');
    
    startButton.mousePressed(startStop);
  }
  
  function draw() {
    if (!config.paused) {
      era();
    }
    
    background(color(config.world.color));
    stroke(color(config.world.borderColor));
  
    for (let i = 0; i < config.world.rowSize; i++) {    
      for (let j = 0; j < config.world.colSize; j++) {
  
        fill(color(config.world.color));
  
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
      let positions = getCellPosition(mouseX, mouseY);
  
      if (
        positions.y >= 0 &&
        positions.y < config.world.rowSize &&
        positions.x >= 0 &&
        positions.x < config.world.colSize
      ) {
        if (mouseButton === LEFT) {
          cellMatrix[positions.y][positions.x] = 1;
        }
        else {
          cellMatrix[positions.y][positions.x] = 0;
        }
      }
    }
    
  }
  
  function getCellPosition(x, y) {
    return {
      x: parseInt(x / config.cell.size),
      y: parseInt(y / config.cell.size)
    }
  }
  
  function startStop() {
    config.paused = !config.paused;
    
    if (config.paused) {
      startButton.html('Start');
    }
    else {
      startButton.html('Stop');
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
  
  function mousePressed() {
    if (config.paused) {
      frameRate(60);
    }
  }
  
  function mouseReleased() {
    if (config.paused) {
      frameRate(config.animationFps);
    }
  }
  
  