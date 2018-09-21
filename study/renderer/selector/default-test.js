const electron = require('electron');
const { captureScreen } = require('./capturer');
const copyToClipboard = require('./copyToClipboard');
const { ipcRenderer } = electron;
const Cropper = require('cropperjs');

const initCropper = (canvas, cropCallback) => {
  const cropper = new Cropper(canvas, {
    zoomable: false,
    crop: cropCallback,
  });
};

const captureArea = (originCanvas, rect) => {
  // TODO : 이름은 나중에
  if (document.getElementById('targetCanvas')) {
    document.getElementById('targetCanvas').remove();
  }
  const canvas = document.createElement('canvas');
  canvas.id = 'targetCanvas';
  canvas.width = rect.w;
  canvas.height = rect.h;
  canvas.style.cssText = `position:absolute;top: ${rect.y /
    2}px;left: ${rect.x / 2}px;width: ${rect.w / 2}px; height: ${rect.h /
    2}px;padding:0;margin:0;`;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(
    originCanvas,
    rect.x,
    rect.y,
    rect.w,
    rect.h,
    0,
    0,
    rect.w,
    rect.h
  );

  document.body.appendChild(canvas);

  setTimeout(() => {
    copyToClipboard(canvas, 'image/png');
  }, 1000);
};
ipcRenderer.on('display', (event, displayInfo) => {
  console.time('capture-screen');
  captureScreen(displayInfo.id, displayInfo.width, displayInfo.height)
    .then((stream) => {
      console.timeEnd('capture-screen');
      const imageFormat = 'image/png';
      // Create hidden video tag
      const video = document.createElement('video');
      video.style.cssText = 'position:absolute;top:-10000px;left:-10000px;';
      // Event connected to stream
      video.onloadedmetadata = function() {
        console.timeEnd('video-stream-load');
        // Set video ORIGINAL height (screenshot)
        video.style.height = this.videoHeight + 'px'; // videoHeight
        video.style.width = this.videoWidth + 'px'; // videoWidth

        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = this.videoWidth;
        canvas.height = this.videoHeight;
        canvas.style.cssText = `width: ${canvas.width /
          2}px; height: ${canvas.height / 2}px`;
        document.body.style.cssText = `width: ${canvas.width /
          2}px; height: ${canvas.height / 2}px`;
        const ctx = canvas.getContext('2d');
        // Draw video on canvas
        console.time('canvas-draw-image-video');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        // ctx.font = 'italic 200pt Calibri';
        // ctx.fillStyle = 'white';
        // ctx.fillText('Captured!!', canvas.width / 2, canvas.height / 2);
        canvas.style.cssText =
          'position:absolute;top:0;left:0;width:100%;height:100%;padding:0;margin:0;';
        document.body.appendChild(canvas);
        console.timeEnd('canvas-draw-image-video');

        console.time('init-cropper');
        initCropper(canvas, (event) => {
          console.log(event.detail.x);
          console.log(event.detail.y);
          console.log(event.detail.width);
          console.log(event.detail.height);
          console.log(event.detail.rotate);
          console.log(event.detail.scaleX);
          console.log(event.detail.scaleY);
          // TODO : 일단 완료버튼은 나중에 초기 값으로 복사
          captureArea(canvas, {
            x: event.detail.x,
            y: event.detail.y,
            w: event.detail.width,
            h: event.detail.height,
          });
        });
        console.timeEnd('init-cropper');

        console.time('preview-captured-image');
        // const data = canvas.toDataURL(imageFormat);
        // document.getElementById('preview').setAttribute('src', data); // TODO: 퀄리티가 jimp 사용시보다 좋다.
        console.timeEnd('preview-captured-image');

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
      //  만약 사용자가 권한요청에 거부하거나 사용할 수 있는 미디어 장치가 없다면 promise는 rejected 상태로 PermissionDeniedError 또는 NotFoundError 를 반환합니다.
    });
});
