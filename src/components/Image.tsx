import * as React from 'react'
import { ContentState, ContentBlock } from 'draft-js'

import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'

const styles = () => createStyles({
    root: {
    }
})

interface IImageProps extends WithStyles<typeof styles> {
    block: ContentBlock
    contentState: ContentState
}

const Image: React.FC<IImageProps> = (props: IImageProps) => {
    const { url } = props.contentState.getEntity(props.block.getEntityAt(0)).getData()
    return (
        <img src={url} className={props.classes.root} />
    )
}

export default withStyles(styles, { withTheme: true })(Image)