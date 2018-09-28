const { app, globalShortcut } = require('electron');
const { openCaptureWindow } = require('./capturer');
const { screenTest } = require('./test');

app.on('ready', async () => {
  globalShortcut.register('Command+Shift+5', openCaptureWindow);
  globalShortcut.register('Command+Shift+6', screenTest);
});

app.on('will-quit', () => {
  globalShortcut.unregister('Command+Shift+5');
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', (event) => event.preventDefault());
