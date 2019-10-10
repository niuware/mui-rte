import React from 'react'
import { createMuiTheme, Theme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIRichTextEditor from '../../'

export const defaultTheme: Theme = createMuiTheme({
    palette: {
        primary: {
            main: "#000000"
        }
    }
})

Object.assign(defaultTheme, {
    overrides: {
        MUIRichTextEditor: {
            root: {
                backgroundColor: "#ebebeb",
            },
            container: {
                display: "flex",
                flexDirection: "column-reverse"
            },
            editor: {
                backgroundColor: "#ebebeb",
                padding: "0 20px"
            },
            toolbar: {
                borderTop: "1px solid gray",
                backgroundColor: "#ebebeb"
            },
            placeHolder: {
                backgroundColor: "#ebebeb",
                paddingLeft: 20,
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