const { desktopCapturer } = require('electron');

const captureScreen = (displayId) => {
  return new Promise((resolve, reject) => {
    desktopCapturer.getSources({ types: ['screen'] }, (error, sources) => {
      if (error) throw error;
      // console.log(sources);
      for (let i = 0; i < sources.length; ++i) {
        console.log(sources[i]);
        // Filter: main screen
        console.log(sources[i].name);
        if (sources[i].id === `screen:${displayId}`) {
          navigator.webkitGetUserMedia(
            {
              audio: false,
              video: {
                mandatory: {
                  chromeMediaSource: 'desktop',
                  chromeMediaSourceId: sources[i].id,
                  minWidth: 1280,
                  maxWidth: 4000,
                  minHeight: 720,
                  maxHeight: 4000,
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
