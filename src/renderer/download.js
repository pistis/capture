const { nativeImage, ipcRenderer } = require('electron');
const os = require('os');
const fs = require('fs');
const path = require('path');

const getDownloadDir = () => {
  // 일단 다이얼로그 없이 진행
  const homedir = os.homedir();
  const downloaddir = path.resolve(homedir, './capture_download');

  if (!fs.existsSync(`${downloaddir}`)) {
    fs.mkdirSync(downloaddir);
  }
  return downloaddir;
};

const download = (canvas, imageFormat) => {
  return new Promise((resolve, reject) => {
    try {
      console.time('download-captured-image');
      const filePath = path.resolve(getDownloadDir(), './test.png');
      const data = canvas.toDataURL(imageFormat);
      const image =
        typeof nativeImage.createFromDataURL === 'function'
          ? nativeImage.createFromDataURL(data) // electron v0.36+
          : nativeImage.createFromDataUrl(data); // electron v0.30

      fs.writeFile(filePath, image.toPNG(), (err) => {
        let message = '';
        if (err) {
          message = 'An error ocurred creating the file ' + err.message;
        }
        message = 'The file has been succesfully saved';
        console.log(message);
        console.timeEnd('download-captured-image');
        resolve();

        // let message = '';
        // if (err) {
        //   message = 'An error ocurred creating the file ' + err.message;
        // }
        // message = 'The file has been succesfully saved';

        // dialog.showMessageBox(
        //   {
        //     type: 'none', // "none", "info", "error", "question", "warning"
        //     title: 'Oh!',
        //     message: message,
        //     detail: 'additional information',
        //     buttons: ['확인'],
        //   },
        //   (buttonIndex) => {
        //     console.log('buttonIndex', buttonIndex);
        //     console.timeEnd('download-captured-image');
        //     resolve();
        //   }
        // );
      });

      // ipcRenderer.send('show-save-dialog-capture-image');
      // ipcRenderer.once('hide-save-dialog-capture-image', (event, filePath) => {
      //   const data = canvas.toDataURL(imageFormat);
      //   const image =
      //     typeof nativeImage.createFromDataURL === 'function'
      //       ? nativeImage.createFromDataURL(data) // electron v0.36+
      //       : nativeImage.createFromDataUrl(data); // electron v0.30

      //   fs.writeFile(filePath, image.toPNG(), (err) => {
      //     resolve();
      //     // let message = '';
      //     // if (err) {
      //     //   message = 'An error ocurred creating the file ' + err.message;
      //     // }
      //     // message = 'The file has been succesfully saved';

      //     // dialog.showMessageBox(
      //     //   {
      //     //     type: 'none', // "none", "info", "error", "question", "warning"
      //     //     title: 'Oh!',
      //     //     message: message,
      //     //     detail: 'additional information',
      //     //     buttons: ['확인'],
      //     //   },
      //     //   (buttonIndex) => {
      //     //     console.log('buttonIndex', buttonIndex);
      //     //     console.timeEnd('download-captured-image');
      //     //     resolve();
      //     //   }
      //     // );
      //   });
      // });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = download;
