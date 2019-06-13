import * as React from 'react'
import * as ReactDOM from 'react-dom'
import MUIRichTextEditor from '../../'

const save = (data: string) => {
    console.log(data)
}

ReactDOM.render(
    <MUIRichTextEditor 
        label="Type something here..."
        onSave={save}
    />,
    document.getElementById("root")
)