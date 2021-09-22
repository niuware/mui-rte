import React, { useRef, useState, FunctionComponent, useEffect } from 'react'
import MUIRichTextEditor, { TMUIRichTextEditorRef, TAsyncAtomicBlockResponse } from '../..'
import { makeStyles } from '@mui/styles'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Popover from '@mui/material/Popover'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import UpdateIcon from '@mui/icons-material/Update'
import DoneIcon from '@mui/icons-material/Done'
import CloseIcon from '@mui/icons-material/Close'

type TMyCardData = {
    searchTerm?: string
}

type TAnchor = HTMLElement | null

interface IMyCardPopoverProps {
    anchor: TAnchor
    onSubmit: (data: TMyCardData, insert: boolean) => void
}

type TMyCardPopoverState = {
    anchor: TAnchor
    isCancelled: boolean
}

const cardPopverStyles = makeStyles({
    root: {
        padding: 10,
        maxWidth: 350
    },
    textField: {
        width: "100%"
    }
})

const cardStyles = makeStyles({
    root: {
        maxWidth: 345
    },
})

const getDataFromCloudService = (searchTerm: string) => {
    return new Promise(resolve => {
        console.log(`Searching for ${searchTerm}...`)
        setTimeout(() => {
            resolve({
                title: "Data from cloud",
                subtitle: `You searched: ${searchTerm}`,
                text: "Some description from the cloud.",
            })
        }, 2000)
    })
}

const downloadData = (searchTerm: string) => {
    return new Promise<TAsyncAtomicBlockResponse>(async (resolve, reject) => {
        const data = await getDataFromCloudService(searchTerm)
        if (!data) { // for this example this will never be rejected
            reject()
            return
        }
        resolve({
            data: data
        })
    })
}

const MyCard: FunctionComponent<any> = (props) => {
    const { blockProps } = props
    const classes = cardStyles(props)

    return (
        <Card className={classes.root}>
            <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                    {blockProps.title}
                </Typography>
                <Typography gutterBottom component="h2">
                    {blockProps.subtitle}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    {blockProps.text}
                </Typography>
            </CardContent>
        </Card>
    )
}

const MyCardPopover: FunctionComponent<IMyCardPopoverProps> = (props) => {
    const classes = cardPopverStyles(props)
    const [state, setState] = useState<TMyCardPopoverState>({
        anchor: null,
        isCancelled: false
    })
    const [data, setData] = useState<TMyCardData>({})

    useEffect(() => {
        setState({
            anchor: props.anchor,
            isCancelled: false
        })
    }, [props.anchor])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setData({
            ...data,
            [event.target.name]: event.target.value
        })
    }

    const textFieldProps = {
        className: classes.textField,
        onChange: handleChange,
        InputLabelProps: {
            shrink: true
        }
    }

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
                <Grid item xs={12}>
                    <TextField
                        {...textFieldProps}
                        autoFocus={true}
                        label="Search term"
                        name="searchTerm"
                        placeholder="Type anything here..."
                    />
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

const AsyncAtomicCustomBlock: FunctionComponent = () => {

    const ref = useRef<TMUIRichTextEditorRef>(null)
    const [anchor, setAnchor] = useState<HTMLElement | null>(null)
    return (
        <>
            <MyCardPopover
                anchor={anchor}
                onSubmit={(data, insert) => {
                    if (insert && data.searchTerm) {
                        ref.current?.insertAtomicBlockAsync("my-card", downloadData(data.searchTerm), "Downloading data...")
                    }
                    setAnchor(null)
                }}
            />
            <MUIRichTextEditor
                label="Press the last icon in the toolbar to insert an async atomic custom block..."
                ref={ref}
                controls={["title", "bold", "underline", "add-card"]}
                customControls={[
                    {
                        name: "my-card",
                        type: "atomic",
                        atomicComponent: MyCard
                    },
                    {
                        name: "add-card",
                        icon: <UpdateIcon />,
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

export default AsyncAtomicCustomBlock
