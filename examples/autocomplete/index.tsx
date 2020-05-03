import React from 'react'
import MUIRichTextEditor from '../../'
import { TAutocompleteItem } from '../../src/components/Autocomplete'

const save = (data: string) => {
    console.log(data)
}

const emojis: TAutocompleteItem[] = [
    {
        keys: ["face", "grin"],
        value: "😀;",
        content: "😀",
    },
    {
        keys: ["face", "beaming"],
        value: "😁",
        content: "😁",
    },
    {
        keys: ["face", "joy"],
        value: "😂",
        content: "😂",
    },
    {
        keys: ["grin", "big"],
        value: "😃",
        content: "😃",
    },
    {
        keys: ["grin", "smile"],
        value: "😄",
        content: "😄",
    },
    {
        keys: ["sweat"],
        value: "😅",
        content: "😅",
    }
]

const cities: TAutocompleteItem[] = [
    {
        keys: ["mexico"],
        value: "Mexico City",
        content: "Mexico City",
    },
    {
        keys: ["mexico", "beach"],
        value: "Cancun",
        content: "Cancun",
    },
    {
        keys: ["japan", "olympics"],
        value: "Tokyo",
        content: "Tokyo",
    },
    {
        keys: ["japan"],
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