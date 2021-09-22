import React, { useRef, useState, FunctionComponent, useEffect } from 'react'
import MUIRichTextEditor, { TMUIRichTextEditorRef, TAsyncAtomicBlockResponse } from '../..'
import Grid from '@mui/material/Grid'
import { makeStyles } from '@mui/styles'
import Popover from '@mui/material/Popover'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import BackupIcon from '@mui/icons-material/Backup'
import DoneIcon from '@mui/icons-material/Done'
import CloseIcon from '@mui/icons-material/Close'
import AttachFileIcon from '@mui/icons-material/AttachFile'

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
        console.log(`Uploading image ${file.name} ...`)
        setTimeout(() => {
            console.log("Upload successful")
            resolve(`https://return_uploaded_image_url/${file.name}`)
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
                url: url,
                width: 300,
                height: 200,
                alignment: "left", // or "center", "right"
                type: "image" // or "video"
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
                <Grid item container xs={12} justifyContent="flex-end">
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
                        props.onSubmit(data, !state.isCancelled)
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

    const handleFileUpload = (file: File) => {
        ref.current?.insertAtomicBlockAsync("IMAGE", uploadImage(file), "Uploading now...")
    }

    return (
        <>
            <UploadImagePopover
                anchor={anchor}
                onSubmit={(data, insert) => {
                    if (insert && data.file) {
                        handleFileUpload(data.file)
                    }
                    setAnchor(null)
                }}
            />
            <MUIRichTextEditor
                label="Drop a file inside the editor or press the last icon in the toolbar to simulate uploading an image...."
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
                draftEditorProps={{
                    handleDroppedFiles: (_selectionState, files) => {
                        if (files.length && (files[0] as File).name !== undefined) {
                            handleFileUpload(files[0] as File)
                            return "handled"
                        }
                        return "not-handled"
                    }
                }}
            />
        </>
    )
}

export default AsyncImageUpload
