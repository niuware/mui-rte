import React, { FunctionComponent } from 'react'
import { Chip, Avatar, Button } from '@material-ui/core'
import InvertColorsIcon from '@material-ui/icons/InvertColors'
import LooksOneIcon from '@material-ui/icons/LooksOne'
import LooksTwoIcon from '@material-ui/icons/LooksTwo'
import Looks3Icon from '@material-ui/icons/Looks3'
import MUIRichTextEditor from '../../'
import { TToolbarComponentProps } from '../../src/components/Toolbar'
import { EditorState } from 'draft-js'

const save = (data: string) => {
    console.log(data)
}

const MyBlock = (props: any) => {
    return (
        <div style={{
            padding: 10,
            backgroundColor: "#ebebeb"
        }}>
            My Block says:
            {props.children}
        </div>
    )
}

const MyCallbackComponent: FunctionComponent<TToolbarComponentProps> = (props) => {
    return (
        <Chip 
            id={props.id}
            avatar={<Avatar>C</Avatar>} 
            onClick={props.onMouseDown}
            label="Callback"
            disabled={props.disabled}
        />
    )
}

const ClearComponent: FunctionComponent<TToolbarComponentProps> = (props) => {
    return (
        <Chip 
            id={props.id}
            onClick={props.onMouseDown}
            label="Clear all"
            disabled={props.disabled}
        />
    )
}

const MyBlockComponent: FunctionComponent<TToolbarComponentProps> = (props) => {
    return (
        <Button
            id={props.id}
            variant="contained"
            onMouseDown={props.onMouseDown}
            color={props.active ? "primary": "default"}
            disabled={props.disabled}
        >
            My Block
        </Button>
    )
}

const CustomControls = () => {
    return (
        <MUIRichTextEditor 
            label="Type something here..."
            onSave={save}
            controls={["h1", "h2", "h3", "bold", "my-block", "my-style", "clear", "my-callback", "clear-callback", "save"]}
            customControls={[
                {
                    name: "h1",
                    style: "header-one",
                    icon: <LooksOneIcon />,
                    type: "block"
                },
                {
                    name: "h2",
                    style: "header-two",
                    icon: <LooksTwoIcon />,
                    type: "block"
                },
                {
                    name: "h3",
                    style: "header-three",
                    icon: <Looks3Icon />,
                    type: "block"
                },
                {
                    name: "my-style",
                    icon: <InvertColorsIcon />,
                    type: "inline",
                    inlineStyle: {
                        backgroundColor: "black",
                        color: "white"
                    }
                },
                {
                    name: "my-block",
                    component: MyBlockComponent,
                    type: "block",
                    blockWrapper: <MyBlock />
                },
                {
                    name: "my-callback",
                    component: MyCallbackComponent,
                    type: "callback",
                    onClick: (_editorState, name, _anchor) => {
                        console.log(`Clicked ${name} control`)
                    }
                },
                {
                    name: "clear-callback",
                    component: ClearComponent,
                    type: "callback",
                    onClick: () => {
                        return EditorState.createEmpty()
                    }
                }
            ]}
        />
    )
}

export default CustomControls