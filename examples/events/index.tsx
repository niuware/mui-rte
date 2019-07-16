import * as React from 'react'
import { EditorState, convertToRaw } from 'draft-js'
import MUIRichTextEditor from '../../'

const save = (data: string) => {
    console.log(data)
}

const change = (state: EditorState) => {
    // More info about EditorState object at
    // https://draftjs.org/docs/api-reference-editor-state
    console.log(state.getSelection())
    console.log(JSON.stringify(convertToRaw(state.getCurrentContent())))
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