import React from 'react'
import MUIRichTextEditor from '../../'
import InvertColorsIcon from '@material-ui/icons/InvertColors'
import TableChartIcon from '@material-ui/icons/TableChart'
import DoneIcon from '@material-ui/icons/Done'

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

const CustomControls = () => {
    return (
        <MUIRichTextEditor 
            label="Type something here..."
            onSave={save}
            controls={["title", "bold", "my-block", "my-style", "clear", "my-callback", "save"]}
            customControls={[
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
                    icon: <TableChartIcon />,
                    type: "block",
                    blockWrapper: <MyBlock />
                },
                {
                    name: "my-callback",
                    icon: <DoneIcon />,
                    type: "callback",
                    onClick: (editorState, name) => {
                        console.log(`Clicked ${name} control`)
                    }
                }
            ]}
        />
    )
}

export default CustomControls