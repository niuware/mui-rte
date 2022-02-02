import React, {FunctionComponent} from 'react'
import {List, ListItem, Paper} from '@mui/material'
import {styled} from '@mui/material/styles';

export type TAutocompleteItem = {
    keys: string[]
    value: any
    content: string | JSX.Element
}

interface TAutocompleteProps {
    items: TAutocompleteItem[]
    top: number
    left: number
    selectedIndex: number
    onClick: (selectedIndex: number) => void
}

const PREFIX = 'MUIRichTextEditorAutocomplete';

const classes = {
    container: `${PREFIX}-container`,
    item: `${PREFIX}-item`
};

const Root = styled(Paper, {
    name: PREFIX,
    slot: 'Root',
    overridesResolver: (_, styles) => styles.root
})(() => ({
    [`&.${classes.container}`]: {
        minWidth: "200px",
        position: "absolute",
        zIndex: 10
    },
    [`& .${classes.item}`]: {
        cursor: "pointer"
    }
}));

const Autocomplete: FunctionComponent<TAutocompleteProps> = (props) => {
    if (!props.items.length) {
        return null
    }

    return (
        <Root className={classes.container} style={{
            top: props.top,
            left: props.left
        }}>
            <List dense={true}>
                {props.items.map((item, index) => (
                    <ListItem
                        key={index}
                        className={classes.item}
                        selected={index === props.selectedIndex}
                        onClick={() => props.onClick(index)}
                    >
                        {item.content}
                    </ListItem>
                ))}
            </List>
        </Root>
    )
}

export default Autocomplete
