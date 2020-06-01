# mui-rte
![Tests](https://github.com/niuware/mui-rte/workflows/Tests/badge.svg)   

The Material-UI Rich Text Editor and Viewer

<img src="https://raw.githubusercontent.com/niuware/niuware.github.io/master/public/assets/mui-rte/editor-1-9-0.png" width="600" />

**mui-rte** is a complete text editor and viewer for `material-ui` based on `draft-js` and written in Typescript. It is ready to use out of the box yet supports user defined blocks, styles, autocomplete strategies, async/sync custom atomic blocks, callbacks, and decorators as well as toolbar and theme customization to enhance the editor to all needs.

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

You can load default content as the following example. The value should be a stringified `RawDraftContentState` object:

```js
import MUIRichTextEditor from 'mui-rte'

const data = getContentStateAsStringFromSomewhere()

ReactDOM.render(
    <MUIRichTextEditor 
        defaultValue={data}
        label="Start typing..." 
    />, 
    document.getElementById("root")
)
```

## Examples

Check the [examples](https://github.com/niuware/mui-rte/tree/master/examples) directory for more. 

## Custom Controls

You can define your custom inline styles, blocks, atomic blocks and callback actions to the editor. Just select an icon from `@material-ui/icons` or create your own `FunctionComponent` and define your rules.

### Adding a custom inline style

This sample adds a control to change the background color and font color of the typed or selected text:

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

### Adding a custom block

This sample adds a block to the editor based on a `React Element`:

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

### Adding a custom atomic block (Async)

<img src="https://raw.githubusercontent.com/niuware/niuware.github.io/master/public/assets/mui-rte/async-upload-demo.gif" width="600" />

It is possible to insert custom blocks based on asynchronous behavior using the `insertAtomicBlockAsync` API. The above example shows an [example](https://github.com/niuware/mui-rte/blob/master/examples/async-image-upload/index.tsx) on how to upload an image and use the `MUIRichTextEditor` default image control for further edition. You can use this behavior to upload a file when dropping it inside the editor and render it as an image entity after upload.

Check this [other sample](https://github.com/niuware/mui-rte/blob/master/examples/async-atomic-custom-block/index.tsx) that shows how to add a `@material-ui/core` Card with asynchronous downloaded content.

### Adding a custom atomic block (Sync)

Check [this sample](https://github.com/niuware/mui-rte/blob/master/examples/atomic-custom-block/index.tsx) that shows how to create a control to add a `@material-ui/core` Card component to the editor.

### Adding a custom callback control

This sample adds a control that will trigger a custom callback function to clear the editor state:

```js
import MUIRichTextEditor from 'mui-rte'
import DoneIcon from '@material-ui/icons/Done'
import { EditorState } from 'draft-js'

<MUIRichTextEditor 
    controls={["my-callback"]}
    customControls={[
        {
            name: "my-callback",
            icon: <DoneIcon />,
            type: "callback",
            onClick: (editorState, name, anchor) => {
                console.log(`Clicked ${name} control`)
                return EditorState.createEmpty()
            }
        }
    ]}
/>
```

## Autocomplete strategies

<img src="https://raw.githubusercontent.com/niuware/niuware.github.io/master/public/assets/mui-rte/ac-demo.gif" width="600" />

You can define autocomplete strategies to present suggested content lists based on the text input. Just set your trigger character, add some search keys and the content to insert and the editor will do everything for you. You can navigate through suggestions using the keyboard arrows and finally press 'Enter' to insert your content into the editor.

### Simple strategy example

This is an example to show emoji suggestions when the user start typing a text like ':face', ':joy', or ':grin':

```js
import MUIRichTextEditor from 'mui-rte'

const emojis = [
    {
        keys: ["face", "grin"],
        value: "😀",
        content: "😀",
    },
    {
        keys: ["face", "joy"],
        value: "😂",
        content: "😂",
    },
    {
        keys: ["face", "sweat"],
        value: "😅",
        content: "😅",
    }
]

<MUIRichTextEditor 
    autocomplete={{
        strategies: [
            {
                items: emojis,
                triggerChar: ":"
            }
        ]
    }}
/>
```

Check [this sample](https://github.com/niuware/mui-rte/blob/master/examples/autocomplete/index.tsx) that shows how to add multiple autocomplete strategies to a single editor.

### Atomic strategy example

Check [this sample](https://github.com/niuware/mui-rte/blob/master/examples/autocomplete/index.tsx) that shows how to combine atomic custom controls with the autocomplete strategy feature.

## Custom Decorators

You can define custom decorators to apply styles and/or functionality based on a provided regular expression. 

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
    decorators={[
        {
            component: MyHashTagDecorator,
            regex: /\#[\w]+/g
        }
    ]}
/>
```

## Inline toolbar

The editor includes an inline toolbar option which renders a pop-up inside the editor area when the user makes a selection. The inline toolbar supports user defined controls. Notice that only `inline` type controls will be rendered. The controls displayed on the main toolbar can be different from the ones in the inline toolbar. You can also hide the main toolbar and just enable the inline toolbar.

```js
import MUIRichTextEditor from 'mui-rte'

<MUIRichTextEditor 
    label="Type something here..."
    inlineToolbar={true}
/>
```

## Styling the editor

You can style the editor using the `Material-UI` theming feature. First create a theme with `createMuiTheme` and override classes such as `root`, `container`, `editor`, and `editorContainer`. Check the examples directory for more.

```js
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIRichTextEditor from 'mui-rte'

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

## API

`<MUIRichTextEditor /> (TMUIRichTextEditorProps)`

|Property|Type||description|
|---|---|---|---|
|id|`string`|optional|Base Id name for the component HTML elements.|
|ref|`TMUIRichTextEditorRef`|optional|Sets a reference instance of the editor component.|
|label|`string`|optional|String to show when there is no content.|
|readOnly|`boolean`|optional|Read only mode. The toolbar is disabled by default.|
|value|`string`|deprecated|Use `defaultValue` instead.|
|defaultValue|`string`|optional|Default content to load. Should be a stringified `Draft.Model.Encoding.RawDraftContentState` object.|
|inheritFontSize|`boolean`|optional|Inherit font size from parent. Useful for read only mode.|
|error|`boolean`|optional|Renders the editor with an error style.|
|controls|`string[]`|optional|List of controls to display in the main toolbar. If not provided, all controls will be rendered. Current available values are: "title", "bold", "italic", "underline", "strikethrough", "highlight", "undo", "redo", "link", "media", "numberList", "bulletList", "quote", "code", "clear", "save".|
|customControls|`TCustomControl[]`|optional|Defines an array of user custom inline styles, blocks and callbacks. See more information in 'Custom Controls' below.|
|decorators|`TDecorator[]`|optional|Defines an array of user custom decorators. See more information in 'Custom Decorators'.|
|toolbar|`boolean`|optional|Defines if the main toolbar should be rendered.|
|toolbarButtonSize|`small` \| `medium`|optional|Sets the size on the default `IconButton` component for the main toolbar.|
|inlineToolbar|`boolean`|optional|Defines if the inline toolbar should be rendered.|
|inlineToolbarControls|`string[]`|optional|List of controls to display in the inline toolbar. Available values are: "bold", "italic", "underline", "strikethrough", "highlight", "link", "clear", and user defined inline controls. If not provided and `inlineToolbar` is `true` the following inline styles will be displayed: bold, italic, underline and clear.|
|keyCommands|`TKeyCommand[]`|optional|Defines an array of `TKeyCommand` objects for adding key bindings to the editor.|
|draftEditorProps|`TDraftEditorProps`|optional|Defines an object containing specific `draft-js` `Editor` properties.|
|maxLength|`number`|optional|Sets the maximum characters count that can be input into the editor.|
|autocomplete|`TAutocomplete`|optional|Sets autocomplete strategies to present suggestion lists as the user types into the editor.|
|onSave|`(data:string) => void`|optional|Function triggered when the save button is pressed. The `data` is a stringified `Draft.Model.Encoding.RawDraftContentState` object.|
|onChange|`(state: EditorState) => void`|optional|Function triggered on any change in the editor (key input, delete, etc.). The `state` is a `Draft.Model.ImmutableData.EditorState` object.|
|onFocus|`() => void`|optional|Function triggered when when the editor acquires focus.|
|onBlur|`() => void`|optional|Function triggered when when the editor loses focus.|

<br />

`TCustomControl`

|Property|Type||description|
|---|---|---|---|
|id|`string`|optional|The HTML id attribute for the control|
|name|`string`|required|The name of the custom control. For rendering the control this name should be added to the `MUIRichTextEditor` `controls` property.|
|icon|`JSX.Element`|optional|The `@material-ui/icons` icon for the control. For "atomic" control type, the icon is not required. [Check this](https://material.io/resources/icons/?style=baseline) for available icons.|
|component|`React.FunctionComponent<TToolbarComponentProps>`|optional|The custom function component for the control. The icon has priority over the component, so if the icon is set the component will be ignored. For "atomic" control type, the component is not required.|
|type|`string`|required|Either "inline", "block", "atomic" or "callback"|
|inlineStyle|`string`|optional|The `React.CSSProperties` object for styling the text when using a custom inline style.|
|blockWrapper|`React.ReactElement`|optional|The custom React component used for rendering a custom block.|
|atomicComponent|`React.FunctionComponent`|optional|The custom React FunctionComponent used for rendering a custom atomic block.|
|onClick|`(editorState: EditorState, name: string, anchor: HTMLElement \| null) => EditorState \| void`|optional|The callback function triggered when the custom control is clicked. The received arguments include the current `EditorState` object, the name of the clicked control and the `HTMLElement` from which the click was raised. If a new `EditorState` object is returned it will be replace the current one in the editor (useful to explicitly modify the `EditorState`).|   

<br />

`TToolbarComponentProps`  

|Property|Type|description|  
|---|---|---|  
|id|`string`|The id for the component.|
|onMouseDown|`(e: React.MouseEvent) => void`|The `mousedown` handler.|
|active|`boolean`|Defines if the block or inline type is active for the current editor selection.|
|disabled|`boolean`|Sets if the toolbar is disabled.|   

<br />

`TDecorator`

|Property|Type||description|
|---|---|---|---|
|component|`React.FunctionComponent`|required|The React component to use for rendering the decorator.|
|regex|`RegExp`|required|The regular expression to match a decorator.|  

<br />

`TKeyCommand`

|Property|Type||description|
|---|---|---|---|
|key|`number`|required|The code of the key to bind.|
|name|`string`|required|The name of the command.|
|callback|`(state: EditorState) => EditorState`|required|The callback function to execute when the key binding is matched. It should return the `EditorState` to set.|   

<br />

`TDraftEditorProps`

|Property|Type||description|
|---|---|---|---|
|spellCheck|`boolean`|optional|Use browser spelling check.|
|stripPastedStyles|`boolean`|optional|Remove styles when pasting text into the editor.|  
|handleDroppedFiles|`(selectionState: SelectionState, files: Blob[]) => DraftHandleValue`|optional|Handle files that have been dropped into the editor. The `DraftHandleValue` is either `handled` or `not-handled`.|   

<br />

`TAutocomplete`

|Property|Type||description|
|---|---|---|---|
|strategies|`TAutocompleteStrategy[]`|required|Array of autocomplete strategies.|
|suggestLimit|`number`|optional|Defines the amount of suggestions to present to the user. Default is `5`.|   

<br />

`TAutocompleteStrategy`

|Property|Type||description|
|---|---|---|---|
|triggerChar|`string`|required|A single character that triggers the autocomplete strategy.|
|items|`TAutocompleteItem[]`|required|List of autocomplete suggestion items.| 
|insertSpaceAfter|`boolean`|optional|If `false` it won't add an space after inserting the content into the editor. Default is `true`.|   
|atomicBlockName|`string`|optional|Use an *atomic* custom control type to add the content to the editor.|   

<br />

`TAutocompleteItem`

|Property|Type||description|
|---|---|---|---|
|keys|`string[]`|required|The list of keys that the user needs to type to reveal this item suggestion.|
|value|`any`|required|The value to insert into the editor when the item is selected.|
|content|`string \| JSX.Element`|required|The content presented in the autocomplete suggestion list for this item. Note that this content is render under a `ListItem` component.|   

<br />

`TMUIRichTextEditorRef`

|Property|Type||description|
|---|---|---|---|
|focus|`() => void`||Triggers the focus event on the editor.|
|save|`() => void`||Triggers the save method on the editor.|
|insertAtomicBlock|`(name: string, data: any)`|deprecated|Use `insertAtomicBlockSync` instead.|
|insertAtomicBlockSync|`(name: string, data: any)`||Inserts an atomic block named as `name` (if exists) with the provided `data` into the editor.|
|insertAtomicBlockAsync|`(name: string, promise: Promise<TAsyncAtomicBlockResponse>, placeholder?: string) => void`||Inserts an atomic block named as `name` (if exists) asynchronously with the provided `data` into the editor. The `placeholder` text will be shown on the editor until the promise is resolved.|   

<br />   

`TAsyncAtomicBlockResponse`

|Property|Type||description|
|---|---|---|---|
|data|`any`|required|The data assigned to the entity added into the editor.|    

<br />   

## Changelog

Check the [release notes](https://github.com/niuware/mui-rte/releases) for the changelog.

## Development 

For development use:

```
$ npm run watch
$ npm run serve
```

## Future plans

- Increase test coverage
- Refactor code
- Add new features

## Suggestions and issues

Please feel free to leave your comment on the [Issues](https://github.com/niuware/mui-rte/issues) tab.

## License

Licensed under MIT License.
