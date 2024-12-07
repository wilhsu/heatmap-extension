let timePassed = 0;
let isTracking = true; // Controls cursor tracking
let mouseAct = true; // Controls gradient rendering
let isExtensionActive = false; // Prevent rendering before activation
let currentCell = null;
let startTime = null;

// Cell tracking logic
const CELL_WIDTH = 50;

// Initialize 2D array to store time spent in each cell
const rows = Math.ceil(window.innerHeight / CELL_WIDTH);
const cols = Math.ceil(window.innerWidth / CELL_WIDTH);
const cellTimeData = Array.from({ length: rows }, () =>
  Array.from({ length: cols }, () => ({ hours: 0, minutes: 0, seconds: 0 }))
);

// Floating div setup
const floatingDiv = document.createElement("div");
floatingDiv.id = "timeTracker";
floatingDiv.style.position = "absolute";
floatingDiv.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
floatingDiv.style.color = "white";
floatingDiv.style.padding = "5px";
floatingDiv.style.borderRadius = "5px";
floatingDiv.style.display = "none";
floatingDiv.style.zIndex = "1000";
document.body.appendChild(floatingDiv);

function setup() {
  let h = document.body.clientHeight;
  newCanvas = createCanvas(windowWidth, h);
  newCanvas.position(0, 0);
  newCanvas.style("pointer-events", "none");
  newCanvas.style("z-index", "999"); // Ensure canvas is above other elements
  colorMode(RGB, 255, 255, 255, 1);
  gradientColors = {
        morning1: [
          color(252, 93, 255, 0.1),
          color(150, 255, 90, 0.2),
          color(255, 251, 0, 0.1),
          color(255, 151, 107, 0.2),          
        ],
        morning2: [
          color(252, 93, 255, 0.1),
          color(255, 151, 107, 0.2),
          color(255, 251, 0, 0.1),
          color(150, 255, 90, 0.2),
        ],
        morning3: [
          color(150, 255, 90, 0.2),
          color(255, 251, 0, 0.1),
          color(252, 93, 255, 0.1),
          color(255, 151, 107, 0.2),
        ],
        afternoon1: [
          color(114, 255, 255, 0.1),
          color(255, 195, 0, 0.1),
          color(255, 126, 62, 0.2),
          color(250, 109, 170, 0.2),
        ],
        afternoon2: [
          color(255, 126, 62, 0.1),
          color(255, 195, 0, 0.1),
          color(114, 255, 255, 0.1),
          color(250, 109, 170, 0.2),
        ],
        afternoon3: [
          color(255, 126, 62, 0.1),
          color(245, 51, 51, 0.2),
          color(255, 195, 0, 0.1),
          color(114, 255, 255, 0.1),
        ],
        night1: [
          color(91, 56, 180, 0.1),
          color(66, 98, 255, 0.2),
          color(255, 163, 58, 0.1),
          color(0, 10, 143, 0.2),
        ],
        night2: [
          color(0, 10, 143, 0.2),
          color(66, 98, 255, 0.2),
          color(255, 163, 58, 0.1),
          color(91, 56, 180, 0.1),
          
        ],
        night3: [
          color(66, 98, 255, 0.2),
          color(91, 56, 180, 0.1),
          color(0, 10, 143, 0.2),
          color(255, 163, 58, 0.1),
        ],
        midnight1: [
          color(67, 0, 63, 0.2),
          color(149, 0, 255, 0.2),
          color(72, 0, 255, 0.1),
          color(0, 3, 101, 0.1),
        ],
        midnight2: [
          color(72, 0, 255, 0.1),
          color(67, 0, 63, 0.2),
          color(149, 0, 255, 0.2),
          color(0, 3, 101, 0.1),
        ],
        midnight3: [
          color(67, 0, 63, 0.2),
          color(0, 3, 101, 0.1),
          color(72, 0, 255, 0.1),
          color(149, 0, 255, 0.2),
        ],
      };

  console.log("Canvas is setup");
}

