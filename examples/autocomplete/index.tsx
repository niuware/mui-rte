import React from 'react'
import MUIRichTextEditor from '../../'
import { TAutocompleteItem } from '../../src/components/Autocomplete'

const save = (data: string) => {
    console.log(data)
}

const emojis: TAutocompleteItem[] = [
    {
        key: "grin",
        value: "😀;",
        content: "😀",
    },
    {
        key: "beaming",
        value: "😁",
        content: "😁",
    },
    {
        key: "joy",
        value: "😂",
        content: "😂",
    },
    {
        key: "grinbig",
        value: "😃",
        content: "😃",
    },
    {
        key: "grinsmile",
        value: "😄",
        content: "😄",
    },
    {
        key: "sweat",
        value: "😅",
        content: "😅",
    }
]

const cities: TAutocompleteItem[] = [
    {
        key: "mexico",
        value: "Mexico City",
        content: "Mexico City",
    },
    {
        key: "mexico",
        value: "Cancun",
        content: "Cancun",
    },
    {
        key: "japan",
        value: "Tokyo",
        content: "Tokyo",
    },
    {
        key: "japan",
        value: "Osaka",
        content: "Osaka",
    }
]

const Autocomplete = () => {
    return (
        <MUIRichTextEditor 
            label="Try typing ':grin' or '/mexico'..."
            onSave={save}
            autocomplete={[
                {
                    items: emojis,
                    triggerChar: ":"
                },
                {
                    items: cities,
                    triggerChar: "/"
                }
            ]}
        />
    )
}

export default Autocomplete