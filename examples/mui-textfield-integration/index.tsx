import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import RichTextField from './RichTextField'
import { EditorState } from 'draft-js'

const useStyles = makeStyles({
    richTextField: {
        '& #mui-rte-root': {
            minHeight: 192,
            padding: '0 16px',
        },
    },
})

const change = (state: EditorState) => {
    console.log(state)
}

const MUITextFieldIntegration = () => {
    const classes = useStyles()
    return (
        <RichTextField
            variant="outlined"
            label="TextField label"
            helperText="Some TextField helper text"
            placeholder="Type something here..."
            onChange={change}
            className={classes.richTextField} />
    )
}

export default MUITextFieldIntegration
