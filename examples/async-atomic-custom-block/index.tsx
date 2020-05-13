import React, { useRef, useState, FunctionComponent, useEffect } from 'react'
import MUIRichTextEditor from '../..'
import { TMUIRichTextEditorRef, TAsyncAtomicBlockResponse} from '../../src/MUIRichTextEditor'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Popover from '@material-ui/core/Popover'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import UpdateIcon from '@material-ui/icons/Update'
import DoneIcon from '@material-ui/icons/Done'
import CloseIcon from '@material-ui/icons/Close'

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
                <Grid item xs={12}>
                    <TextField 
                        {...textFieldProps}
                        autoFocus={true} 
                        label="Search term"
                        name="searchTerm"
                        placeholder="Type anything here..."
                    />
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
