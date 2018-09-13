const { app, globalShortcut } = require('electron');
const { activeSelectorWindow } = require('./selector');
app.on('ready', async () => {
  globalShortcut.register('Command+Shift+3', activeSelectorWindow);
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
  globalShortcut.unregister('Command+Shift+3');

  globalShortcut.unregisterAll();
});

app.on('window-all-closed', (event) => event.preventDefault());
