/** TODO
 * - undo & redo
 * - register short cut - ctrl z, ctrl y, back space, esc
 */

const EDITOR_MODE = {
  SELECTION: 'selection',
  RECTANGLE: 'rectangle',
  FREE: 'free',
};
class DrawingEditor {
  constructor(id, options = {}) {
    this.el = document.getElementById(id);

    if (this.el.nodeName.toLowerCase() !== 'canvas') {
      throw new Error('element is not canvas');
    }
    this.graphics = new Graphics(this.el, { width: 1024, height: 768 });
    // this.addEventListener();
  }

  addEventListener() {
    // Toolbar
    const toolbar = document.getElementById('toolbar');
    toolbar.addEventListener('click', (e) => {
      const target = e.target;
      if (target.dataset.cmd === 'select') {
        this.changeMode(EDITOR_MODE.SELECTION);
      } else if (target.dataset.cmd === 'rectangle') {
        this.changeMode(EDITOR_MODE.RECTANGLE);
      } else if (target.dataset.cmd === 'free') {
        this.changeMode(EDITOR_MODE.FREE);
      }
    });
  }

  changeMode(mode) {
    const selectionStyle = {
      hasControls: true,
      hasBorders: true,
      hasRotatingPoint: true,
      visible: true,
      selectable: true,
      transparentCorners: true,
      centeredScaling: false,
      centeredRotation: true,
      cornerStyle: 'rect',
      cornerSize: 10,
      rotatingPointOffset: 25,
      cornerColor: 'rgb(51,153,255)',
      cornerStrokeColor: 'rgb(51,153,255)',
      lineWidth: 2,
      borderColor: 'rgb(51,153,255)',
    };
    if (mode === EDITOR_MODE.SELECTION) {
      console.log('select');
    } else if (mode === EDITOR_MODE.RECTANGLE) {
      console.log('rectangle');
      this.creatingObj = new fabric.Rect({
        ...selectionStyle,
        ...{
          left: 150,
          top: 100,
          fill: 'transparent',
          stroke: 'rgb(0, 0, 0)',
          width: 150,
          height: 250,
        },
      });
      this.canvas.add(this.creatingObj).setActiveObject(this.creatingObj);
    } else if (mode === EDITOR_MODE.FREE) {
      console.log('free');
    }
  }
}

const editor = new DrawingEditor('canvas');
