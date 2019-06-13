# mui-rte
The Material-UI Rich Text Editor and Viewer

![mui-rte](http://niuware.github.io/public/assets/mui-rte/editor-w-controls.png)

**mui-rte** is a complete text editor and viewer for `material-ui` based on `draft-js` and written in Typescript.

## Installation

```
npm install mui-rte --save
```

## Usage

```js
import MUIRichTextEditor from 'mui-rte'

ReactDOM.render(
    <MUIRichTextEditor label="Start typing..." />, 
    document.getElementById("root")
)
```

Or in read only mode, with no controls but text selection and component interaction (such as clickable links):

```js
import MUIRichTextEditor from 'mui-rte'

const data = getPreviousContentState()

ReactDOM.render(
    <MUIRichTextEditor value="{data}" readOnly={true} />, 
    document.getElementById("root")
)
```

## API

`<MUIRichTextEditor />`

|Property|Type||description|
|---|---|---|---|
|label|string|optional|String to show when there is no content|
|readOnly|boolean|optional|Read only (viewer) mode. No controls are rendered|
|value|string|optional|Default content to load. Should be a stringified `Draft.Model.Encoding.RawDraftContentState` object|
|inheritFontSize|boolean|optional|Inherit font size from parent. Useful for read only mode|
|error|boolean|optional|Renders the editor with an error style|
|onSave|(data:string) => void|optional|Function triggered when the save button is pressed. The `data` is a stringified `Draft.Model.Encoding.RawDraftContentState` object|

## Future plans

- Allow user defined components
- Add custom inline effects (highlights, etc.) 
- Add custom blocks such as image, or direct components from `material-ui` (Card, etc)

## Suggestions and issues

Please feel free to leave your comment on the *Issues* tab.

## License

Licensed under MIT License.