const electron = require('electron');
const { captureScreen } = require('../desktopCapturer');
const copyToClipboard = require('../copyToClipboard');
const download = require('../download');
const { clipboard, ipcRenderer } = electron;
const Cropper = require('cropperjs');

const Toolbar = {
  init() {
    this.toolbar = document.getElementById('toolbar');
    this.toolbar.addEventListener('click', (e) => {
      const target = e.target;
      if (target.dataset.cmd === 'copy') {
        this.destroy();
        selector.copy();
      } else if (target.dataset.cmd === 'download') {
        this.destroy();
        selector.download();
      } else if (target.dataset.cmd === 'edit') {
        this.destroy();
        selector.edit();
      }
    });
    this.cropperBox = document.querySelector('.cropper-crop-box');
  },
  show() {
    const bound = this.cropperBox.getBoundingClientRect();
    this.toolbar.style.cssText = `display: block; top: ${bound.y +
      bound.height}px; left: ${bound.x + bound.width}px`;
  },
  hide() {
    this.toolbar.style.display = 'none';
  },
  destroy() {
    this.toolbar.remove();
  },
};

const selector = {
  init(displayInfo) {
    this.displayInfo = displayInfo;
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'cropper-canvas';
    this.canvas.width = displayInfo.width * 2; // TODO : need to caculate retina display
    this.canvas.height = displayInfo.height * 2;
    this.canvas.style.cssText = `width: ${this.canvas.width /
      2}px; height: ${this.canvas.height / 2}px`;
    document.body.style.cssText = `width: ${this.canvas.width /
      2}px; height: ${this.canvas.height / 2}px`;
    document.body.appendChild(this.canvas);
    this.cropper = new Cropper(this.canvas, {
      viewMode: 0,
      zoomable: false,
      background: false,
      modal: false,
      guides: false,
      highlight: true,
      autoCrop: false,
      movable: true,
      rotatable: false,
      zoomable: false,
      zoomOnWheel: false,
      cropBoxMovable: false,
      cropBoxResizable: true,
      toggleDragModeOnDblclick: false,
      dragMode: 'crop',
      ready: () => {
        Toolbar.init();
        Toolbar.hide();
      },
      cropstart: () => {
        Toolbar.hide();
      },
      cropend: () => {
        Toolbar.show();
      },
    });
  },
  copy() {
    const cropBoxData = this.cropper.getCropBoxData();
    this.canvas.remove();
    this.cropper.destroy();
    // left, top, width, height
    // alert(`Copied ${JSON.stringify(cropBoxData, null, 2)}`);
    clipboard.writeText('copying...');
    setTimeout(() => {
      this._copy(cropBoxData);
    }, 100);
  },
  download() {
    const cropBoxData = this.cropper.getCropBoxData();
    this.canvas.remove();
    this.cropper.destroy();
    setTimeout(() => {
      this._download(cropBoxData);
    }, 100);
  },
  edit() {
    const cropBoxData = this.cropper.getCropBoxData();
    this.canvas.remove();
    this.cropper.destroy();
    setTimeout(() => {
      this._download(cropBoxData, (filePath) => {
        ipcRenderer.send('open-image-editor', filePath, cropBoxData);
      });
    }, 100);
  },
  _copy(cropBoxData) {
    const imageFormat = 'image/png';
    let originCanvas = null;
    console.time('capture-screen');
    captureScreen(
      this.displayInfo.activeDisplayId,
      this.displayInfo.width,
      this.displayInfo.height
    )
      .then((stream) => {
        console.timeEnd('capture-screen');
        // Create hidden video tag
        const video = document.createElement('video');
        video.style.cssText = 'position:absolute;top:-10000px;left:-10000px;';
        // Event connected to stream
        video.onloadedmetadata = () => {
          console.timeEnd('video-stream-load');
          // Set video ORIGINAL height (screenshot)
          video.style.height = video.videoHeight + 'px'; // videoHeight
          video.style.width = video.videoWidth + 'px'; // videoWidth

          // Create canvas
          originCanvas = document.createElement('canvas');
          originCanvas.width = video.videoWidth;
          originCanvas.height = video.videoHeight;
          originCanvas.style.cssText = `width: ${originCanvas.width /
            2}px; height: ${originCanvas.height / 2}px`;
          document.body.style.cssText = `width: ${originCanvas.width /
            2}px; height: ${originCanvas.height / 2}px`;
          const ctx = originCanvas.getContext('2d');
          // Draw video on canvas
          console.time('canvas-draw-image-video');
          ctx.drawImage(video, 0, 0, originCanvas.width, originCanvas.height);
          originCanvas.style.cssText =
            'position:absolute;top:0;left:0;width:100%;height:100%;padding:0;margin:0;';
          document.body.appendChild(originCanvas);
          console.timeEnd('canvas-draw-image-video');

          console.time('crop-captured-image');
          // const data = originCanvas.toDataURL(imageFormat);
          // document.getElementById('preview').setAttribute('src', data); // TODO: 퀄리티가 jimp 사용시보다 좋다.
          if (document.getElementById('targetCanvas')) {
            document.getElementById('targetCanvas').remove();
          }
          const canvas = document.createElement('canvas');
          canvas.id = 'targetCanvas';
          canvas.width = cropBoxData.width * 2;
          canvas.height = cropBoxData.height * 2;
          canvas.style.cssText = `position:absolute;top:-10000px;left:-10000px;width: ${cropBoxData.width /
            2}px; height: ${cropBoxData.height / 2}px;padding:0;margin:0;`;
          const cropCtx = canvas.getContext('2d');
          cropCtx.drawImage(
            originCanvas,
            cropBoxData.left * 2,
            cropBoxData.top * 2,
            cropBoxData.width * 2,
            cropBoxData.height * 2,
            0,
            0,
            cropBoxData.width * 2,
            cropBoxData.height * 2
          );
          document.body.appendChild(canvas);
          setTimeout(() => {
            copyToClipboard(canvas, imageFormat)
              .then(() => {
                this.exit();
              })
              .catch((e) => {
                this.exit();
              });
          }, 1000);
          console.timeEnd('crop-captured-image');

          // Remove hidden video tag
          video.remove();
          try {
            // Destroy connect to stream
            stream.getTracks()[0].stop();
          } catch (e) {
            throw e;
          }
        };
        // video.src = URL.createObjectURL(stream);
        console.time('video-stream-load');
        video.srcObject = stream; // old browser may not have this property
        document.body.appendChild(video);
      })
      .catch((e) => {
        console.log('exception capture', e);
        ipcRenderer.send('capturer-error-message', e);
        //  만약 사용자가 권한요청에 거부하거나 사용할 수 있는 미디어 장치가 없다면 promise는 rejected 상태로 PermissionDeniedError 또는 NotFoundError 를 반환합니다.
      });
  },
  _download(cropBoxData, callback) {
    const imageFormat = 'image/png';
    let originCanvas = null;
    console.time('capture-screen');
    captureScreen(
      this.displayInfo.activeDisplayId,
      this.displayInfo.width,
      this.displayInfo.height
    )
      .then((stream) => {
        console.timeEnd('capture-screen');
        // Create hidden video tag
        const video = document.createElement('video');
        video.style.cssText = 'position:absolute;top:-10000px;left:-10000px;';
        // Event connected to stream
        video.onloadedmetadata = () => {
          console.timeEnd('video-stream-load');
          // Set video ORIGINAL height (screenshot)
          video.style.height = video.videoHeight + 'px'; // videoHeight
          video.style.width = video.videoWidth + 'px'; // videoWidth

          // Create canvas
          originCanvas = document.createElement('canvas');
          originCanvas.width = video.videoWidth;
          originCanvas.height = video.videoHeight;
          originCanvas.style.cssText = `width: ${originCanvas.width /
            2}px; height: ${originCanvas.height / 2}px`;
          document.body.style.cssText = `width: ${originCanvas.width /
            2}px; height: ${originCanvas.height / 2}px`;
          const ctx = originCanvas.getContext('2d');
          // Draw video on canvas
          console.time('canvas-draw-image-video');
          ctx.drawImage(video, 0, 0, originCanvas.width, originCanvas.height);
          originCanvas.style.cssText =
            'position:absolute;top:0;left:0;width:100%;height:100%;padding:0;margin:0;';
          document.body.appendChild(originCanvas);
          console.timeEnd('canvas-draw-image-video');

          console.time('crop-captured-image');
          // const data = originCanvas.toDataURL(imageFormat);
          // document.getElementById('preview').setAttribute('src', data); // TODO: 퀄리티가 jimp 사용시보다 좋다.
          if (document.getElementById('targetCanvas')) {
            document.getElementById('targetCanvas').remove();
          }
          const canvas = document.createElement('canvas');
          canvas.id = 'targetCanvas';
          canvas.width = cropBoxData.width * 2;
          canvas.height = cropBoxData.height * 2;
          canvas.style.cssText = `position:absolute;top:-10000px;left:-10000px;width: ${cropBoxData.width /
            2}px; height: ${cropBoxData.height / 2}px;padding:0;margin:0;`;
          const cropCtx = canvas.getContext('2d');
          cropCtx.drawImage(
            originCanvas,
            cropBoxData.left * 2,
            cropBoxData.top * 2,
            cropBoxData.width * 2,
            cropBoxData.height * 2,
            0,
            0,
            cropBoxData.width * 2,
            cropBoxData.height * 2
          );
          document.body.appendChild(canvas);
          setTimeout(() => {
            download(canvas, imageFormat)
              .then((filePath) => {
                if (typeof callback === 'function') {
                  callback(filePath);
                }
                this.exit();
              })
              .catch((e) => {
                this.exit();
              });
          }, 1000);
          console.timeEnd('crop-captured-image');

          // Remove hidden video tag
          video.remove();
          try {
            // Destroy connect to stream
            stream.getTracks()[0].stop();
          } catch (e) {
            throw e;
          }
        };
        // video.src = URL.createObjectURL(stream);
        console.time('video-stream-load');
        video.srcObject = stream; // old browser may not have this property
        document.body.appendChild(video);
      })
      .catch((e) => {
        console.log('exception capture', e);
        ipcRenderer.send('capturer-error-message', e);
        // 만약 사용자가 권한요청에 거부하거나 사용할 수 있는 미디어 장치가 없다면 promise는 rejected 상태로 PermissionDeniedError 또는 NotFoundError 를 반환합니다.
        // capture할 display id가 매칭되지 않는다면 에러를 발생시킨다.
      });
  },
  exit() {
    ipcRenderer.send('close-capturer-window');
  },
};

ipcRenderer.on('display', (event, displayInfo) => {
  selector.init(displayInfo);
});
