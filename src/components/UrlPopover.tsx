import React, { FunctionComponent, useState } from 'react'
import { Popover, TextField, Grid, Button } from '@material-ui/core'
import { createStyles, withStyles, WithStyles, Theme } from '@material-ui/core/styles'
import CheckIcon from '@material-ui/icons/Check'
import { getCompatibleSpacing } from '../utils'

const styles = ({spacing}: Theme) => createStyles({
    linkPopover: {
        padding: getCompatibleSpacing(spacing, 2, 2, 2, 2),
        maxWidth: 250
    },
    linkTextField: {
        width: "96%"
    }
})

interface IUrlPopoverStateProps extends WithStyles<typeof styles> {
    id: string
    url?: string
    width?: number
    height?: number
    anchor?: HTMLElement
    useSize?: boolean
    onConfirm: (url?: string, width?: number, height?: number) => void
}

type TUrlPopoverState = {
    urlError: boolean
    urlValue?: string
    width?: number
    height?: number
}

const UrlPopover: FunctionComponent<IUrlPopoverStateProps> = (props) => {

    const [state, setState] = useState<TUrlPopoverState>({
        urlError: false,
        urlValue: props.url,
        width: props.width,
        height: props.height
    })
    const {classes, id} = props
    const onSizeChange = (data: any, prop: "width" | "height") => {
        if (data === "") {
            setState({...state, [prop]: undefined})
            return
        }
        const value = parseInt(data, 10)
        if (isNaN(value)) {
            return 
        }
        setState({...state, [prop]: value})
    }
    
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
                <Grid container alignItems="flex-end" alignContent="center" direction="row" justify="flex-end">
                    <Grid item xs={9}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    id={id}
                                    className={classes.linkTextField}
                                    onChange={(event) => {setState({...state, urlValue: event.target.value})}}
                                    label="URL"
                                    defaultValue={props.url}
                                    error={state!.urlError}
                                    autoFocus={true}
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                />
                            </Grid>
                            {props.useSize ?
                            <>
                            <Grid item xs={4}>
                                <TextField
                                    onChange={(event) => onSizeChange(event.target.value, "width")}
                                    value={state.width || ""}
                                    label="Width"
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    onChange={(event) => onSizeChange(event.target.value, "height")}
                                    value={state.height || ""}
                                    label="Height"
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                />
                            </Grid>
                            <Grid item xs></Grid>
                            </>
                        : null }
                        </Grid>
                    </Grid>
                    <Grid item xs={3}>
                        <Grid container item xs>
                            <Button 
                                onClick={() => {
                                props.onConfirm(state.urlValue, state.width, state.height)
                            }}>
                                <CheckIcon />
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        </Popover>
    )
}

export default withStyles(styles, { withTheme: true })(UrlPopover)