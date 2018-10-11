const electron = require('electron');
const { app, globalShortcut, ipcMain } = electron;
const { openCapturer } = require('./openCapturer');
const { screenTest, shellTest, dialogTest } = require('./test');

const getDisplayInfo = () => {
  const { screen } = electron;
  const displays = screen.getAllDisplays();

  const activeDisplayId = screen.getDisplayNearestPoint(
    screen.getCursorScreenPoint()
  ).id;

  const pointedDisplay = displays.find((display) => {
    return display.id === activeDisplayId;
  });

  const { bounds } = pointedDisplay;
  const { x, y, width, height } = bounds;
  return {
    activeDisplayId,
    x,
    y,
    width,
    height,
  };
};
app.on('ready', async () => {
  ipcMain.on('open-image-editor', (event, cropBoxData) => {
    console.log(cropBoxData);
  });

  globalShortcut.register('Command+Shift+5', () => {
    openCapturer(getDisplayInfo());
  });
  globalShortcut.register('Command+Shift+6', screenTest);
  globalShortcut.register('Command+Shift+7', shellTest);
  globalShortcut.register('Command+Shift+8', dialogTest);
});

app.on('will-quit', () => {
  globalShortcut.unregister('Command+Shift+5');
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', (event) => event.preventDefault());
