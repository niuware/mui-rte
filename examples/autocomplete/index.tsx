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

const Autocomplete = () => {
    return (
        <MUIRichTextEditor 
            label="Try typing ':grin'..."
            onSave={save}
            autocomplete={{
                items: emojis,
                triggerChar: ":"
            }}
        />
    )
}

export default Autocomplete