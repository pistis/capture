const electron = require('electron');
const { ipcRenderer } = electron;
ipcRenderer.on('display', () => {
  console.log('Image Editor');
});
