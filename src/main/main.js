const { app, globalShortcut, ipcMain } = require('electron');
const { openCaptureWindow } = require('./capturer');

app.on('ready', async () => {
  globalShortcut.register('Command+Shift+5', openCaptureWindow);
});

app.on('will-quit', () => {
  globalShortcut.unregister('Command+Shift+5');
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', (event) => event.preventDefault());
