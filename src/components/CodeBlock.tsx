import React, {FunctionComponent} from 'react'
import {styled} from '@mui/material/styles'


interface IBlockquoteProps {
    children?: React.ReactNode
}

const PREFIX = 'MUIRichTextEditorCodeBlock';

const classes = {
    root: `${PREFIX}-root`
};

const Root = styled('div', {
    name: PREFIX,
    slot: 'Root',
    overridesResolver: (_, styles) => styles.root
})(({theme}) => ({
    [`&.${classes.root}`]: {
        backgroundColor: theme.palette.grey[200],
        padding: theme.spacing(1, 2, 1, 2)
    }
}));

const CodeBlock: FunctionComponent<IBlockquoteProps> = (props) => {
    return (
        <Root className={classes.root}>
            {props.children}
        </Root>
    )
}

export default CodeBlock
