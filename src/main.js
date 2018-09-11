const { app, globalShortcut } = require('electron');
const { activeSelectorWindow } = require('./selector');
app.on('ready', async () => {
  globalShortcut.register('Command+Shift+3', activeSelectorWindow);
});

app.on('will-quit', () => {
  globalShortcut.unregister('Command+Shift+3');

  globalShortcut.unregisterAll();
});

app.on('window-all-closed', (event) => event.preventDefault());
