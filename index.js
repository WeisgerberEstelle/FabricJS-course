function initCanvas(id) {
  return new fabric.Canvas(id, {
    width: 1300,
    height: 500,
  });
}
function setCanvasColor(url, canvas) {
  canvas.setBackgroundColor({ source: url, repeat: "repeat" }, function () {
    canvas.renderAll();
  });
}
function setBackground(url, canvas) {
  fabric.Image.fromURL(
    url,
    (img) => {
      img.scaleX = 0.8;
      img.scaleY = 0.8;

      canvas.backgroundImage = img;
      canvas.renderAll();
    },
    { crossOrigin: "Anonymous" }
  );
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
      canvas.freeDrawingBrush = new fabric.SprayBrush(canvas);
      canvas.freeDrawingBrush.width = 15;
      currentMode = modes.drawing;
      canvas.isDrawingMode = true;
      canvas.renderAll();
    }
  }
}

function erase(canvas) {
  if (currentMode === modes.drawing) {
    canvas.freeDrawingBrush = new fabric.EraserBrush(canvas);
    canvas.freeDrawingBrush.width = 10;
  }
}

function draw(canvas) {
  if (currentMode === modes.drawing) {
    canvas.freeDrawingBrush = new fabric.SprayBrush(canvas);
    canvas.freeDrawingBrush.width = 15;
  }
}

