const { clipboard, nativeImage } = require('electron');

const copyToClipboard = (canvas, imageFormat) => {
  return new Promise((resolve, reject) => {
    try {
      console.time('copy-captured-image');
      const data = canvas.toDataURL(imageFormat);
      const image =
        typeof nativeImage.createFromDataURL === 'function'
          ? nativeImage.createFromDataURL(data) // electron v0.36+
          : nativeImage.createFromDataUrl(data); // electron v0.30
      clipboard.writeImage(image);
      console.timeEnd('copy-captured-image');
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = copyToClipboard;
