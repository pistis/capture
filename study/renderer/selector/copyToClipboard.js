const { clipboard, nativeImage } = require('electron');

const copyToClipboard = (stream) => {
  // alert(JSON.stringify(stream));
  // const image = nativeImage.createFromDataURL(URL.createObjectURL(stream));
  // alert(image.isEmpty());
  // alert(JSON.stringify(image.getSize()));
  // alert(image.getAspectRatio());
  // clipboard.writeImage(image);
  clipboard.writeText('TODO: 여기서 부터 다시 해보자.');
};

module.exports = copyToClipboard;
