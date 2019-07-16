import * as React from 'react'
import { createMuiTheme, Theme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIRichTextEditor from '../../'

export const defaultTheme: Theme = createMuiTheme()

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

const save = (data: string) => {
    console.log(data)
}

const Theme = () => {
    return (
        <MuiThemeProvider theme={defaultTheme}>
            <MUIRichTextEditor 
                label="Type something here..."
                onSave={save}
            />
        </MuiThemeProvider>
    )
}

export default Theme