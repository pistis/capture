## Fabric useful method and property

### canvas

- on/off/trigger : 커스텀 or fabric 제공 이벤트 등록/해제, 발생
- selection : 선택 기능 on/off
- getObjects : 포함하는 객체들의 배열
- setActiveObject : 지정된 객체를 선택
- getActiveObject : 선택된 객체들 반환(여러개인 경우 activeSelection)
- requestRenderAll
- renderAll
- discardActiveObject : activeObject 를 취소
- forEachObject : 포함하는 오브젝트들의 forEach

### object

- setCoords
- setSelectionStyles
- set

### text

- enterEditing

### useful way

- [fabric-js-editor util](https://github.com/danielktaylor/fabric-js-editor/blob/master/src/js/app/fabricUtils.js)
  - select all, back/front, delete, clone, set style
- [fabric-js-editor handler](https://github.com/danielktaylor/fabric-js-editor/blob/ebe52d479e778faddc3a385d562ee7d2a8364235/src/js/app/handlers.js)
  - undo/redo
- [fabric-js-editor handler](https://github.com/danielktaylor/fabric-js-editor/blob/ebe52d479e778faddc3a385d562ee7d2a8364235/src/js/app/page.js)
  - key, preview, color picker, panel, menu
- [fabric-js-editor handler](https://github.com/danielktaylor/fabric-js-editor/blob/ebe52d479e778faddc3a385d562ee7d2a8364235/src/js/app/drawing.js)
  - mouse 이벤트를 활용한 객체 삽입
