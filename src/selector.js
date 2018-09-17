const electron = require('electron');
const { app, BrowserWindow } = electron;
let selectorWindow = null;

const activeSelectorWindow = () => {
  const { screen } = electron;
  const displays = screen.getAllDisplays();
  //   console.log(JSON.stringify(displays, null, 2));
  const activeDisplayId = screen.getDisplayNearestPoint(
    screen.getCursorScreenPoint()
  ).id;

  const pointedDisplay = displays.find((display) => {
    return display.id === activeDisplayId;
  });
  //   console.log(JSON.stringify(pointedDisplay, null, 2));
  const { bounds } = pointedDisplay;
  const { x, y, width, height } = bounds;

  selectorWindow = new BrowserWindow({
    x,
    y,
    width,
    height,
    hasShadow: false,
    enableLargerThanScreen: true,
    resizable: false,
    moveable: false,
    frame: false,
    transparent: true,
    show: false,
  });

  console.log('activeDisplayId ', activeDisplayId);
  selectorWindow.loadFile(`${app.getAppPath()}/renderer/selector/index.html`);
  selectorWindow.setAlwaysOnTop(true, 'screen-saver', 1);
  selectorWindow.setVisibleOnAllWorkspaces(true);
  selectorWindow.webContents.on('did-finish-load', () => {
    const displayInfo = {
      id: activeDisplayId,
      x,
      y,
      width,
      height,
    };
    selectorWindow.webContents.send('display', displayInfo);
  });

  selectorWindow.showInactive();
  selectorWindow.focus();
  selectorWindow.on('closed', () => {
    selectorWindow = null;
  });
};

module.exports = {
  activeSelectorWindow,
};
