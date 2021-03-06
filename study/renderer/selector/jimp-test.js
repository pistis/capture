const electron = require('electron');
const Jimp = require('jimp');
const { captureScreen } = require('./capturer');
const { ipcRenderer } = electron;

const previewCapture = (base64data, rect) => {
  const { screen } = electron;
  // add to buffer base64 image instead of saving locally in order to manipulate with Jimp
  const encondedImageBuffer = new Buffer(
    base64data.replace(/^data:image\/(png|gif|jpeg);base64,/, ''),
    'base64'
  );

  const height = rect.height;
  const width = rect.width;
  const distanceX = rect.x;
  const distanceY = rect.y;
  const screenDimensions = screen.getPrimaryDisplay().size;
  const screenHeight = screenDimensions.height;
  const screenWidth = screenDimensions.width;

  Jimp.read(encondedImageBuffer, function(err, image) {
    if (err) throw err;

    // Show the original width and height of the image in the console
    console.log(image.bitmap.width, image.bitmap.height);

    // Resize the image to the size of the screen
    image.resize(screenWidth, screenHeight);
    // Crop image according to the coordinates
    // add some margin pixels for this example
    image
      .crop(distanceX, distanceY, width, height)
      // Get data in base64 and show in img tag
      .getBase64('image/jpeg', function(err, base64data) {
        const preview = document.getElementById('preview');
        preview.setAttribute('src', base64data);
        preview.style.cssText = `width:${rect.width}px;height:${
          rect.height
        }px;`;
        //console.log(data);
      });
  });
};
ipcRenderer.on('display', (event, displayInfo) => {
  console.log(`displayInfo ${JSON.stringify(displayInfo)}`); // TODO : can use displayInfo later.
  captureScreen(displayInfo.id, displayInfo.width, displayInfo.height)
    .then((stream) => {
      console.log('captured screen', stream);
      const imageFormat = 'image/webp';
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

        previewCapture(canvas.toDataURL(imageFormat), {
          x: 0,
          y: 0,
          width: 1024,
          height: 768,
        });

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

// ipcRenderer.on('captured-screen', (event, stream) => {
//   console.log('captured-screen', stream);
// });
// window.addEventListener('load', () => {
//   ipcRenderer.send('capture-screen');
// });
