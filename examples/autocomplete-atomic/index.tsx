import { makeStyles } from '@material-ui/core'
import Avatar from '@material-ui/core/Avatar'
import Chip from '@material-ui/core/Chip'
import { EditorState, Modifier, RichUtils, SelectionState } from 'draft-js'
import React, { FunctionComponent } from 'react'
import MUIRichTextEditor from '../../'
import { TAutocompleteItem } from '../../src/components/Autocomplete'



const save = (data: string) => {
    console.log(data)
}

const useStyles = makeStyles({
    autocomplete: {
        backgroundColor: "lightgrey",
        border: "1px solid grey",
        borderRadius: "3px",
    }
})
const cities: TAutocompleteItem[] = [
    {
        keys: ["mexico"],
        value: {
            name: "Mexico City",
            image: "🇲🇽"
        },
        content: "Mexico City",
    },
    {
        keys: ["mexico", "beach"],
        value: {
            name: "Cancun",
            image: "🚩"
        },
        content: "Cancun",
    },
    {
        keys: ["japan", "olympics"],
        value: {
            name: "Tokyo",
            image: "🇯🇵"
        },
        content: "Tokyo",
    },
    {
        keys: ["japan"],
        value: {
            name: "Osaka",
            image: "🏁"
        },
        content: "Osaka",
    }
]

// This autocomplete will change the block style to unordered-list-item
// Autocomplete sequence is * + space
const shortcutBullet: TAutocompleteItem[] = [
    {
        keys: [""],
        value: "unordered-list-item",
        content: ""
    }
]

// This autocomplete will change the block style to ordered-list-item
// Autocomplete sequence is 1 + . + space
const shortcutNumber: TAutocompleteItem[] = [
    {
        keys: ["."],
        value: "ordered-list-item",
        content: ""
    }
]


const CityChip: FunctionComponent<any> = (props) => {
    const { blockProps } = props
    const { value } = blockProps // Get the value provided in the TAutocompleteItem[]

    const handleClick = () => {
        console.log(value.name)
    }

    return (
        <Chip
            avatar={<Avatar>{value.image}</Avatar>}
            label={value.name}
            onClick={handleClick}
        />
    )
}

const handleShortcut = (editorState: EditorState, selectionState: SelectionState, value: string): EditorState => {
    const contentState = Modifier.removeRange(editorState.getCurrentContent(), selectionState, "forward")
    editorState = EditorState.push(editorState, contentState, "remove-range")
    editorState = RichUtils.toggleBlockType(editorState, value);
    editorState = EditorState.forceSelection(editorState, editorState.getCurrentContent().getSelectionAfter())
    return editorState;
}

const AutocompleteAtomic = () => {
    const classes = useStyles();
    return (
        <MUIRichTextEditor
            classes={{
                autocomplete: classes.autocomplete,
            }}
            label="Try typing '/mexico'..."
            onSave={save}
            customControls={[
                {
                    name: "my-city",
                    type: "atomic",
                    atomicComponent: CityChip
                }
            ]}
            autocomplete={{
                strategies: [
                    {
                        items: cities,
                        triggerChar: "/",
                        atomicBlockName: "my-city",
                        minSearchChars: 1,
                    },
                    {
                        items: shortcutBullet,
                        triggerChar: "*",
                        minSearchChars: 1,
                        handleAutoComplete: handleShortcut,
                    },
                    {
                        items: shortcutNumber,
                        triggerChar: "1",
                        minSearchChars: 2,
                        handleAutoComplete: handleShortcut,

                    }
                ]
            }}
        />
    )
}

export default AutocompleteAtomic