import React, {FunctionComponent} from 'react'
import {styled} from '@mui/material/styles'

interface IBlockquoteProps {
    children?: React.ReactNode
}

const PREFIX = 'MUIRichTextEditorBlockquote';

const classes = {
    root: `${PREFIX}-root`
};

const Root = styled('div', {
    name: PREFIX,
    slot: 'Root',
    overridesResolver: (_, styles) => styles.root
})(({theme}) => ({
    [`&.${classes.root}`]: {
        fontStyle: "italic",
        color: theme.palette.grey[800],
        borderLeft: `4px solid ${theme.palette.grey.A100}`
    }
}));

const Blockquote: FunctionComponent<IBlockquoteProps> = (props) => {
    return (
        <Root className={classes.root}>
            {props.children}
        </Root>
    )
}

export default Blockquote
