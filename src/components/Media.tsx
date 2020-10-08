import React, { FunctionComponent } from 'react'
import classNames from 'classnames'
import { ContentState, ContentBlock } from 'draft-js'
import { createStyles, withStyles, WithStyles, Theme } from '@material-ui/core/styles'

interface IMediaProps extends WithStyles<typeof styles> {
    block: ContentBlock
    contentState: ContentState
    blockProps: any
    onClick: (block: ContentBlock) => void
}

const styles = ({ shadows }: Theme) => createStyles({
    root: {
        margin: "5px 0 1px",
        outline: "none"
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

const Media: FunctionComponent<IMediaProps> = (props) => {
    const { url, width, height, alignment, type } = props.contentState.getEntity(props.block.getEntityAt(0)).getData()
    const { onClick, readOnly, focusKey } = props.blockProps

    const htmlTag = () => {
        const componentProps = {
            src: url,
            className: classNames(props.classes.root, {
                [props.classes.editable]: !readOnly,
                [props.classes.focused]: !readOnly && focusKey === props.block.getKey()
            }),
            width: width,
            height: type === "video" ? "auto" : height,
            onClick: () => {
                if (readOnly) {
                    return
                }
                onClick(props.block)
            }
        }

        if (!type || type === "image") {
            return <img {...componentProps} />
        }
        if (type === "video") {
            return <video {...componentProps} autoPlay={false} controls />
        }
        if (type === "youtube") {
            const youtubeDefaultwidth = componentProps.width ? componentProps.width : 560;
            const youtubeDefaultheight = componentProps.height ? componentProps.height : 315;
            const srcLink = componentProps.src.split('/')[3].split('v=')[1];
            return <iframe width={youtubeDefaultwidth} height={youtubeDefaultheight} src={`https://www.youtube.com/embed/${srcLink}`} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        }
        return null
    }

    return (
        <div className={classNames({
            [props.classes.centered]: alignment === "center",
            [props.classes.leftAligned]: alignment === "left",
            [props.classes.rightAligned]: alignment === "right"
        })}>
            {htmlTag()}
        </div>
    )
}

export default withStyles(styles, { withTheme: true })(Media)
