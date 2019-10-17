import React, { FunctionComponent, useState } from 'react'
import { Popover, TextField, Grid, Button } from '@material-ui/core'
import { createStyles, withStyles, WithStyles, Theme } from '@material-ui/core/styles'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import CheckIcon from '@material-ui/icons/Check'
import DeleteIcon from '@material-ui/icons/DeleteOutline'
import FormatAlignCenter from '@material-ui/icons/FormatAlignCenter'
import FormatAlignLeft from '@material-ui/icons/FormatAlignLeft'
import FormatAlignRight from '@material-ui/icons/FormatAlignRight'
import { getCompatibleSpacing } from '../utils'

const styles = ({ spacing }: Theme) => createStyles({
    linkPopover: {
        padding: getCompatibleSpacing(spacing, 2, 2, 2, 2),
        maxWidth: 250
    },
    linkTextField: {
        width: "100%"
    }
})

export type TAlignment = "left" | "center" | "right"

interface IUrlPopoverStateProps extends WithStyles<typeof styles> {
    url?: string
    width?: number
    height?: number
    anchor?: HTMLElement
    alignment?: TAlignment
    useSize?: boolean
    onConfirm: (url?: string, ...args: any) => void
}

type TUrlPopoverState = {
    url?: string
    width?: number
    height?: number
}

const UrlPopover: FunctionComponent<IUrlPopoverStateProps> = (props) => {
    const [state, setState] = useState<TUrlPopoverState>({
        url: props.url,
        width: props.width,
        height: props.height
    })

    const [alignment, setAlignment] = useState<TAlignment | undefined>(props.alignment)

    const { classes } = props

    const onSizeChange = (data: any, prop: "width" | "height") => {
        if (data === "") {
            setState({ ...state, [prop]: undefined })
            return
        }
        const value = parseInt(data, 10)
        if (isNaN(value)) {
            return
        }
        setState({ ...state, [prop]: value })
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
                <Grid container spacing={1}>
                    <Grid container item xs spacing={1}>
                        <Grid item xs={12}>
                            <TextField
                                className={classes.linkTextField}
                                onChange={(event) => { setState({ ...state, url: event.target.value }) }}
                                label="URL"
                                defaultValue={props.url}
                                autoFocus={true}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </Grid>
                        {props.useSize ?
                            <>
                                <Grid item xs={12}>
                                    <ButtonGroup fullWidth>
                                        <Button 
                                            color={alignment === "left" ? "primary" : "default"} 
                                            size="small" 
                                            onClick={() => setAlignment("left")}
                                        >
                                            <FormatAlignLeft />
                                        </Button>
                                        <Button 
                                            color={alignment === "center" ? "primary" : "default"} 
                                            size="small" 
                                            onClick={() => setAlignment("center")}
                                        >
                                            <FormatAlignCenter />
                                        </Button>
                                        <Button 
                                            color={alignment === "right" ? "primary" : "default"} 
                                            size="small" 
                                            onClick={() => setAlignment("right")}>
                                            <FormatAlignRight />
                                        </Button>
                                    </ButtonGroup>
                                </Grid>
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
                                <Grid item xs={4}></Grid>
                            </>
                            : null}
                    </Grid>
                    <Grid container item xs={12} direction="row" justify="flex-end">
                        {props.url ?
                        <Button
                            onClick={() => props.onConfirm("")}
                        >
                            <DeleteIcon />
                        </Button>
                        : null }
                        <Button
                            onClick={() => props.onConfirm(state.url, state.width, state.height, alignment)}
                        >
                            <CheckIcon />
                        </Button>
                    </Grid>
                </Grid>
            </div>
        </Popover>
    )
}

export default withStyles(styles, { withTheme: true })(UrlPopover)