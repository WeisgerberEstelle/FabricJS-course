export default class Canvas {
  constructor(canvasId) {
    this.canvasId = canvasId;
  }

  InitCanvas() {
    return new fabric.Canvas(id, {
      width: 1300,
      height: 500,
    });
  }
}
