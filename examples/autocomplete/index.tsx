import React, { FunctionComponent } from 'react'
import { Grid } from '@material-ui/core'
import MUIRichTextEditor from '../../'
import { TAutocompleteComponentProps } from '../../src/MUIRichTextEditor'

const save = (data: string) => {
    console.log(data)
}

const EmojiAutocomplete: FunctionComponent<TAutocompleteComponentProps> = (props) => {
    return (
        <div style={{
            padding: 10,
        }} onClick={props.onClick}>
            <Grid container>
                <Grid style={{cursor: 'pointer'}} item xs={3} data-value="&#x1F600;">&#x1F600;</Grid>
                <Grid style={{cursor: 'pointer'}} item xs={3} data-value="&#x1F601;">&#x1F601;</Grid>
                <Grid style={{cursor: 'pointer'}} item xs={3} data-value="&#x1F602;">&#x1F602;</Grid>
                <Grid style={{cursor: 'pointer'}} item xs={3} data-value="&#x1F603;">&#x1F603;</Grid>
                <Grid style={{cursor: 'pointer'}} item xs={3} data-value="&#x1F604;">&#x1F604;</Grid>
                <Grid style={{cursor: 'pointer'}} item xs={3} data-value="&#x1F605;">&#x1F605;</Grid>
            </Grid>
        </div>
    )
}

const Autocomplete = () => {
    return (
        <MUIRichTextEditor 
            label="Type something here..."
            onSave={save}
            autocompleteComponent={EmojiAutocomplete}
        />
    )
}

export default Autocomplete