function draw() {
  if (!isExtensionActive || !mouseAct) {
    clear();
    return;
  }

  background(255, 0, 0, 0);

  function currentGradientColor() {
  const hour = new Date().getHours();
  if (hour >= 2 && hour < 4) return gradientColors.midnight2;
  if (hour >= 4 && hour < 6) return gradientColors.midnight3;
  if (hour >= 6 && hour < 8) return gradientColors.morning1;
  if (hour >= 8 && hour < 10) return gradientColors.morning2;
  if (hour >= 10 && hour < 12) return gradientColors.morning3;
  if (hour >= 12 && hour < 14) return gradientColors.afternoon1;
  if (hour >= 14 && hour < 16) return gradientColors.afternoon2;
  if (hour >= 16 && hour < 18) return gradientColors.afternoon3;
  if (hour >= 18 && hour < 20) return gradientColors.night1;
  if (hour >= 20 && hour < 22) return gradientColors.night2;
  if (hour >= 22 && hour < 24) return gradientColors.night3;
  return gradientColors.midnight1;
}

  if (isTracking && mouseAct) {
        background(0, 0, 0, 0);
        const colors = currentGradientColor();
        fillGradient("radial", {
          from: [mouseX, mouseY, 0],
          to: [mouseX, mouseY, timePassed],
          steps: colors,
        });
        noStroke();
        ellipse(mouseX, mouseY, timePassed * 2);
        timePassed += 0.5;
  }
}

// Get cell from cursor position
function getCellFromPosition(x, y) {
  const row = Math.floor(y / CELL_WIDTH);
  const col = Math.floor(x / CELL_WIDTH);
  return { row, col };
}

// Update cell time
function updateCellTime(cell) {
  if (startTime && currentCell) {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const cellData = cellTimeData[currentCell.row][currentCell.col];
    cellData.seconds += elapsed;
    if (cellData.seconds >= 60) {
      cellData.minutes += Math.floor(cellData.seconds / 60);
      cellData.seconds %= 60;
    }
    if (cellData.minutes >= 60) {
      cellData.hours += Math.floor(cellData.minutes / 60);
      cellData.minutes %= 60;
    }
  }
  startTime = Date.now();
  currentCell = cell;
}

// Handle mouse movements
document.addEventListener("mousemove", (event) => {
  if (!isExtensionActive) return; // Ignore mouse events if extension is inactive

  const { row, col } = getCellFromPosition(event.clientX, event.clientY);
  const newCell = { row, col };

  if (isTracking) {
    if (!currentCell || currentCell.row !== row || currentCell.col !== col) {
      updateCellTime(newCell);
      timePassed = 0; // Reset orb size when cursor moves
    }
    floatingDiv.style.display = "none"; // Hide floating div during tracking
  } else {
    const cellData = cellTimeData[row][col];
    floatingDiv.textContent = `You have spent ${cellData.hours}h ${cellData.minutes}m ${cellData.seconds}s here`;
    floatingDiv.style.left = `${event.clientX + 20}px`;
    floatingDiv.style.top = `${event.clientY - 20}px`;
    floatingDiv.style.display = "block";
  }

  currentCell = newCell;
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "activateExtension") {
    isExtensionActive = true;
    console.log("Extension activated");
  } else if (message.action === "toggleTracking") {
    isTracking = message.value;
    console.log(`Cursor Tracking: ${isTracking ? "ON" : "OFF"}`);
  } else if (message.action === "toggleVisibility") {
    mouseAct = message.value;
    console.log(`Map Visibility: ${mouseAct ? "ON" : "OFF"}`);
  }
});

// Log 2D array periodically
setInterval(() => {
  if (isExtensionActive) {
    console.log("Cell Time Data:", cellTimeData);
  }
}, 5000);


// let timePassed = 0;
// let isTracking = true; // Controls cursor tracking
// let mouseAct = true; // Controls gradient rendering
// let isExtensionActive = false; // Prevent rendering before activation
// let currentCell = null;
// let startTime = null;

// // Cell tracking logic
// const CELL_WIDTH = 50;
// const CELL_WIDTH = 50;

// // Initialize 2D array to store time spent in each cell
// const rows = Math.ceil(window.innerHeight / CELL_WIDTH);
// const cols = Math.ceil(window.innerWidth / CELL_WIDTH);
// const cellTimeData = Array.from({ length: rows }, () =>
//   Array.from({ length: cols }, () => ({ hours: 0, minutes: 0, seconds: 0 }))
// );

// // Floating div setup
// const floatingDiv = document.createElement("div");
// floatingDiv.id = "timeTracker";
// floatingDiv.style.position = "absolute";
// floatingDiv.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
// floatingDiv.style.color = "white";
// floatingDiv.style.padding = "5px";
// floatingDiv.style.borderRadius = "5px";
// floatingDiv.style.display = "none";
// floatingDiv.style.zIndex = "100000"; // Ensure it's above other elements
// document.body.appendChild(floatingDiv);

// let gradientColors;

