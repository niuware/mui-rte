import React, { FunctionComponent } from 'react'
import { Paper, List, ListItem } from '@mui/material'
import { createStyles, withStyles, WithStyles } from '@mui/styles'

export type TAutocompleteItem = {
    keys: string[]
    value: any
    content: string | JSX.Element
}

interface TAutocompleteProps extends WithStyles<typeof styles> {
    items: TAutocompleteItem[]
    top: number
    left: number
    selectedIndex: number
    onClick: (selectedIndex: number) => void
}

const styles = () => createStyles({
    container: {
        minWidth: "200px",
        position: "absolute",
        zIndex: 10
    },
    item: {
        cursor: "pointer"
    }
})

const Autocomplete: FunctionComponent<TAutocompleteProps> = (props) => {
    if (!props.items.length) {
        return null
    }

    const { classes } = props
    return (
        <Paper className={classes.container} style={{
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
        </Paper>
    )
}

export default withStyles(styles, { withTheme: true })(Autocomplete)
