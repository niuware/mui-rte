import * as React from 'react'
import { EditorState, convertToRaw } from 'draft-js'
import MUIRichTextEditor from '../../'

const save = (data: string) => {
    console.log(data)
}

const change = (state: EditorState) => {
    // More info about EditorState object at
    // https://draftjs.org/docs/api-reference-editor-state
    //
    // Get current selection
    console.log(state.getSelection())
    // Get current content
    console.log(JSON.stringify(convertToRaw(state.getCurrentContent())))
    // Get current text
    console.log(state.getCurrentContent().getPlainText())
}

const Events = () => {
    return (
        <MUIRichTextEditor 
            label="Type something here..."
            onSave={save}
            onChange={change}
        />
    )
}

export default Events