function setPanEvents(canvas) {
  canvas.on("mouse:move", (event) => {
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

function setColorListener() {
  const picker = document.getElementById("colorPicker");
  picker.addEventListener("change", (event) => {
    color = event.target.value;

    canvas.freeDrawingBrush.color = color;
    canvas.renderAll();
  });
}
function setBgColorListener() {
  const picker = document.getElementById("colorPickerBg");
  picker.addEventListener("change", (event) => {
    color = event.target.value;

    canvas.setBackgroundColor(color, canvas.renderAll.bind(canvas));
    canvas.renderAll();
  });
}

function clearCanvas(canvas, state) {
  state.val = canvas.toSVG();
  canvas.getObjects().forEach((object) => {
    if (object !== canvas.backgroundImage) {
      canvas.remove(object);
    }
  });
}

function createRec(canvas) {
  const canvCenter = canvas.getCenter();
  const rect = new fabric.Rect({
    height: 100,
    width: 100,
    fill: "green",
    left: canvCenter.left,
    top: -50,
    originX: "center",
    originY: "center",
    cornerColor: "white",
    objectCaching: false,
  });
  canvas.add(rect);
  canvas.renderAll();
  rect.animate("top", canvCenter.top, {
    onChange: canvas.renderAll.bind(canvas),
  });
  rect.on("selected", () => {
    rect.set("fill", "lightgreen");
    canvas.renderAll();
  });
  rect.on("deselected", () => {
    rect.set("fill", "green");
    canvas.renderAll();
  });
}

function createCir(canvas) {
  const canvCenter = canvas.getCenter();
  const circle = new fabric.Circle({
    radius: 50,
    fill: "orange",
    left: canvCenter.left,
    top: -50,
    originX: "center",
    originY: "center",
    cornerColor: "white",
    objectCaching: false,
  });
  canvas.add(circle);
  canvas.renderAll();
  circle.animate("top", canvas.height - 50, {
    onChange: canvas.renderAll.bind(canvas),
    onComplete: () => {
      circle.animate("top", canvCenter.top, {
        onChange: canvas.renderAll.bind(canvas),
        duration: 200,
        easing: fabric.util.ease.easeOutBounce,
      });
    },
  });
  circle.on("selected", () => {
    circle.set("fill", "gold");
    canvas.requestRenderAll();
  });
  circle.on("deselected", () => {
    circle.set("fill", "orange");
    canvas.requestRenderAll();
  });
}
function groupObject(canvas, group, shouldGroup) {
  if (shouldGroup) {
    const objects = canvas.getObjects();
    group.val = new fabric.Group(objects, { cornerColor: "white" });
    clearCanvas(canvas, svgState);
    canvas.add(group.val);
    canvas.requestRenderAll();
  } else {
    group.val.destroy();
    const oldGroup = group.val.getObjects();
    clearCanvas(canvas, svgState);
    canvas.add(...oldGroup);
    group.val = null;
    canvas.requestRenderAll();
  }
}

function restoreCanvas(canvas, state, bgURL) {
  if (state.val) {
    fabric.loadSVGFromString(state.val, (objects) => {
      objects = objects.filter((o) => o["xlink:href"] !== bgURL);
      canvas.add(...objects);
      canvas.requestRenderAll();
    });
  }
}

function addText(canvas) {
  const textBox = new fabric.Textbox("Text here", { editable: true });
  canvas.add(textBox);
  canvas.requestRenderAll();
}

function imgAdded(event) {
  const inputImage = document.getElementById("myImage");
  const file = inputImage.files[0];
  reader.readAsDataURL(file);
}

function move(canvas, direction) {
  const activeObject = canvas.getActiveObject();
  try {
    if (direction === directions.right) {
      activeObject.left += 5;
    } else if (direction === directions.left) {
      activeObject.left -= 5;
    } else if (direction === directions.bottom) {
      activeObject.top += 5;
    } else if (direction === directions.top) {
      activeObject.top -= 5;
    }
    canvas.requestRenderAll();
  } catch (err) {
    throw "Please select an object : " + err.message;
  }
}
const canvas = initCanvas("canvas");

function changeBg(canvas, url) {
  canvas.setBackgroundColor({ source: url, repeat: "repeat" }, function () {
    canvas.renderAll();
  });
}

function deleteItems(canvas) {
  const activeObjects = canvas.getActiveObjects();
  activeObjects.forEach(function (object) {
    canvas.remove(object);
  });

  canvas.discardActiveObject();
  console.log(activeObjects);
  canvas.renderAll();
}

function selectAll(canvas) {
  canvas.discardActiveObject();
  var sel = new fabric.ActiveSelection(canvas.getObjects(), {
    canvas: canvas,
  });
  canvas.setActiveObject(sel);
  canvas.requestRenderAll();
}

setColorListener();
setBgColorListener();

let mousePressed = false;
let color = "#000000";
let group = {};
let svgState = {};
const bgURL =
  "https://www.consoglobe.com/wp-content/uploads/2021/11/chat-maison_2079791452_ban.jpg";
const cupcakesURL = "./assets/images/pattern-cupcakes.jpg";

const patterns = {
  cupcakes: "./assets/images/pattern-cupcakes.jpg",
  fish: "./assets/images/pattern-fish.png",
  flower: "./assets/images/pattern-flower.png",
  leaf: "./assets/images/pattern-leaf.png",
};
let currentMode;
const modes = {
  pan: "pan",
  drawing: "drawing",
};

const directions = {
  left: "left",
  right: "right",
  top: "top",
  bottom: "bottom",
};

const reader = new FileReader();
reader.addEventListener("load", () => {
  fabric.Image.fromURL(
    reader.result,
    (img) => {
      const canvCenter = canvas.getCenter();
      img.left = canvCenter.left;
      (img.originX = "center"), (img.scaleX = 0.5);
      img.scaleY = 0.5;
      canvas.add(img);
      canvas.requestRenderAll();
      img.animate("top", 100, {
        onChange: canvas.renderAll.bind(canvas),
        duration: 1000,
        easing: fabric.util.ease.easeOutBounce,
      });
    },
    { crossOrigin: "Anonymous" }
  );
});

//setBackground(bgURL, canvas);
setCanvasColor(cupcakesURL, canvas);

setPanEvents(canvas);

const inputImage = document.getElementById("myImage");
inputImage.addEventListener("change", imgAdded);

function saveImage(canvas) {
  canvas.toCanvasElement().toBlob(function (blob) {
    saveAs(blob, "myimg.png");
  });
}

// listen selected font
const fonts = document.querySelector(".fonts");
fonts.addEventListener("change", (event) => {
  // const result = document.querySelector(".result");
  // console.log(`You like ${event.target.value}`);
  canvas.getActiveObjects().filter(function (o) {
    if (o.get("type") === "textbox") {
      o.fontFamily = event.target.value;
    }
    canvas.renderAll();
  
  });
});
