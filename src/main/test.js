const electron = require('electron');

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
module.exports = {
  screenTest,
};
