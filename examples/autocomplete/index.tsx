import React, { FunctionComponent } from 'react'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import MUIRichTextEditor from '../../'
import { TAutocompleteItem } from '../../src/components/Autocomplete'

const save = (data: string) => {
    console.log(data)
}

type TStaff = {
    job: string
    name: string
    color: string
}

const Staff: FunctionComponent<TStaff> = (props) => {
    return (
        <>
            <ListItemAvatar>
                <Avatar style={{
                    backgroundColor: props.color
                }}>{props.name.substr(0, 1)}</Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={props.name}
                secondary={props.job}
            />
        </>
    )
}

const emojis: TAutocompleteItem[] = [
    {
        keys: ["face", "grin"],
        value: "😀",
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
        keys: ["face", "grin", "big"],
        value: "😃",
        content: "😃",
    },
    {
        keys: ["face", "grin", "smile"],
        value: "😄",
        content: "😄",
    },
    {
        keys: ["face", "sweat"],
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

const staff = [
    {
        keys: ["all", "foo", "manager"],
        value: "Foo Bar",
        content: <Staff name="Foo Bar" job="Manager" color="tomato" />,
    },
    {
        keys: ["all", "bar", "support"],
        value: "Bar Foo",
        content: <Staff name="Bar Foo" job="Technical Support" color="orange" />,
    },
    {
        keys: ["all", "mui", "manager"],
        value: "Mui Rte",
        content: <Staff name="Mui Rte" job="Manager" color="dodgerblue" />,
    }
]

const Autocomplete = () => {
    return (
        <MUIRichTextEditor 
            label="Try typing ':grin' or '/mexico'..."
            onSave={save}
            autocomplete={{
                strategies: [
                    {
                        items: emojis,
                        triggerChar: ":"
                    },
                    {
                        items: cities,
                        triggerChar: "/"
                    },
                    {
                        items: staff,
                        triggerChar: "@",
                        insertSpaceAfter: false
                    }
                ]
            }}
        />
    )
}

export default Autocomplete