const electron = require('electron');
const { app, BrowserWindow, ipcMain } = electron;
const selectorWindow = null;

const selectorPath = `${app.getAppPath()}/src/renderer/editor/index.html`;

const openEditor = () => {};

module.exports = {
  openEditor,
};
