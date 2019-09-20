# mui-rte
The Material-UI Rich Text Editor and Viewer

<img src="http://niuware.github.io/public/assets/mui-rte/editor-w-controls-1-2-0.png" width="600" />

**mui-rte** is a complete text editor and viewer for `material-ui` v3 and v4 based on `draft-js` and written in Typescript. It supports user defined block, style, callback and decorator definitions to enhance the editor to all needs.

## Installation

```
npm install mui-rte --save
```

Install the peer dependencies: `@material-ui/core`, `@material-ui/icons`, `react` and `react-dom`.

## Demo

[![Edit mui-rte basic](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/mui-rte-basic-ypfdo?fontsize=14)

## Usage

```js
import MUIRichTextEditor from 'mui-rte'

ReactDOM.render(
    <MUIRichTextEditor label="Start typing..." />, 
    document.getElementById("root")
)
```

Or in read only mode, where no controls are rendered but text selection and component interaction is available (clickable links, etc.):

```js
import MUIRichTextEditor from 'mui-rte'

const data = getSavedContentStateFromDb()

ReactDOM.render(
    <MUIRichTextEditor value="{data}" readOnly={true} />, 
    document.getElementById("root")
)
```

## Custom Controls

From version 1.1.0 you can define your custom inline styles, block styles and callback actions to the editor. Just select an icon from `@material-ui/icons` and define your rules.

### Adding a custom inline style

This sample adds a control to change the background color and font color of the selected text:

```js
import MUIRichTextEditor from 'mui-rte'
import InvertColorsIcon from '@material-ui/icons/InvertColors'

<MUIRichTextEditor 
    controls={["my-style"]}
    customControls={[
        {
            name: "my-style",
            icon: <InvertColorsIcon />,
            type: "inline",
            inlineStyle: {
                backgroundColor: "black",
                color: "white"
            }
        }
    ]}
/>
```

### Adding a custom block style

This sample adds a block to the editor based on a `React Element` defined:

```js
import MUIRichTextEditor from 'mui-rte'
import TableChartIcon from '@material-ui/icons/TableChart'

const MyBlock = (props) => {
    return (
        <div style={{
            padding: 10,
            backgroundColor: "#ebebeb"
        }}>
            My Block content is:
            {props.children}
        </div>
    )
}

<MUIRichTextEditor 
    controls={["my-block"]}
    customControls={[
        {
            name: "my-block",
            icon: <TableChartIcon />,
            type: "block",
            blockWrapper: <MyBlock />
        }
    ]}
/>
```

### Adding a custom callback control

This sample adds a control that will trigger a custom callback function:

```js
import MUIRichTextEditor from 'mui-rte'
import DoneIcon from '@material-ui/icons/Done'

<MUIRichTextEditor 
    controls={["my-callback"]}
    customControls={[
        {
            name: "my-callback",
            icon: <DoneIcon />,
            type: "callback",
            onClick: (editorState, name) => {
                console.log(`Clicked ${name} control`)
            }
        }
    ]}
/>
```

## Custom Decorators

From version 1.2.0 you can define custom decorators to apply styles and/or functionality based on a provided regular expression. 

### Adding custom functionality with a decorator

To add some functionality when a user inputs a `#hashtag` use the following example. In this case, everytime the user inputs a word starting with a `#` character it will be automatically converted into a styled link:

```js
import MUIRichTextEditor from 'mui-rte'

const MyHashTagDecorator = (props) => {
    const hashtagUrl = "http://myurl/" + props.decoratedText
    return (
        <a 
            href={hashtagUrl}
            style={{
                color: "green"
            }}
        >
            {props.children}
        </a>
    )
}

<MUIRichTextEditor 
    label="Type something here..."
    onSave={save}
    decorators={[
        {
            component: MyHashTagDecorator,
            regex: /\#[\w]+/g
        }
    ]}
/>
```

## API

`<MUIRichTextEditor />`

|Property|Type||description|
|---|---|---|---|
|label|`string`|optional|String to show when there is no content|
|readOnly|`boolean`|optional|Read only (viewer) mode. No controls are rendered|
|value|`string`|optional|Default content to load. Should be a stringified `Draft.Model.Encoding.RawDraftContentState` object|
|inheritFontSize|`boolean`|optional|Inherit font size from parent. Useful for read only mode|
|error|`boolean`|optional|Renders the editor with an error style|
|onSave|`(data:string) => void`|optional|Function triggered when the save button is pressed. The `data` is a stringified `Draft.Model.Encoding.RawDraftContentState` object|
|onChange|`(state: EditorState) => void`|optional|Function triggered on any change in the editor (key input, delete, etc.). The `state` is a `Draft.Model.ImmutableData.EditorState` object
|controls|`string[]`|optional|List of controls to show. If not provided, all controls will be rendered. Current available values are: "title", "bold", "italic", "underline", "strikethrough", "highlight", "undo", "redo", "link", "image", "numberList", "bulletList", "quote", "code", "clear", "save"|
|customControls|`TCustomControl[]`|optional|Defines an array of user custom inline styles, blocks and callbacks. See more information in 'Custom Controls' below.|
|decorators|`TDecorator[]`|optional|Defines an array of user custom decorators. See more information in 'Custom Decorators'|   
   
`TCustomControl`

|Property|Type||description|
|---|---|---|---|
|id|`string`|optional|The HTML id attribute for the control|
|name|`string`|required|The name of the custom control. For rendering the control this name should be added to the `MUIRichTextEditor` `controls` property.|
|icon|`JSX.Element`|required|The `@material-ui/icons` icon for the control. [Check this](https://material.io/resources/icons/?style=baseline) for available icons.|
|type|`string`|required|Either "inline", "block" or "callback"|
|inlineStyle|`string`|optional|The `React.CSSProperties` object for styling the text when using the custom inline style.|
|blockWrapper|`React.ReactElement`|optional|The custom React component used for rendering the custom block.|
|onClick|`(editorState: EditorState, name: string) => void`|optional|The callback function triggered when the custom control is clicked.|   
   
`TDecorator`
|Property|Type||description|
|---|---|---|---|
|component|`React.FunctionComponent`|required|The React component to use for rendering the decorator.|
|regex|`RegExp`|required|The regular expression to match a decorator.|


## Styling the editor

You can style the editor using the `Material-UI` theming feature. First create a theme with `createMuiTheme` and override classes such as `root`, `container`, `editor`, and `editorContainer`. Check the examples directory for more.

```js
const defaultTheme = createMuiTheme()

Object.assign(defaultTheme, {
    overrides: {
        MUIRichTextEditor: {
            root: {
                marginTop: 20,
                width: "80%"
            },
            editor: {
                borderBottom: "1px solid gray" 
            }
        }
    }
})

<MuiThemeProvider theme={defaultTheme}>
    <MUIRichTextEditor 
        label="Type something here..."
    />
</MuiThemeProvider>
```

## Examples

Check the `examples` directory for more details. For development, you can run the examples as follows:

```
$ npm run serve
```

## Future plans

- Add custom blocks such as `material-ui` components (Card, etc.)
- Increase test coverage

## Suggestions and issues

Please feel free to leave your comment on the *Issues* tab.

## License

Licensed under MIT License.
