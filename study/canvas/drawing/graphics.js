// using fabric.js
class Graphics {
  constructor(el, { width, height }) {
    this.elCanvas = el;
    this.canvas = null;
    this.objects = {};
    this.drawMode = TYPES.DRAW_MODE.SELECTION;
    this.selectionStyle = {
      selection: true,
      selectionColor: 'rgba(51,153,255, 0.25)',
      selectionBorderColor: 'rgba(51,153,255, 0.75)',
      selectionLineWidth: 1,
      selectionKey: 'shiftKey',
    };
    // this.canvas.setBackgroundImage(
    //   './twice.jpg',
    //   this.canvas.renderAll.bind(this.canvas)
    // );

    this.canvas = new fabric.Canvas(this.elCanvas, {
      enableRetinaScaling: false,
    });
    this.canvas.setWidth(width);
    this.canvas.setHeight(height);
    for (const k in this.selectionStyle) {
      this.canvas[k] = this.selectionStyle[k];
    }
  }
}
