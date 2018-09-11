const electron = require('electron');
const { app, BrowserWindow } = electron;
let selector = null;

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

  selector = new BrowserWindow({
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
    titleBarStyle: 'hiddenInset',
  });

  selector.loadFile(`${app.getAppPath()}/renderer/selector.html`);
  selector.setAlwaysOnTop(true, 'screen-saver', 1);
  selector.setVisibleOnAllWorkspaces(true);
  selector.webContents.on('did-finish-load', () => {
    const displayInfo = {
      id: activeDisplayId,
      x,
      y,
      width,
      height,
    };
    selector.webContents.send('display', displayInfo);
  });

  selector.showInactive();
  selector.focus();
  // TODO :
};

module.exports = {
  activeSelectorWindow,
};
