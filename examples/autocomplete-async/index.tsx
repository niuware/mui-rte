import React, { FunctionComponent } from 'react'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import MUIRichTextEditor, { TAutocompleteItem } from '../../'

const save = (data: string) => {
    console.log(data)
}

type TStaff = {
    avatar: string
    name: string
}

const Staff: FunctionComponent<TStaff> = (props) => {
    return (
        <>
            <ListItemAvatar>
                <Avatar src={props.avatar}>{props.name.substr(0, 1)}</Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={props.name}
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

const searchUsers = async (query: string): Promise<TAutocompleteItem[]> => {
    let response = await fetch(`https://reqres.in/api/users?page=${query.length - 2}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const json = await response.json();
    return json.data!.map((u:any) => {return {
        keys: [u.email, u.first_name, u.last_name],
        value: `${u.first_name}`,
        content: <Staff name={`${u.first_name} ${u.last_name}`} avatar={u.avatar} />,
    }});
};

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
                        asyncItems: searchUsers,
                        triggerChar: "@",
                        insertSpaceAfter: false
                    }
                ]
            }}
        />
    )
}

export default Autocomplete
