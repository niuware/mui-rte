import React, { FunctionComponent, useState } from 'react'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Popover from '@mui/material/Popover'
import TextField from '@mui/material/TextField'
import { createStyles, withStyles, WithStyles } from '@mui/styles'
import { Theme } from '@mui/material/styles'
import ButtonGroup from '@mui/material/ButtonGroup'
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto'
import MovieIcon from '@mui/icons-material/Movie'
import CheckIcon from '@mui/icons-material/Check'
import DeleteIcon from '@mui/icons-material/DeleteOutline'
import FormatAlignCenter from '@mui/icons-material/FormatAlignCenter'
import FormatAlignLeft from '@mui/icons-material/FormatAlignLeft'
import FormatAlignRight from '@mui/icons-material/FormatAlignRight'

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
    onCancel: () => void
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
            onClose={props.onCancel}
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
                                            color={(!data.type || data.type === "image") ? "primary" : "inherit"} 
                                            size="small" 
                                            onClick={() => setData({...data, type: "image"})}
                                        >
                                            <InsertPhotoIcon />
                                        </Button>
                                        <Button 
                                            color={data.type === "video" ? "primary" : "inherit"} 
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
                                            color={data.alignment === "left" ? "primary" : "inherit"} 
                                            size="small" 
                                            onClick={() => setData({...data, alignment: "left"})}
                                        >
                                            <FormatAlignLeft />
                                        </Button>
                                        <Button 
                                            color={data.alignment === "center" ? "primary" : "inherit"} 
                                            size="small" 
                                            onClick={() => setData({...data, alignment: "center"})}
                                        >
                                            <FormatAlignCenter />
                                        </Button>
                                        <Button 
                                            color={data.alignment === "right" ? "primary" : "inherit"} 
                                            size="small" 
                                            onClick={() => setData({...data, alignment: "right"})}>
                                            <FormatAlignRight />
                                        </Button>
                                    </ButtonGroup>
                                </Grid>
                            </>
                            : null}
                    </Grid>
                    <Grid container item xs={12} direction="row" justifyContent="flex-end">
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
