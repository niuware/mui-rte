import React from 'react'
import MUIRichTextEditor from '../../'
import InvertColorsIcon from '@material-ui/icons/InvertColors'

const CustomInlineToolbar = () => {
    return (
        <MUIRichTextEditor 
            label="Try selecting some text to show the inline toolbar..."
            inlineToolbar={true}
            inlineToolbarControls={["bold", "italic", "my-style", "link"]}
            customControls={[
                {
                    name: "my-style",
                    icon: <InvertColorsIcon />,
                    type: "inline",
                    inlineStyle: {
                        backgroundColor: "black",
                        color: "white"
                    }
                }
            ]}
        />
    )
}

export default CustomInlineToolbar