// function setup() {
//   console.log("Setting up canvas...");
//   const h = document.body.clientHeight;
//   newCanvas = createCanvas(windowWidth, h);
//   newCanvas.position(0, 0);
//   newCanvas.style("pointer-events", "none");
//   newCanvas.style("z-index", "999"); // Ensure canvas is above other elements
//   colorMode(RGB, 255, 255, 255, 1);

//   gradientColors = {
//     morning: [
//       color(255, 251, 0, 0.1),
//       color(150, 255, 90, 0.2),
//       color(252, 93, 255, 0.1),
//       color(255, 151, 107, 0.2),
//     ],
//     afternoon: [
//       color(255, 126, 62, 0.1),
//       color(245, 51, 51, 0.2),
//       color(255, 195, 0, 0.1),
//       color(250, 109, 170, 0.2),
//     ],
//     night: [
//       color(255, 163, 58, 0.1),
//       color(66, 98, 255, 0.2),
//       color(91, 56, 180, 0.1),
//       color(0, 10, 143, 0.2),
//     ],
//     midnight: [
//       color(0, 3, 101, 0.1),
//       color(149, 0, 255, 0.2),
//       color(72, 0, 255, 0.1),
//       color(67, 0, 63, 0.2),
//     ],
//   };
// }

// function draw() {
//   if (!isExtensionActive || (!mouseAct && isTracking)) {
//     clear();
//     return;
//   }

//   if (isTracking && mouseAct) {
//     background(0, 0, 0, 0);
//     const colors = currentGradientColor();
//     fillGradient("radial", {
//       from: [mouseX, mouseY, 0],
//       to: [mouseX, mouseY, timePassed],
//       steps: colors,
//     });
//     noStroke();
//     ellipse(mouseX, mouseY, timePassed * 2);
//     timePassed += 0.5;
//   }
// }

// function currentGradientColor() {
//   const hour = new Date().getHours();
//   if (hour >= 6 && hour < 12) return gradientColors.morning;
//   if (hour >= 12 && hour < 18) return gradientColors.afternoon;
//   if (hour >= 18 && hour < 24) return gradientColors.night;
//   return gradientColors.midnight;
// }

// function getCellFromPosition(x, y) {
//   const row = Math.floor(y / CELL_WIDTH);
//   const col = Math.floor(x / CELL_WIDTH);
//   return { row, col };
// }

// function updateCellTime(cell) {
//   if (startTime && currentCell) {
//     const elapsed = Math.floor((Date.now() - startTime) / 1000);
//     const cellData = cellTimeData[currentCell.row][currentCell.col];
//     cellData.seconds += elapsed;
//     if (cellData.seconds >= 60) {
//       cellData.minutes += Math.floor(cellData.seconds / 60);
//       cellData.seconds %= 60;
//     }
//     if (cellData.minutes >= 60) {
//       cellData.hours += Math.floor(cellData.minutes / 60);
//       cellData.minutes %= 60;
//     }
//   }
//   startTime = Date.now();
//   currentCell = cell;
// }

// document.addEventListener("mousemove", (event) => {
//   if (!isExtensionActive) return; // Ignore mouse events if extension is inactive

//   const { row, col } = getCellFromPosition(event.clientX, event.clientY);
//   const newCell = { row, col };

//   if (isTracking) {
//     if (!currentCell || currentCell.row !== row || currentCell.col !== col) {
//       updateCellTime(newCell);
//       timePassed = 0;
//     }
//     floatingDiv.style.display = "none";
//   } else {
//     const cellData = cellTimeData[row][col];
//     floatingDiv.textContent = `You have spent ${cellData.hours}h ${cellData.minutes}m ${cellData.seconds}s here`;
//     floatingDiv.style.left = `${event.clientX + 20}px`;
//     floatingDiv.style.top = `${event.clientY - 20}px`;
//     floatingDiv.style.display = "block";
//   }

//   currentCell = newCell;
// });

// chrome.runtime.onMessage.addListener((message) => {
//   if (message.action === "activateExtension") {
//     isExtensionActive = true;
//     console.log("Extension activated");
//   } else if (message.action === "toggleTracking") {
//     isTracking = message.value;
//     console.log(`Cursor Tracking: ${isTracking ? "ON" : "OFF"}`);
//     if (isTracking) floatingDiv.style.display = "none";
//   } else if (message.action === "toggleVisibility") {
//     mouseAct = message.value;
//     console.log(`Map Visibility: ${mouseAct ? "ON" : "OFF"}`);
//   }
// });

// // Log 2D array periodically
// setInterval(() => {
//   if (isExtensionActive) {
//     console.log("Cell Time Data:", cellTimeData);
//   }
// }, 5000);
