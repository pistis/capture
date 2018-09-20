const electron = require('electron');
const { captureScreen } = require('./capturer');
const copyToClipboard = require('./copyToClipboard');
const { ipcRenderer } = electron;

ipcRenderer.on('display', (event, displayInfo) => {
  console.log(`displayInfo ${JSON.stringify(displayInfo)}`); // TODO : can use displayInfo later.

  captureScreen(displayInfo.id, displayInfo.width, displayInfo.height)
    .then((stream) => {
      const imageFormat = 'image/png';
      // Create hidden video tag
      const video = document.createElement('video');
      video.style.cssText = 'position:absolute;top:-10000px;left:-10000px;';
      // Event connected to stream
      video.onloadedmetadata = function() {
        // Set video ORIGINAL height (screenshot)
        video.style.height = this.videoHeight + 'px'; // videoHeight
        video.style.width = this.videoWidth + 'px'; // videoWidth

        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = this.videoWidth;
        canvas.height = this.videoHeight;
        const ctx = canvas.getContext('2d');
        // Draw video on canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const data = canvas.toDataURL(imageFormat);
        document.getElementById('preview').setAttribute('src', data); // TODO: 퀄리티가 jimp 사용시보다 좋다.

        copyToClipboard(data); // 일단 여기서 복사한다.
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
      video.srcObject = stream; // old browser may not have this property
      document.body.appendChild(video);
    })
    .catch((e) => {
      console.log('exception capture', e);
      //  만약 사용자가 권한요청에 거부하거나 사용할 수 있는 미디어 장치가 없다면 promise는 rejected 상태로 PermissionDeniedError 또는 NotFoundError 를 반환합니다.
    });
});
