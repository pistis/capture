const electron = require('electron');
const { app, BrowserWindow, ipcMain } = electron;
const os = require('os');
const fs = require('fs');
const path = require('path');
let selectorWindow = null;

const selectorPath = `${app.getAppPath()}/study/renderer/selector/index.html`; // TODO : need to change real implementation page

const getDownloadDir = () => {
  const homedir = os.homedir();
  const downloaddir = path.resolve(homedir, './capture_download');

  if (!fs.existsSync(`${downloaddir}`)) {
    fs.mkdirSync(downloaddir);
  }
  return downloaddir;
};

const openCaptureWindow = () => {
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
  selectorWindow.loadFile(selectorPath);
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
    console.log(`closed ${activeDisplayId}`);
  });

  ipcMain.once('close', () => {
    selectorWindow.close();
  });

  ipcMain.on('show-save-dialog-capture-image', (event) => {
    // TODO : 다이얼로그를 사용하면 멈춘다...
    const downloaddir = getDownloadDir();
    console.log('download dir', downloaddir);
    const { dialog } = electron;
    dialog.showSaveDialog(
      selectorWindow,
      {
        title: '이것은? capture 다운로드',
        // properties: ['openDirectory', 'createDirectory', 'showHiddenFiles'],
        filters: [{ name: 'Images', extensions: ['png'] }],
        buttonLabel: '저장!', // 저장 버튼
        defaultPath: downloaddir,
      },
      (filePaths) => {
        if (filePaths === undefined) {
          dialog.showMessageBox(
            selectorWindow,
            {
              type: 'error', // "none", "info", "error", "question", "warning"
              title: 'Oh!',
              message: "You didn't save the file",
              detail: 'error information',
              buttons: ['확인'],
            },
            (buttonIndex) => {
              console.log('buttonIndex', buttonIndex);
            }
          );
          return;
        }
        ipcMain.send('hide-save-dialog-capture-image', filePaths[0]);
      }
    );
  });
};

module.exports = {
  openCaptureWindow,
};
