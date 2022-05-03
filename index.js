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

const canvas = initCanvas("canvas");
let mousePressed = false;

setBackground(
  "https://www.consoglobe.com/wp-content/uploads/2021/11/chat-maison_2079791452_ban.jpg",
  canvas
);

//mouse:over

canvas.on("mouse:move", (event) => {
  //console.log('hi');
  if (mousePressed) {
    const mEvent = event.e;
    const delta = new fabric.Point(mEvent.movementX, mEvent.movementY);
    canvas.relativePan(delta);
  }
});

canvas.on("mouse:down", (event) => {
  mousePressed = true;
});

canvas.on("mouse:up", (event) => {
  mousePressed = false;
});
