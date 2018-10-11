const { desktopCapturer } = require('electron');

const captureScreen = (displayId, width, height) => {
  return new Promise((resolve, reject) => {
    desktopCapturer.getSources({ types: ['screen'] }, (error, sources) => {
      if (error) {
        reject(error);
        return;
      }
      const activeSourceIds = sources
        .map((source) => source.id)
        .filter((id) => {
          return id === `screen:${displayId}`;
        });
      if (activeSourceIds.length === 0) {
        reject(new Error(`not matched display id : ${displayId}`));
        return;
      }
      const sourceId = activeSourceIds[0];
      navigator.webkitGetUserMedia(
        // https://developer.mozilla.org/ko/docs/Web/API/MediaDevices/getUserMedia
        {
          audio: false,
          video: {
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: sourceId,
              minWidth: width,
              maxWidth: width * 2,
              minHeight: height,
              maxHeight: height * 2,
            },
          },
        },
        resolve,
        reject
      );
    });
  });
};

module.exports = {
  captureScreen,
};
