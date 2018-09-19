const { desktopCapturer } = require('electron');

const captureScreen = (displayId, width, height) => {
  return new Promise((resolve, reject) => {
    desktopCapturer.getSources({ types: ['screen'] }, (error, sources) => {
      if (error) throw error;
      for (let i = 0; i < sources.length; ++i) {
        if (sources[i].id === `screen:${displayId}`) {
          navigator.webkitGetUserMedia(
            // https://developer.mozilla.org/ko/docs/Web/API/MediaDevices/getUserMedia
            {
              audio: false,
              video: {
                mandatory: {
                  chromeMediaSource: 'desktop',
                  chromeMediaSourceId: sources[i].id,
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

          return;
        }
      }
    });
  });
};

module.exports = {
  captureScreen,
};
