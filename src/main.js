const { app, globalShortcut } = require('electron');
const { openSelectorWindow } = require('./selector');

app.on('ready', async () => {
  globalShortcut.register('Command+Shift+5', openSelectorWindow);
});

app.on('will-quit', () => {
  globalShortcut.unregister('Command+Shift+5');
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', (event) => event.preventDefault());
