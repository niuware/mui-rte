import React, { useState } from 'react'
import { Popover, TextField, Grid, Button } from '@material-ui/core'
import { createStyles, withStyles, WithStyles, Theme } from '@material-ui/core/styles'
import CheckIcon from '@material-ui/icons/Check'
import { getCompatibleSpacing } from '../utils'

const styles = ({spacing}: Theme) => createStyles({
    linkPopover: {
        padding: getCompatibleSpacing(spacing, 1, 2, 1, 2)
    },
    linkTextField: {
        width: "96%"
    }
})

interface IUrlPopoverStateProps extends WithStyles<typeof styles> {
    id: string
    url?: string
    anchor?: HTMLElement
    onConfirm: (url?: string) => void
}

type TUrlPopoverState = {
    urlError: boolean
    urlValue?: string
}

const UrlPopover: React.FC<IUrlPopoverStateProps> = (props) => {

    const [state, setState] = useState<TUrlPopoverState>({
        urlError: false,
        urlValue: props.url
    })
    const {classes, id} = props
    
    return (
        <Popover
            open={props.anchor !== undefined}
            anchorEl={props.anchor}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "left"
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
        >
            <div className={classes.linkPopover}>
                <Grid container>
                    <Grid item xs={9}>
                        <TextField
                            id={id}
                            className={classes.linkTextField}
                            onChange={(event) => {setState({...state, urlValue: event.target.value})}}
                            placeholder="URL"
                            defaultValue={props.url}
                            error={state!.urlError}
                            autoFocus={true}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Button 
                            onClick={() => {
                            props.onConfirm(state.urlValue)
                        }}>
                            <CheckIcon />
                        </Button>
                    </Grid>
                </Grid>
            </div>
        </Popover>
    )
}

export default withStyles(styles, { withTheme: true })(UrlPopover)