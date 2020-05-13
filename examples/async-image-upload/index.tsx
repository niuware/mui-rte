import React, { useRef, useState, FunctionComponent, useEffect } from 'react'
import MUIRichTextEditor from '../..'
import { TMUIRichTextEditorRef, TAsyncAtomicBlockResponse } from '../../src/MUIRichTextEditor'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import Popover from '@material-ui/core/Popover'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import BackupIcon from '@material-ui/icons/Backup'
import DoneIcon from '@material-ui/icons/Done'
import CloseIcon from '@material-ui/icons/Close'
import AttachFileIcon from '@material-ui/icons/AttachFile'

interface IUploadImagePopoverProps {
    anchor: TAnchor
    onSubmit: (data: TUploadImageData, insert: boolean) => void
}

type TUploadImagePopoverState = {
    anchor: TAnchor
    isCancelled: boolean
}

type TUploadImageData = {
    file?: File
}

type TAnchor = HTMLElement | null

const cardPopverStyles = makeStyles({
    root: {
        padding: 10,
        maxWidth: 350
    },
    textField: {
        width: "100%"
    },
    input: {
        display: "none"
    }
})

const uploadImageToServer = (file: File) => {
    return new Promise(resolve => {
        console.log(`Uploading image ${file.name}...`)
        setTimeout(() => {
            console.log("Uploaded successful")
            resolve("https://return_uploaded_image_url")
        }, 2000)
    })
}

const uploadImage = (file: File) => {
    return new Promise<TAsyncAtomicBlockResponse>(async (resolve, reject) => {
        const url = await uploadImageToServer(file)
        if (!url) {
            reject()
            return
        }
        resolve({
            data: {
                url: url
            }
        })
    })
}

const UploadImagePopover: FunctionComponent<IUploadImagePopoverProps> = (props) => {
    const classes = cardPopverStyles(props)
    const [state, setState] = useState<TUploadImagePopoverState>({
        anchor: null,
        isCancelled: false
    })
    const [data, setData] = useState<TUploadImageData>({})

    useEffect(() => {
        setState({
            anchor: props.anchor,
            isCancelled: false
        })
        setData({
            file: undefined
        })
    }, [props.anchor])

    return (
        <Popover
            anchorEl={state.anchor}
            open={state.anchor !== null}
            onExited={() => {
                props.onSubmit(data, !state.isCancelled)
            }}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "right"
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
        >
            <Grid container spacing={1} className={classes.root}>
                <Grid item xs={10}>
                    <TextField 
                        className={classes.textField} 
                        disabled
                        value={data.file?.name || ""}
                        placeholder="Click icon to attach image"
                    />
                </Grid>
                <Grid item xs={2}>
                    <input
                        accept="image/*"
                        className={classes.input}
                        id="contained-button-file"
                        type="file"
                        onChange={(event) => {
                            setData({
                                ...data,
                                file: event.target.files![0]
                            })
                        }}
                    />
                    <label htmlFor="contained-button-file">
                        <IconButton color="primary" aria-label="upload image" component="span">
                            <AttachFileIcon />
                        </IconButton>
                    </label>
                </Grid>
                <Grid item container xs={12} justify="flex-end">
                    <Button onClick={() => {
                        setState({
                            anchor: null,
                            isCancelled: true
                        })
                    }}
                    >
                        <CloseIcon />
                    </Button>
                    <Button onClick={() => {
                        setState({
                            anchor: null,
                            isCancelled: false
                        })
                    }}
                    >
                        <DoneIcon />
                    </Button>
                </Grid>
            </Grid>
        </Popover>
    )
}

const AsyncImageUpload: FunctionComponent = () => {
    
    const ref = useRef<TMUIRichTextEditorRef>(null)
    const [anchor, setAnchor] = useState<HTMLElement | null>(null)
    return (
        <>
            <UploadImagePopover 
                anchor={anchor}
                onSubmit={(data, insert) => {
                    if (insert && data.file) {
                        ref.current?.insertAtomicBlockAsync("IMAGE", uploadImage(data.file), "Uploading now...")
                    }
                    setAnchor(null)
                }}
            />
            <MUIRichTextEditor
                label="Press the last icon in the toolbar to simulate uploading an image...."
                ref={ref}
                controls={["title", "bold", "underline", "media", "upload-image"]}
                customControls={[
                    {
                        name: "upload-image",
                        icon: <BackupIcon />,
                        type: "callback",
                        onClick: (_editorState, _name, anchor) => {
                            setAnchor(anchor)
                        }
                    }
                ]}
            />
        </>
    )
}

export default AsyncImageUpload
