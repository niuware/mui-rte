import React from 'react'
import { EditorState, RichUtils } from 'draft-js'
import MUIRichTextEditor from '../../'

const save = (data: string) => {
    console.log(data)
}

const KeyBindings = () => {
    return (
        <MUIRichTextEditor 
            label="Press CMD + C to clear the editor or CMD + K to add 'italic' style to the selection..."
            onSave={save}
            controls={["title", "italic", "save"]}
            keyCommands={[
                {
                    key: 67, // C
                    name: "clear-all",
                    callback: (_) => {
                        return EditorState.createEmpty()
                    }
                },
                {
                    key: 75, // K
                    name: "toggle-italic",
                    callback: (editorState: EditorState) => {
                        const newState = RichUtils.toggleInlineStyle(editorState, "ITALIC")
                        return newState
                    }
                }
            ]}
        />
    )
}

export default KeyBindings