import React, {FunctionComponent, useRef} from 'react'
import MUIRichTextEditor, {TMUIRichTextEditorRef} from '../..'
import EmojiIcon from '@mui/icons-material/SentimentSatisfiedOutlined';
import IconButton from '@mui/material/IconButton'

const Emoji: FunctionComponent = () => {
    const ref = useRef<TMUIRichTextEditorRef>(null)

    const handleClick = () => {
        ref.current?.insertText("🤣")
    }

    return (
        <>
            <IconButton onClick={handleClick}><EmojiIcon /></IconButton>
            <MUIRichTextEditor
                label="Click the button to insert an emoji inline"
                ref={ref}
            />
        </>
    )
}

export default Emoji
