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
  initEditor(imagePath, cropBoxData) {
    this.backgroundSource = imagePath;
    this.stage = new Konva.Stage({
      container: 'editor',
      width: window.innerWidth,
      height: window.innerHeight - TYPES.TOOLBAR.SIZE.HEIGHT,
    });

    // add canvas element
    this.layer = new Konva.Layer();
    this.stage.add(this.layer);

    this.layer.draw();

    this.setBackground();
    this.setToolbar();
    this.setTransformer();
  },
  setBackground() {
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
      this.layer.add(this.background);
      this.background.moveToBottom();
      this.layer.draw();
    };
    imageObj.src = this.backgroundSource;
  },
  setToolbar() {
    this.setFreeDrawing();
    this.setCopy();
  },
  setTransformer() {
    this.stage.on('click tap', (e) => {
      if (e.target === this.background) {
        console.log('background');
        return;
      }
      if (e.target === this.freeDrawingPanel) {
        console.log('freeDrawingPanel');
        return;
      }
      this.destroyTransformers();
      this.createTransformater(e.target);
    });
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
      fill: '#00D2FF',
      stroke: 'black',
      strokeWidth: 4,
      draggable: true,
    });
    this.layer.add(box);
    // add cursor styling
    box.on('mouseover', function() {
      document.body.style.cursor = 'pointer';
    });
    box.on('mouseout', function() {
      document.body.style.cursor = 'default';
    });
  },
  destroyTransformers() {
    const transformers = this.stage.find('Transformer');
    for (let n = 0; n < transformers.length; n++) {
      transformers[n].destroy();
    }
    //don't redraw if there aren't active transformers
    if (transformers[0] != null) {
      this.layer.batchDraw();
    }
  },
  createTransformater(target) {
    const transformer = new Konva.Transformer({
      //all available options with their default values
      keepRatio: false,
      resizeEnabled: true,
      rotaionsSnaps: [],
      rotateHandlerOffset: 50,
    });
    transformer.attachTo(target);
    this.layer.add(transformer);
    this.layer.batchDraw();
  },
  exit() {
    ipcRenderer.send('close-editor-window');
  },
};

ipcRenderer.on(
  'display-editor',
  (event, displayInfo, imagePath, cropBoxData) => {
    Editor.initEditor(imagePath, cropBoxData);
  }
);
