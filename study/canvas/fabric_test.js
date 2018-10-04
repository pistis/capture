// const canvas = new fabric.Canvas('canvas');
// canvas.add(
//   new fabric.Circle({ radius: 30, fill: '#f55', top: 100, left: 100 })
// );

// canvas.item(0).set({
//   borderColor: 'red',
//   cornerColor: 'green',
//   cornerSize: 6,
//   transparentCorners: false,
// });
// canvas.setActiveObject(canvas.item(0));

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
    options = {
      ...options,
      ...{
        width: 1024,
        height: 768,
      },
    };
    this.canvas = new fabric.Canvas(this.el);
    this.canvas.setWidth(options.width);
    this.canvas.setHeight(options.height);

    // selection
    this.canvas.selection = true;
    this.canvas.selectionColor = 'rgba(51,153,255, 0.25)';
    this.canvas.selectionBorderColor = 'rgba(51,153,255, 0.75)';
    this.canvas.selectionLineWidth = 1;
    this.canvas.selectionKey = 'shiftKey';
    this.canvas.setBackgroundImage(
      './twice.jpg',
      this.canvas.renderAll.bind(this.canvas)
    );

    this.mode = EDITOR_MODE.SELECTION;

    this.addEventListener();
  }

  addEventListener() {
    // mouse:down
    // mouse:move
    // mouse:up
    // mouse:down:before
    // mouse:move:before
    // mouse:up:before
    this.canvas.on('mouse:down:before', (e) => {
      //   console.log('mouse:down:before', e);
    });
    this.canvas.on('mouse:move:before', (e) => {
      //   console.log('mouse:move:before', e);
    });
    this.canvas.on('mouse:up:before', (e) => {
      //   console.log('mouse:up:before', e);
    });
    this.canvas.on('mouse:down', (e) => {
      //   console.log('mouse:down', e);
    });
    this.canvas.on('mouse:move', (e) => {
      //   console.log('mouse:move', e);
    });
    this.canvas.on('mouse:up', (e) => {
      //   console.log('mouse:up', e);
    });
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
    if (mode === EDITOR_MODE.SELECTION) {
      console.log('select');
    } else if (mode === EDITOR_MODE.RECTANGLE) {
      console.log('rectangle');
      this.creatingObj = new fabric.Rect({
        left: 150,
        top: 100,
        fill: 'transparent',
        stroke: 'rgb(0, 0, 0)',
        width: 150,
        height: 250,
      });
      this.canvas.add(this.creatingObj);
    } else if (mode === EDITOR_MODE.FREE) {
      console.log('free');
    }
  }
}

const editor = new DrawingEditor('canvas');
