import * as React from 'react'
import { createStyles, withStyles, WithStyles, Theme } from '@material-ui/core/styles'

const styles = ({ spacing, palette }: Theme) => createStyles({
    root: {
        backgroundColor: palette.grey[200],
        padding: spacing(1, 2)
    }
})

interface IBlockquoteProps extends WithStyles<typeof styles> {
    children?: React.ReactNode
}

const CodeBlock: React.FC<IBlockquoteProps> = (props: IBlockquoteProps) => {
    return (
        <div className={props.classes.root}>
            {props.children}
        </div>
    )
}

export default withStyles(styles, { withTheme: true })(CodeBlock)