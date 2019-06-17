import React, { useState } from 'react'
import { Popover, TextField, Grid, Button } from '@material-ui/core'
import { createStyles, withStyles, WithStyles, Theme } from '@material-ui/core/styles'
import CheckIcon from '@material-ui/icons/Check'

const styles = ({spacing}: Theme) => createStyles({
    linkPopover: {
        padding: spacing(1, 2)
    },
    linkTextField: {
        width: "96%"
    }
})

interface ILinkPopoverStateProps extends WithStyles<typeof styles> {
    url?: string
    anchor?: HTMLElement
    onConfirm: (url?: string) => void
}

type TLinkPopoverState = {
    urlError: boolean
    urlValue?: string
}

const LinkPopover: React.FC<ILinkPopoverStateProps> = (props) => {

    const [state, setState] = useState<TLinkPopoverState>({
        urlError: false,
        urlValue: props.url
    })
    const {classes} = props
    
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
                            id="mui-rte-link-popover"
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

export default withStyles(styles, { withTheme: true })(LinkPopover)