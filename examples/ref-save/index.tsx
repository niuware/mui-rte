import React, { FunctionComponent, useRef } from 'react'
import MUIRichTextEditor from '../../'

const RefSave: FunctionComponent = () => {

    const ref = useRef()

    const handleClick = () => {
        (ref as any).current.save()
    }

    const handleFocus = () => {
        (ref as any).current.focus()
    }

    const handleSave = (data: string) => {
        console.log(data)
    }

    return (
        <div>
            Save editor state from external button: 
            <button style={{
                    marginLeft: 5,
                    padding: 5
                }} 
                onClick={handleClick}>
                Save
            </button>
            <button style={{
                    marginLeft: 5,
                    padding: 5
                }}
                onClick={handleFocus}>
                Focus
            </button>
            <MUIRichTextEditor 
                label="Type something here..."
                onSave={handleSave}
                ref={ref}
                controls={["bold", "italic", "underline", "quote", "clear"]}
            />
        </div>
    )
}

export default RefSave