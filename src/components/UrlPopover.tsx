import React, { FunctionComponent, useState } from 'react'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Popover from '@material-ui/core/Popover'
import TextField from '@material-ui/core/TextField'
import { createStyles, withStyles, WithStyles, Theme } from '@material-ui/core/styles'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import InsertPhotoIcon from '@material-ui/icons/InsertPhoto'
import MovieIcon from '@material-ui/icons/Movie'
import CheckIcon from '@material-ui/icons/Check'
import DeleteIcon from '@material-ui/icons/DeleteOutline'
import FormatAlignCenter from '@material-ui/icons/FormatAlignCenter'
import FormatAlignLeft from '@material-ui/icons/FormatAlignLeft'
import FormatAlignRight from '@material-ui/icons/FormatAlignRight'

export type TAlignment = "left" | "center" | "right"

export type TMediaType = "image" | "video"

export type TUrlData = {
    url?: string
    width?: number
    height?: number
    alignment?: TAlignment
    type?: TMediaType
}

interface IUrlPopoverStateProps extends WithStyles<typeof styles> {
    anchor?: HTMLElement
    data?: TUrlData
    isMedia?: boolean
    onConfirm: (isMedia?: boolean, ...args: any) => void
}

const styles = ({ spacing }: Theme) => createStyles({
    linkPopover: {
        padding: spacing(2, 2, 2, 2),
        maxWidth: 250
    },
    linkTextField: {
        width: "100%"
    }
})

const UrlPopover: FunctionComponent<IUrlPopoverStateProps> = (props) => {
    const [data, setData] = useState<TUrlData>(props.data || {
        url: undefined,
        width: undefined,
        height: undefined,
        alignment: undefined,
        type: undefined
    })

    const { classes } = props

    const onSizeChange = (value: any, prop: "width" | "height") => {
        if (value === "") {
            setData({ ...data, [prop]: undefined })
            return
        }
        const intValue = parseInt(value, 10)
        if (isNaN(intValue)) {
            return
        }
        setData({ ...data, [prop]: intValue })
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
                                onChange={(event) => setData({...data, url: event.target.value})}
                                label="URL"
                                defaultValue={props.data && props.data.url}
                                autoFocus={true}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </Grid>
                        {props.isMedia ?
                            <>
                                <Grid item xs={12}>
                                    <ButtonGroup fullWidth>
                                        <Button 
                                            color={(!data.type || data.type === "image") ? "primary" : "default"} 
                                            size="small" 
                                            onClick={() => setData({...data, type: "image"})}
                                        >
                                            <InsertPhotoIcon />
                                        </Button>
                                        <Button 
                                            color={data.type === "video" ? "primary" : "default"} 
                                            size="small" 
                                            onClick={() => setData({...data, type: "video"})}
                                        >
                                            <MovieIcon />
                                        </Button>
                                    </ButtonGroup>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        onChange={(event) => onSizeChange(event.target.value, "width")}
                                        value={data.width || ""}
                                        label="Width"
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        onChange={(event) => onSizeChange(event.target.value, "height")}
                                        value={data.height || ""}
                                        label="Height"
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <ButtonGroup fullWidth>
                                        <Button 
                                            color={data.alignment === "left" ? "primary" : "default"} 
                                            size="small" 
                                            onClick={() => setData({...data, alignment: "left"})}
                                        >
                                            <FormatAlignLeft />
                                        </Button>
                                        <Button 
                                            color={data.alignment === "center" ? "primary" : "default"} 
                                            size="small" 
                                            onClick={() => setData({...data, alignment: "center"})}
                                        >
                                            <FormatAlignCenter />
                                        </Button>
                                        <Button 
                                            color={data.alignment === "right" ? "primary" : "default"} 
                                            size="small" 
                                            onClick={() => setData({...data, alignment: "right"})}>
                                            <FormatAlignRight />
                                        </Button>
                                    </ButtonGroup>
                                </Grid>
                            </>
                            : null}
                    </Grid>
                    <Grid container item xs={12} direction="row" justify="flex-end">
                        {props.data && props.data.url ?
                        <Button
                            onClick={() => props.onConfirm(props.isMedia, "")}
                        >
                            <DeleteIcon />
                        </Button>
                        : null }
                        <Button
                            onClick={() => props.onConfirm(props.isMedia, data.url, data.width, data.height, data.alignment, data.type)}
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