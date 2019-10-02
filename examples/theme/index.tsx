import React from 'react'
import { createMuiTheme, Theme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIRichTextEditor from '../../'

export const defaultTheme: Theme = createMuiTheme()

Object.assign(defaultTheme, {
    overrides: {
        MUIRichTextEditor: {
            root: {
                backgroundColor: "#ebebeb",
            },
            editor: {
                borderBottom: "1px solid gray",
                backgroundColor: "#ebebeb",
                padding: "0 20px"
            },
            toolbar: {
                backgroundColor: "#ebebeb"
            },
            placeHolder: {
                backgroundColor: "#ebebeb",
                paddingLeft: "20px",
                width: "inherit"
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