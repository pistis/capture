const { app, globalShortcut } = require('electron');
const { openCaptureWindow } = require('./capturer');
const { screenTest, shellTest, dialogTest } = require('./test');

app.on('ready', async () => {
  globalShortcut.register('Command+Shift+5', openCaptureWindow);
  globalShortcut.register('Command+Shift+6', screenTest);
  globalShortcut.register('Command+Shift+7', shellTest);
  globalShortcut.register('Command+Shift+8', dialogTest);
});

app.on('will-quit', () => {
  globalShortcut.unregister('Command+Shift+5');
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', (event) => event.preventDefault());
