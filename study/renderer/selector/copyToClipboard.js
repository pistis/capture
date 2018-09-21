const { clipboard, nativeImage } = require('electron');

const copyToClipboard = (data) => {
  const image =
    typeof nativeImage.createFromDataURL === 'function'
      ? nativeImage.createFromDataURL(data) // electron v0.36+
      : nativeImage.createFromDataUrl(data); // electron v0.30
  clipboard.writeImage(image);
};

module.exports = copyToClipboard;
