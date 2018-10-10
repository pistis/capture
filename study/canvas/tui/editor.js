const instance = new tui.ImageEditor(
  document.querySelector('#tui-image-editor'),
  {
    includeUI: {
      loadImage: {
        path: 'twice.jpg',
        name: 'SampleImage',
      },
      initMenu: 'filter',
      menuBarPosition: 'bottom',
    },
    cssMaxWidth: 700,
    cssMaxHeight: 500,
    selectionStyle: {
      cornerSize: 20,
      rotatingPointOffset: 70,
    },
  }
);
