import * as React from 'react'
import { EditorState } from 'draft-js'
import FormatBoldIcon from '@material-ui/icons/FormatBold'
import FormatItalicIcon from '@material-ui/icons/FormatItalic'
import FormatUnderlinedIcon from '@material-ui/icons/FormatUnderlined'
import StrikethroughIcon from '@material-ui/icons/StrikethroughS'
import HighlightIcon from '@material-ui/icons/Highlight'
import TitleIcon from '@material-ui/icons/Title'
import InsertLinkIcon from '@material-ui/icons/InsertLink'
import InsertPhotoIcon from '@material-ui/icons/InsertPhoto'
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered'
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted'
import FormatQuoteIcon from '@material-ui/icons/FormatQuote'
import CodeIcon from '@material-ui/icons/Code'
import FormatClearIcon from '@material-ui/icons/FormatClear'
import SaveIcon from '@material-ui/icons/Save'
import UndoIcon from '@material-ui/icons/Undo'
import RedoIcon from '@material-ui/icons/Redo'
import EditorButton from './EditorButton'
import { getSelectionInfo } from '../utils'

type KeyString = {
    [key: string]: React.ReactNode | EditorState
}

export type TEditorControl =
    "title" | "bold" | "italic" | "underline" | "link" | "numberList" |
    "bulletList" | "quote" | "code" | "clear" | "save" | "image" |
    "strikethrough" | "highlight" | string

export type TControlType = "inline" | "block" | "callback"

export type TCustomControl = {
    id?: string
    name: string
    icon: JSX.Element
    type: TControlType
    inlineStyle?: React.CSSProperties
    blockWrapper?: React.ReactElement
    onClick?: (editorState: EditorState, name: string) => void
}

type TStyleType = {
    id?: string
    name: TEditorControl | string
    label: string
    style: string
    icon: JSX.Element
    type: TControlType
    active?: boolean
    clickFnName?: string
}

const STYLE_TYPES: TStyleType[] = [
    {
        label: 'H2',
        name: "title",
        style: 'header-two',
        icon: <TitleIcon />,
        type: "block"
    },
    {
        label: 'Bold',
        name: "bold",
        style: 'BOLD',
        icon: <FormatBoldIcon />,
        type: "inline"
    },
    {
        label: 'Italic',
        name: "italic",
        style: 'ITALIC',
        icon: <FormatItalicIcon />,
        type: "inline"
    },
    {
        label: 'Underline',
        name: "underline",
        style: 'UNDERLINE',
        icon: <FormatUnderlinedIcon />,
        type: "inline"
    },
    {
        label: 'Strikethrough',
        name: "strikethrough",
        style: 'STRIKETHROUGH',
        icon: <StrikethroughIcon />,
        type: "inline"
    },
    {
        label: 'Highlight',
        name: "highlight",
        style: 'HIGHLIGHT',
        icon: <HighlightIcon />,
        type: "inline"
    },
    {
        label: 'Undo',
        name: "undo",
        style: "UNDO",
        icon: <UndoIcon />,
        type: "callback",
        clickFnName: "onUndo"
    },
    {
        label: 'Redo',
        name: "redo",
        style: "REDO",
        icon: <RedoIcon />,
        type: "callback",
        clickFnName: "onRedo"
    },
    {
        label: 'Link',
        name: "link",
        style: 'LINK',
        icon: <InsertLinkIcon />,
        type: "callback",
        clickFnName: "onPromptLink",
        id: "mui-rte-link-control"
    },
    {
        label: 'Image',
        name: "image",
        style: 'IMAGE',
        icon: <InsertPhotoIcon />,
        clickFnName: "onPromptMedia",
        type: "callback",
        id: "mui-rte-image-control"
    },
    {
        label: 'OL',
        name: "bulletList",
        style: 'ordered-list-item',
        icon: <FormatListNumberedIcon />,
        type: "block"
    },
    {
        label: 'UL',
        name: "numberList",
        style: 'unordered-list-item',
        icon: <FormatListBulletedIcon />,
        type: "block"
    },
    {
        label: 'Blockquote',
        name: "quote",
        style: 'blockquote',
        icon: <FormatQuoteIcon />,
        type: "block"
    },
    {
        label: 'Code Block',
        name: "code",
        style: 'code-block',
        icon: <CodeIcon />,
        type: "block"
    },
    {
        label: 'Clear',
        name: "clear",
        style: 'clear',
        icon: <FormatClearIcon />,
        type: "callback",
        clickFnName: "onClear"
    },
    {
        label: 'Save',
        name: "save",
        style: 'save',
        icon: <SaveIcon />,
        type: "callback",
        clickFnName: "onSave"
    }
]

interface IBlockStyleControlsProps extends KeyString {
    children?: React.ReactNode
    editorState: EditorState
    controls?: Array<TEditorControl>
    customControls?: TCustomControl[]
    onToggleInline: (inlineStyle: any) => void
    onToggleBlock: (blockType: any) => void
    onPromptLink: () => void
    onPromptMedia: () => void
    onClear: () => void
    onSave: () => void
    onUndo: () => void
    onRedo: () => void
    onCustomClick: (style: any) => void
}

const EditorControls: React.FC<IBlockStyleControlsProps> = (props: IBlockStyleControlsProps) => {
    const selectionInfo = getSelectionInfo(props.editorState)
    let filteredControls = STYLE_TYPES
    if (props.controls) {
        filteredControls = []
        const controls = props.controls.filter((control, index) => props.controls!.indexOf(control) >= index)
        controls.forEach(name => {
            let style = STYLE_TYPES.find(style => style.name === name)
            if (style) {
                filteredControls.push(style)
            }
            else if (props.customControls) {
                const customControl = props.customControls.find(style => style.name === name)
                if (customControl) {
                    filteredControls.push({
                        id: customControl.id,
                        name: customControl.name,
                        label: customControl.name,
                        style: customControl.name.toUpperCase(),
                        icon: customControl.icon,
                        type: customControl.type,
                        clickFnName: "onCustomClick"
                    })
                }
            }
        })
    }
    return (
        <div>
            {filteredControls.map(style => {
                let active = false
                let action = null
                if (style.type === "inline") {
                    active = selectionInfo.inlineStyle.has(style.style)
                    action = props.onToggleInline
                }
                else if (style.type === "block") {
                    active = style.style === selectionInfo.blockType
                    action = props.onToggleBlock
                }
                else {
                    active = style.style === selectionInfo.entityType
                    action = props[style.clickFnName!]
                }

                return (
                    <EditorButton
                        id={style.id}
                        key={`key-${style.label}`}
                        active={active}
                        label={style.label}
                        onClick={action}
                        style={style.style}
                        icon={style.icon}
                    />
                )
            })}
        </div>
    )
}
export default EditorControls