import React, { FunctionComponent } from 'react'
import classNames from 'classnames'
import { ContentState, ContentBlock } from 'draft-js'
import { createStyles, withStyles, WithStyles, Theme } from '@material-ui/core/styles'

const styles = ({ shadows }: Theme) => createStyles({
    root: {
        margin: "5px 0 1px"
    },
    editable: {
        cursor: "pointer",
        "&:hover": {
            boxShadow: shadows[3]
        }
    },
    focused: {
        boxShadow: shadows[3]
    },
    centered: {
        textAlign: "center"
    },
    leftAligned: {
        textAlign: "left"
    },
    rightAligned: {
        textAlign: "right"
    }
})

interface IImageProps extends WithStyles<typeof styles> {
    block: ContentBlock
    contentState: ContentState
    blockProps: any
    onClick: (block: ContentBlock) => void
}

const Image: FunctionComponent<IImageProps> = (props) => {
    const { url, width, height, alignment } = props.contentState.getEntity(props.block.getEntityAt(0)).getData()
    const { onClick, readOnly, focusKey } = props.blockProps

    return (
        <div className={classNames({
            [props.classes.centered]: alignment === "center",
            [props.classes.leftAligned]: alignment === "left",
            [props.classes.rightAligned]: alignment === "right"
        })}>
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
        </div>
    )
}

export default withStyles(styles, { withTheme: true })(Image)