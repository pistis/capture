const electron = require('electron');
const { ipcRenderer } = electron;

ipcRenderer.on('display', (_, display) => {
  console.log('DISPLAY', _, display);
});
