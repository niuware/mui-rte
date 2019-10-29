import React, { FunctionComponent } from 'react'
import { IconButton } from '@material-ui/core'
import { TToolbarComponentProps } from './EditorControls'

interface IEditorButtonProps {
    id?: string
    label: string
    style: string
    type: string
    active?: boolean
    icon?: JSX.Element
    onClick?: any
    toolbarMode?: boolean
    disabled?: boolean
    component?: FunctionComponent<TToolbarComponentProps>
}

const EditorButton: FunctionComponent<IEditorButtonProps> = (props: IEditorButtonProps) => {
    const size = !props.toolbarMode ? "medium" : "small"
    const toolbarId = props.toolbarMode ? "-toolbar" : ""
    const elemId = props.id + toolbarId
    const sharedProps = {
        id: elemId,
        onMouseDown: (e: React.MouseEvent) => {
            e.preventDefault()
            if (props.onClick) {
                props.onClick(props.style, props.type, elemId, props.toolbarMode)
            }
        },
        disabled: props.disabled || false
    }
    if (props.icon) {
        return (
            <IconButton
                {...sharedProps}
                aria-label={props.label}
                color={props.active ? "primary" : "default"}
                size={size}
            >
                {props.icon}
            </IconButton>
        )
    }
    if (props.component) {
        return (
            <props.component 
                {...sharedProps}
                active={props.active || false}
            />
        )
    }
    return null
}

export default EditorButton