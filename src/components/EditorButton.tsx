import * as React from 'react'
import { IconButton } from '@material-ui/core'

interface IEditorButtonProps {
    id?: string
    label: string
    style?: string
    active?: boolean
    icon: JSX.Element
    onClick: any
}

const EditorButton: React.FC<IEditorButtonProps> = (props: IEditorButtonProps) => {
    return (
        <IconButton
            id={props.id}
            onClick={() => props.onClick(props.style)}
            aria-label={props.label}
            color={props.active ? "primary" : "default"}
        >
            {props.icon}
        </IconButton>
    )
}

export default EditorButton