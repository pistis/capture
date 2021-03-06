const electron = require('electron');
const os = require('os');
const fs = require('fs');
const path = require('path');

const screenTest = () => {
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
  console.log('displays length', displays.length);
  console.log('id', pointedDisplay.id); // 출력 장치의 화소 배율.
  console.log('scaleFactor', pointedDisplay.scaleFactor); // 출력 장치의 화소 배율.
  console.log('rotation', pointedDisplay.rotation); // 0, 90, 180, 270
  console.log('touchSupport', pointedDisplay.touchSupport); // available, unavailable, unknown.
  console.log('bounds', x, y, width, height); // 상단 Tray bar 포함
  console.log('workAreaSize', JSON.stringify(pointedDisplay.workAreaSize)); // 상단 tray bar 제외
  console.log('workArea', JSON.stringify(pointedDisplay.workArea)); //상단 tray bar 제외
  console.log('size', JSON.stringify(pointedDisplay.size)); //상단 Tray bar 포함
  console.log('getCursorScreenPoint', screen.getCursorScreenPoint()); // 디스플레이의 마우스 포인터 위치
};

const shellTest = () => {
  const { shell } = electron;
  const homedir = os.homedir();
  console.log('home dir', homedir);
  const downloaddir = path.resolve(homedir, './capture_download');
  console.log('download dir', downloaddir);
  if (fs.existsSync(`${downloaddir}`)) {
    console.log('exist');
  } else {
    fs.mkdirSync(downloaddir);
    console.log('not exist');
  }

  shell.showItemInFolder(downloaddir); // finder를 지정 경로로 열기
};

const dialogTest = () => {
  const { dialog } = require('electron');

  const homedir = os.homedir();
  console.log('home dir', homedir);
  const downloaddir = path.resolve(homedir, './capture_download');
  console.log('download dir', downloaddir);

  if (fs.existsSync(`${downloaddir}`)) {
    console.log('exist');
  } else {
    fs.mkdirSync(downloaddir);
    console.log('not exist');
  }

  dialog.showSaveDialog(
    {
      title: '이것은? capture 다운로드',
      // properties: ['openDirectory', 'createDirectory', 'showHiddenFiles'],
      filters: [{ name: 'Images', extensions: ['png'] }],
      buttonLabel: '저장!', // 저장 버튼
      defaultPath: downloaddir,
    },
    (filePaths) => {
      console.log('save file path', filePaths); //취소시에 undefined
      if (filePaths) {
        dialog.showMessageBox(
          {
            type: 'none', // "none", "info", "error", "question", "warning"
            title: 'Oh!',
            message: `saved ${filePaths}`,
            detail: 'additional information',
            buttons: ['확인'],
          },
          (buttonIndex) => {
            console.log('buttonIndex', buttonIndex);
          }
        );
      }
    }
  );
};
module.exports = {
  screenTest,
  shellTest,
  dialogTest,
};
