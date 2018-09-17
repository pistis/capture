const { app, globalShortcut, ipcMain } = require('electron');
const { activeSelectorWindow } = require('./selector');
const { captureScreen } = require('../renderer/selector/capturer');
app.on('ready', async () => {
  globalShortcut.register('Command+Shift+5', activeSelectorWindow);
  // ipcMain.on('capture-screen', (event) => {
  //   console.log('capture-screen');
  //   captureScreen()
  //     .then((stream) => {
  //       event.sender.send('captured-screen', stream);
  //     })
  //     .catch(() => {
  //       console.log('exception capture');
  //     });
  //   // event.sender.send('asynchronous-reply', 'pong')
  // });
  // test
  // let mainWindow = new BrowserWindow({
  //   width: 1024,
  //   height: 768,
  // });
  // mainWindow.loadFile(`${app.getAppPath()}/renderer/screenshot/index.html`);
  // mainWindow.on('closed', () => {
  //   mainWindow = null;
  // });
});

app.on('will-quit', () => {
  globalShortcut.unregister('Command+Shift+5');
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', (event) => event.preventDefault());
