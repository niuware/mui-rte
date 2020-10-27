import React, { FunctionComponent } from 'react'
import Avatar from '@material-ui/core/Avatar'
import Chip from '@material-ui/core/Chip'
import MUIRichTextEditor from '../../'
import { TAutocompleteItem } from '../../src/components/Autocomplete'
import { makeStyles } from '@material-ui/core'

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
                },
            ]}
            autocomplete={{
                strategies: [
                    {
                        items: cities,
                        triggerChar: "/",
                        atomicBlockName: "my-city",
                        minSearchChars: 1,
                    }
                ]
            }}
        />
    )
}

export default AutocompleteAtomic