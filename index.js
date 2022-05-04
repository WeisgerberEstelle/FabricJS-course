function initCanvas(id) {
  return new fabric.Canvas(id, {
    width: 500,
    height: 500,
  });
}

function setBackground(url, canvas) {
  fabric.Image.fromURL(url, (img) => {
    img.scaleX = 0.8;
    img.scaleY = 0.8;
    img.cropX = 370;

    canvas.backgroundImage = img;
    canvas.renderAll();
  });
}

function toggleMode(mode) {
  if (mode === modes.pan) {
    if (currentMode === modes.pan) {
      currentMode = "";
    } else {
      currentMode = modes.pan;
      canvas.isDrawingMode = false;
      canvas.renderAll();
    }
  } else if (mode === modes.drawing) {
    if (currentMode === modes.drawing) {
      currentMode = "";
      canvas.isDrawingMode = false;
      canvas.renderAll();
    } else {
      currentMode = modes.drawing;
      canvas.isDrawingMode = true;
      canvas.renderAll();
    }
  }
  console.log(currentMode);
}

function setPanEvents(canvas) {
  canvas.on("mouse:move", (event) => {
    //console.log();
    if (mousePressed && currentMode === modes.pan) {
      canvas.setCursor("grab");
      canvas.renderAll();
      const mEvent = event.e;
      const delta = new fabric.Point(mEvent.movementX, mEvent.movementY);
      canvas.relativePan(delta);
    } 
  });

  canvas.on("mouse:down", (event) => {
    mousePressed = true;
    if (mousePressed && currentMode === modes.pan) {
      canvas.setCursor("crosshair");
      canvas.renderAll();
    }
  });

  canvas.on("mouse:up", (event) => {
    mousePressed = false;
    canvas.setCursor("default");
    canvas.renderAll();
  });
}

const canvas = initCanvas("canvas");
let mousePressed = false;

let currentMode;
const modes = {
  pan: "pan",
  drawing: "drawing",
};

setBackground(
  "https://www.consoglobe.com/wp-content/uploads/2021/11/chat-maison_2079791452_ban.jpg",
  canvas
);

setPanEvents(canvas);
