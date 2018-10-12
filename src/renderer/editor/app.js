const electron = require('electron');
const TYPES = require('../../common/types');
const copyToClipboard = require('../copyToClipboard');

const { ipcRenderer } = electron;
// const Konva = require('konva');  // TODO : error

// konva settings
Konva.pixelRatio = 1;

const TOOLBAR_SIZE = {
  HEIGHT: 30,
};

const Editor = {
  init(container) {
    this.backgroundSource = null;
    this.container = container;
    this.isDragStart = false;
    if (!this.container) {
      throw new Error('need container for initializing');
    }
    this.stage = new Konva.Stage({
      container: this.container,
      width: window.innerWidth,
      height: window.innerHeight - TYPES.TOOLBAR.SIZE.HEIGHT,
    });

    this.backgroundLayer = new Konva.Layer();
    this.layer = new Konva.Layer();
    this.dragLayer = new Konva.Layer();
    this.stage.add(this.backgroundLayer);
    this.stage.add(this.layer);
    this.stage.add(this.dragLayer);

    this.setDragEvent();
    this.setToolbar();
    this.addRect(); // TODO : remove

    this.stage.draw();
  },
  setDragEvent() {
    // bind stage handlers
    this.stage.on('mousedown', (evt) => {
      const keepGoing = this.setTransformer(evt.target);
      if (!keepGoing) {
        return;
      }
      const shape = evt.target;
      this.isDragStart = true;
      shape.moveTo(this.dragLayer);
      this.stage.draw();
      shape.startDrag();
    });

    this.stage.on('mousemove', (evt) => {
      if (!this.isDragStart) {
        return;
      }
      this.dragLayer.draw();
    });

    this.stage.on('mouseup', (evt) => {
      if (!this.isDragStart) {
        return;
      }
      const shape = evt.target;
      shape.moveTo(this.layer);
      this.stage.draw();
      this.isDragStart = false;
    });
  },
  setTransformer(target) {
    console.log(target.className);
    if (target === this.background) {
      console.log('background');
      this.stage.find('Transformer').destroy();
      this.layer.draw();
      return false;
    }

    if (target.parent && target.parent.className === 'Transformer') {
      return false;
    }
    this.stage.find('Transformer').destroy();
    const transformer = new Konva.Transformer({
      //all available options with their default values
      keepRatio: false,
      resizeEnabled: true,
      rotaionsSnaps: [],
      rotateHandlerOffset: 50,
    });
    this.layer.add(transformer);
    transformer.moveToTop();
    transformer.attachTo(target);
    this.layer.draw();
    return true;
  },
  setBackground(imagePath) {
    this.backgroundSource = imagePath;
    const imageObj = new Image();
    imageObj.onload = () => {
      this.background = new Konva.Image({
        x: 0,
        y: 0,
        image: imageObj,
        width: window.innerWidth,
        height: window.innerHeight - TYPES.TOOLBAR.SIZE.HEIGHT,
        draggable: false,
      });
      this.backgroundLayer.add(this.background);
      this.background.moveToBottom();
      this.backgroundLayer.draw();
    };
    imageObj.src = this.backgroundSource;
  },
  setToolbar() {
    this.setCopy();
    this.setRect();
  },
  setRect() {
    // TODO :
  },
  setCopy() {
    document.getElementById('copy').addEventListener('click', (e) => {
      copyToClipboard(this.stage)
        .then(() => {
          this.exit();
        })
        .catch(() => {
          this.exit();
        });
    });
  },
  exit() {
    ipcRenderer.send('close-editor-window');
  },
  setFreeDrawing() {
    const canvas = document.createElement('canvas');
    canvas.width = this.stage.width();
    canvas.height = this.stage.height();
    this.freeDrawingPanel = new Konva.Image({
      image: canvas,
      x: 0,
      y: 0,
    });
    this.layer.add(this.freeDrawingPanel);
    this.stage.draw();

    const context = canvas.getContext('2d');
    context.strokeStyle = '#df4b26';
    context.lineJoin = 'round';
    context.lineWidth = 5;

    let isPaint = false;
    let lastPointerPosition;
    let mode = 'brush';

    this.freeDrawingPanel.on('mousedown touchstart', () => {
      isPaint = true;
      lastPointerPosition = this.stage.getPointerPosition();
    });

    this.stage.addEventListener('mouseup touchend', () => {
      isPaint = false;
    });

    this.stage.addEventListener('mousemove touchmove', () => {
      if (!isPaint) {
        return;
      }

      if (mode === 'brush') {
        context.globalCompositeOperation = 'source-over';
      }
      if (mode === 'eraser') {
        context.globalCompositeOperation = 'destination-out';
      }
      context.beginPath();

      let localPos = {
        x: lastPointerPosition.x - this.freeDrawingPanel.x(),
        y: lastPointerPosition.y - this.freeDrawingPanel.y(),
      };
      context.moveTo(localPos.x, localPos.y);
      const pos = this.stage.getPointerPosition();
      localPos = {
        x: pos.x - this.freeDrawingPanel.x(),
        y: pos.y - this.freeDrawingPanel.y(),
      };
      context.lineTo(localPos.x, localPos.y);
      context.closePath();
      context.stroke();

      lastPointerPosition = pos;
      this.layer.batchDraw();
    });

    const select = document.getElementById('toolbar');
    select.addEventListener('change', function() {
      mode = select.value;
    });
  },
  addRect() {
    const box = new Konva.Rect({
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fill: 'transparent',
      stroke: 'red',
      strokeWidth: 4,
      draggable: true,
    });
    this.layer.add(box);
    // add cursor styling
    // box.on('mouseover', function() {
    //   document.body.style.cursor = 'pointer';
    // });
    // box.on('mouseout', function() {
    //   document.body.style.cursor = 'default';
    // });
  },
};

ipcRenderer.on(
  'display-editor',
  (event, displayInfo, imagePath, cropBoxData) => {
    Editor.init(document.getElementById('editor'));
    Editor.setBackground(imagePath);
  }
);
