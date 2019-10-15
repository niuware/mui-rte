import React, { FunctionComponent } from 'react'
import classNames from 'classnames'
import { ContentState, ContentBlock } from 'draft-js'
import { createStyles, withStyles, WithStyles, Theme } from '@material-ui/core/styles'

const styles = ({ shadows }: Theme) => createStyles({
    root: {
    },
    editable: {
        cursor: "pointer",
        "&:hover": {
            boxShadow: shadows[3]
        }
    },
    focused: {
        boxShadow: shadows[3]
    }
})

interface IImageProps extends WithStyles<typeof styles> {
    block: ContentBlock
    contentState: ContentState
    blockProps: any
    onClick: (block: ContentBlock) => void
}

const Image: FunctionComponent<IImageProps> = (props) => {
    const { url, width, height } = props.contentState.getEntity(props.block.getEntityAt(0)).getData()
    const { onClick, readOnly, focusKey } = props.blockProps
    return (
        <img 
            src={url} 
            className={classNames(props.classes.root, {
                [props.classes.editable]: !readOnly,
                [props.classes.focused]: !readOnly && focusKey === props.block.getKey()
            })} 
            width={width} 
            height={height}
            onClick={() => {
                if (readOnly) {
                    return
                }
                onClick(props.block)
            }}
        />
    )
}

export default withStyles(styles, { withTheme: true })(Image)