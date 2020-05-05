import React, { FunctionComponent } from 'react'
import { createStyles, withStyles, WithStyles, Theme } from '@material-ui/core/styles'

const styles = ({ palette }: Theme) => createStyles({
    root: {
        fontStyle: "italic",
        color: palette.grey[800],
        borderLeft: `4px solid ${palette.grey.A100}`
    }
})

interface IBlockquoteProps extends WithStyles<typeof styles> {
    children?: React.ReactNode
}

const Blockquote: FunctionComponent<IBlockquoteProps> = (props) => {
    return (
        <div className={props.classes.root}>
            {props.children}
        </div>
    )
}

export default withStyles(styles, { withTheme: true })(Blockquote)