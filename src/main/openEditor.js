const electron = require('electron');
const { app, BrowserWindow, ipcMain } = electron;
let selectorWindow = null;

const selectorPath = `${app.getAppPath()}/src/renderer/editor/index.html`;

const openEditor = (displayInfo, cropBoxData) => {
  selectorWindow = new BrowserWindow({
    x: cropBoxData.left,
    y: cropBoxData.top,
    width: cropBoxData.width,
    height: cropBoxData.height,
    hasShadow: false,
    enableLargerThanScreen: true,
    resizable: false,
    moveable: false,
    frame: false,
    transparent: false,
    show: false,
  });

  selectorWindow.loadFile(selectorPath);
  selectorWindow.setAlwaysOnTop(true, 'screen-saver', 1);
  selectorWindow.setVisibleOnAllWorkspaces(true);
  selectorWindow.webContents.on('did-finish-load', () => {
    selectorWindow.webContents.send('display', displayInfo);
  });

  selectorWindow.showInactive();
  selectorWindow.focus();
  selectorWindow.on('closed', () => {
    selectorWindow = null;
    console.log(`closed ${displayInfo.activeDisplayId}`);
  });

  ipcMain.once('close-editor-window', () => {
    selectorWindow.close();
  });

  ipcMain.on('editor-error-message', (event, error) => {
    const { dialog } = electron;

    dialog.showMessageBox(
      selectorWindow,
      {
        type: 'error', // "none", "info", "error", "question", "warning"
        title: 'Editor Error',
        message: 'editor error',
        detail: 'editor error',
        buttons: ['OK'],
      },
      (buttonIndex) => {
        console.log('buttonIndex', buttonIndex);
      }
    );
  });
};

module.exports = {
  openEditor,
};
