import React from 'react'
import { EditorState, convertToRaw } from 'draft-js'
import MUIRichTextEditor from '../../'

const save = (data: string) => {
    console.log(data)
}

const focus = () => {
    console.log('Focus on MUIRichTextEditor');
}

const blur = () => {
    console.log('Focus lost on MUIRichTextEditor');
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
    // Check if editor is empty
    if (!state.getCurrentContent().hasText()) {
        console.log("empty")
    }
}

const Events = () => {
    return (
        <MUIRichTextEditor 
            label="Open the console to see the event callback as you type..."
            onSave={save}
            onChange={change}
            onFocus={focus}
            onBlur={blur}
        />
    )
}

export default Events