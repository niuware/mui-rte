import React, { FunctionComponent, useEffect, useState, useRef, 
    forwardRef, useImperativeHandle, RefForwardingComponent } from 'react'
import Immutable from 'immutable'
import classNames from 'classnames'
import { createStyles, withStyles, WithStyles, Theme } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import {
    Editor, EditorState, convertFromRaw, RichUtils, AtomicBlockUtils,
    CompositeDecorator, convertToRaw, DefaultDraftBlockRenderMap, DraftEditorCommand,
    DraftHandleValue, DraftStyleMap, ContentBlock, DraftDecorator, getVisibleSelectionRect, 
    SelectionState, KeyBindingUtil, getDefaultKeyBinding
} from 'draft-js'
import Toolbar, { TToolbarControl, TCustomControl, TToolbarButtonSize } from './components/Toolbar'
import Link from './components/Link'
import Media from './components/Media'
import Blockquote from './components/Blockquote'
import CodeBlock from './components/CodeBlock'
import UrlPopover, { TAlignment, TUrlData, TMediaType } from './components/UrlPopover'
import { getSelectionInfo, getCompatibleSpacing, removeBlockFromMap, atomicBlockExists, isGte } from './utils'

const styles = ({ spacing, typography, palette }: Theme) => createStyles({
    root: {
    },
    container: {
        margin: getCompatibleSpacing(spacing, 1, 0, 0, 0),
        fontFamily: typography.body1.fontFamily,
        fontSize: typography.body1.fontSize,
        '& figure': {
            margin: 0
        }
    },
    inheritFontSize: {
        fontSize: "inherit"
    },
    editor: {
    },
    editorContainer: {
        margin: getCompatibleSpacing(spacing, 1, 0, 0, 0),
        cursor: "text",
        width: "100%",
        padding: getCompatibleSpacing(spacing, 0, 0, 1, 0)
    },
    editorReadOnly: {
        borderBottom: "none"
    },
    error: {
        borderBottom: "2px solid red"
    },
    hidePlaceholder: {
        display: "none"
    },
    placeHolder: {
        color: palette.grey[600]
    },
    linkPopover: {
        padding: getCompatibleSpacing(spacing, 2, 2, 2, 2)
    },
    linkTextField: {
        width: "100%"
    },
    anchorLink: {
        textDecoration: "underline",
        color: palette.secondary.main
    },
    toolbar: {
    },
    inlineToolbar: {
        maxWidth: "180px",
        position: "absolute",
        padding: "5px",
        zIndex: 10
    }
})

export type TDecorator = {
    component: FunctionComponent
    regex: RegExp
}

type TDraftEditorProps = {
    spellCheck?: boolean
    stripPastedStyles?: boolean
}

type TKeyCommand = {
    key: number
    name: string
    callback: (state: EditorState) => EditorState
}

interface IMUIRichTextEditorProps extends WithStyles<typeof styles> {
    id?: string
    value?: any
    label?: string,
    readOnly?: boolean
    inheritFontSize?: boolean
    error?: boolean
    controls?: Array<TToolbarControl>
    customControls?: TCustomControl[]
    decorators?: TDecorator[]
    toolbar?: boolean
    toolbarButtonSize?: TToolbarButtonSize
    inlineToolbar?: boolean
    inlineToolbarControls?: Array<TToolbarControl>
    draftEditorProps?: TDraftEditorProps
    keyCommands?: TKeyCommand[]
    maxLength?: number
    onSave?: (data: string) => void
    onChange?: (state: EditorState) => void
    onFocus?: () => void
    onBlur?: () => void
}

type IMUIRichTextEditorState = {
    anchorUrlPopover?: HTMLElement
    urlKey?: string
    urlData?: TUrlData
    urlIsMedia?: boolean
    toolbarPosition?: TToolbarPosition
}

type TStateOffset = {
    start: number,
    end: number
}

type TToolbarPosition = {
    top: number
    left: number
}

type TCustomRenderers = {
    style?: DraftStyleMap
    block?: Immutable.Map<any, any>
}

const blockRenderMap = Immutable.Map({
    'blockquote': {
        element: "blockquote",
        wrapper: <Blockquote />
    },
    'code-block': {
        element: "pre",
        wrapper: <CodeBlock />
    }
})
const styleRenderMap: DraftStyleMap = {
    'STRIKETROUGH': {
        textDecoration: "line-through"
    },
    'HIGHLIGHT': {
        backgroundColor: "yellow"
    }
}

const { hasCommandModifier } = KeyBindingUtil

const findLinkEntities = (contentBlock: any, callback: any, contentState: any) => {
    contentBlock.findEntityRanges(
        (character: any) => {
            const entityKey = character.getEntity()
            return (
                entityKey !== null &&
                contentState.getEntity(entityKey).getType() === 'LINK'
            )
        },
        callback
    )
}

const findDecoWithRegex = (regex: RegExp, contentBlock: any, callback: any) => {
    const text = contentBlock.getText()
    let matchArr, start
    while ((matchArr = regex.exec(text)) !== null) {
        start = matchArr.index
        callback(start, start + matchArr[0].length)
    }
}

const useEditorState = (props: IMUIRichTextEditorProps) => {
    const decorators: DraftDecorator[] = [
        {
            strategy: findLinkEntities,
            component: Link,
        }
    ]
    if (props.decorators) {
        props.decorators.forEach(deco => decorators.push({
            strategy: (contentBlock: any, callback: any) => {
                findDecoWithRegex(deco.regex, contentBlock, callback)
            },
            component: deco.component
        }))
    }
    const decorator = new CompositeDecorator(decorators)
    return (props.value)
        ? EditorState.createWithContent(convertFromRaw(JSON.parse(props.value)), decorator)
        : EditorState.createEmpty(decorator)
}

const MUIRichTextEditor: RefForwardingComponent<any, IMUIRichTextEditorProps> = (props, ref) => {
    const { classes, controls, customControls } = props
    const [state, setState] = useState<IMUIRichTextEditorState>({})
    const [focus, setFocus] = useState(false)

    const [editorState, setEditorState] = useState(() => useEditorState(props))
    const [customRenderers, setCustomRenderers] = useState<TCustomRenderers>({
        style: undefined,
        block: undefined
    })
    const [focusMediaKey, setFocusMediaKey] = useState("")

    const editorRef = useRef(null)
    const selectionRef = useRef<TStateOffset>({
        start: 0,
        end: 0
    })
    const toolbarPositionRef = useRef<TToolbarPosition | undefined>(undefined)
    const editorStateRef = useRef<EditorState | null>(editorState)

    const editorId = props.id || "mui-rte"

    /**
     * Expose methods
     */
    useImperativeHandle(ref, () => ({
        focus: () => {
            handleFocus()
        },
        save: () => {
            handleSave()
        },
        insertAtomicBlock: (name: string, data: any) => {
            handleInsertAtomicBlock(name, data)
        }
    }))

    useEffect(() => {
        const editorState = useEditorState(props)
        const customBlockMap: any = {}
        const customStyleMap = JSON.parse(JSON.stringify(styleRenderMap))
        if (props.customControls) {
            props.customControls.forEach(control => {
                if (control.type === "inline" && control.inlineStyle) {
                    customStyleMap[control.name.toUpperCase()] = control.inlineStyle
                }
                else if (control.type === "block" && control.blockWrapper) {
                    customBlockMap[control.name.toUpperCase()] = {
                        element: "div",
                        wrapper: control.blockWrapper
                    }
                }
            })
        }
        setCustomRenderers({
            style: customStyleMap,
            block: DefaultDraftBlockRenderMap.merge(blockRenderMap, Immutable.Map(customBlockMap))
        })
        setEditorState(editorState)
        toggleMouseUpListener(true)
        return () => {
            toggleMouseUpListener()
        }
    }, [props.value])

    useEffect(() => {
        editorStateRef.current = editorState
    }, [editorState])

    useEffect(() => {
        toolbarPositionRef.current = state.toolbarPosition
    }, [state.toolbarPosition])

    const handleMouseUp = (event: any) => {
        const nodeName = event.target.nodeName
        if (nodeName === "IMG" || nodeName === "VIDEO"){
            return
        }
        setTimeout(() => {
            const selection = editorStateRef.current!.getSelection()
            if (selection.isCollapsed() || (toolbarPositionRef !== undefined && 
                selectionRef.current.start === selection.getStartOffset() &&
                selectionRef.current.end === selection.getEndOffset())) {
                    const selectionInfo = getSelectionInfo(editorStateRef.current!)
                    if (selectionInfo.entityType === "IMAGE") {
                        focusMedia(selectionInfo.block)
                        return
                    }
                    setState({
                        ...state,
                        toolbarPosition: undefined
                    })
                return
            }

            selectionRef.current = {
                start: selection.getStartOffset(),
                end: selection.getEndOffset()
            }

            const editor: HTMLElement = (editorRef.current as any).editor
            const selectionRect = getVisibleSelectionRect(window)
            const editorRect = editor.getBoundingClientRect()
            if (!selectionRect) {
                return
            }
            const position = {
                top: editor.offsetTop - 48 + (selectionRect.top - editorRect.top),
                left: editor.offsetLeft + (selectionRect.left - editorRect.left)
            }
            setState({
                ...state,
                toolbarPosition: position
            })
        }, 1)
    }

    const handleChange = (state: EditorState) => {
        setEditorState(state)
        if (props.onChange) {
            props.onChange(state)
        }
    }

    const handleBeforeInput = (): DraftHandleValue => {
        const currentLength = editorState.getCurrentContent().getPlainText('').length
        return isGte(currentLength, props.maxLength) ? "handled" : "not-handled"
    }

    const handleFocus = () => {
        if (props.onFocus) {
            props.onFocus()
        }
        setFocus(true)
        setTimeout(() => (editorRef.current as any).focus(), 0)
    }

    const handleBlur = () => {
        if (props.onBlur) {
            props.onBlur()
        }
        setFocus(false)
        if (!state.anchorUrlPopover) {
            setState({
                ...state,
                toolbarPosition: undefined
            })
        }
    }

    const handleClearFormat = () => {
        const selectionInfo = getSelectionInfo(editorState)
        let newEditorState = editorState
        selectionInfo.inlineStyle.forEach((effect) => {
            if (effect) {
                newEditorState = RichUtils.toggleInlineStyle(newEditorState, effect)
            }
        })
        newEditorState = RichUtils.toggleBlockType(newEditorState, selectionInfo.blockType)
        setEditorState(newEditorState)
    }

    const handleSave = () => {
        if (props.onSave) {
            props.onSave(JSON.stringify(convertToRaw(editorState.getCurrentContent())))
        }
    }

    const handleInsertAtomicBlock = (name: string, data: any) => {
        const block = atomicBlockExists(name, props.customControls)
        if (!block) {
            return
        }
        const newEditorState = insertAtomicBlock(block.name.toUpperCase(), data, { 
            selection: editorState.getCurrentContent().getSelectionAfter()
        })
        updateStateForPopover(newEditorState)
    }

    const handleKeyCommand = (command: DraftEditorCommand, editorState: EditorState): DraftHandleValue => {
        const newState = RichUtils.handleKeyCommand(editorState, command)
        if (newState) {
            handleChange(newState)
            return "handled"
        }
        else {
            if (props.keyCommands) {
                const keyCommand = props.keyCommands.find(comm => comm.name === command)
                if (keyCommand) {
                    const newState = keyCommand.callback(editorState)
                    handleChange(newState)
                    return "handled"
                }
            }
        }
        return "not-handled"
    }

    const handleCustomClick = (style: any, id: string) => {
        if (!props.customControls) {
            return
        }
        for (let control of props.customControls) {
            if (control.name.toUpperCase() === style) {
                if (control.onClick) {
                    setTimeout(() => (editorRef.current as any).blur(), 0)
                    const newState = control.onClick(editorState, control.name, document.getElementById(id))
                    if (newState) {
                        if (newState.getSelection().isCollapsed()) {
                            setEditorState(newState)
                        }
                        else {
                            updateStateForPopover(newState)
                        }
                    }
                    else {
                        if (!editorState.getSelection().isCollapsed()) {
                            refocus()
                        }
                    }
                }
                break
            }
        }
    }

    const handleUndo = () => {
        setEditorState(EditorState.undo(editorState))
    }

    const handleRedo = () => {
        setEditorState(EditorState.redo(editorState))
    }

    const handlePrompt = (lastState: EditorState, type: "link" | "media", inlineMode?: boolean) => {
        const selectionInfo = getSelectionInfo(lastState)
        const contentState = lastState.getCurrentContent()
        const linkKey = selectionInfo.linkKey
        let data = undefined
        if (linkKey) {
            const linkInstance = contentState.getEntity(linkKey)
            data = linkInstance.getData()
        }
        setState({
            urlData: data,
            urlKey: linkKey,
            toolbarPosition: !inlineMode ? undefined : state.toolbarPosition,
            anchorUrlPopover: !inlineMode ? document.getElementById(`${editorId}-${type}-control-button`)!
                                            : document.getElementById(`${editorId}-${type}-control-button-toolbar`)!,
            urlIsMedia: type === "media" ? true : undefined
        })
    }

    const handlePromptForLink = (inlineMode?: boolean) => {
        const selection = editorState.getSelection()

        if (!selection.isCollapsed()) {
            handlePrompt(editorState, "link", inlineMode)
        }
    }

    const handlePromptForMedia = (inlineMode?: boolean, newState?: EditorState) => {
        const lastState = newState || editorState
        handlePrompt(lastState, "media", inlineMode)
    }

    const handleConfirmPrompt = (isMedia?: boolean, ...args: any) => {
        if (isMedia) {
            confirmMedia(...args)
            return
        }
        confirmLink(...args)
    }

    const handleToolbarClick = (style: string, type: string, id: string, inlineMode?: boolean) => {
        if (type === "inline") {
            return toggleInlineStyle(style)
        }
        if (type === "block") {
            return toggleBlockType(style)
        }
        switch (style) {
            case "UNDO":
                handleUndo()
                break
            case "REDO":
                handleRedo()
                break
            case "LINK":
                handlePromptForLink(inlineMode)
                break
            case "IMAGE":
                handlePromptForMedia(inlineMode)
                break
            case "clear":
                handleClearFormat()
                break
            case "save":
                handleSave()
                break
            default:
                handleCustomClick(style, id)
        }
    }

    const handlePastedText = (text: string, _html: string|undefined, editorState: EditorState): DraftHandleValue => {
        const currentLength = editorState.getCurrentContent().getPlainText('').length
        return isGte(currentLength + text.length, props.maxLength) ? "handled" : "not-handled"
    }

    const toggleMouseUpListener = (addAfter = false) => {
        const editor: HTMLElement = (editorRef.current as any).editor
        if (!editor) {
            return
        }
        editor.removeEventListener("mouseup", handleMouseUp)
        if (addAfter) {
            editor.addEventListener("mouseup", handleMouseUp)
        }
    }

    const removeLink = () => {
        const selection = editorState.getSelection()
        updateStateForPopover(RichUtils.toggleLink(editorState, selection, null))
    }

    const confirmLink = (url?: string) => {
        const { urlKey } = state
        if (!url) {
            if (urlKey) {
                removeLink()
                return
            }
            setState({
                ...state,
                anchorUrlPopover: undefined
            })
            return
        }

        const contentState = editorState.getCurrentContent()
        let replaceEditorState = null
        const data = {
            url: url
        }

        if (urlKey) {
            contentState.replaceEntityData(urlKey, data)
            replaceEditorState = EditorState.push(editorState, contentState, "apply-entity")
        }
        else {
            const contentStateWithEntity = contentState.createEntity('LINK', 'MUTABLE', data)
            const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
            const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity })
            replaceEditorState = RichUtils.toggleLink(
                newEditorState,
                newEditorState.getSelection(),
                entityKey)
        }
        updateStateForPopover(replaceEditorState)
    }

    const removeMedia = () => {
        const blockKey = editorState.getSelection().getStartKey()
        const contentState = editorState.getCurrentContent()
        const mediaBlock = contentState.getBlockForKey(blockKey)
        const newContentState = removeBlockFromMap(editorState, mediaBlock)
        const newEditorState = EditorState.push(editorState, newContentState, "remove-range")
        setEditorState(newEditorState)
    }

    const confirmMedia = (url?: string, width?: number, height?: number, alignment?: TAlignment, type?: TMediaType) => {
        const { urlKey } = state
        if (!url) {
            if (urlKey) {
                removeMedia()
            }
            setState({
                ...state,
                anchorUrlPopover: undefined
            })
            return
        }

        const contentState = editorState.getCurrentContent()
        const data = {
            url: url,
            width: width,
            height: height,
            alignment: alignment,
            type: type
        }

        if (urlKey) {
            contentState.replaceEntityData(urlKey, data)
            const newEditorState = EditorState.push(editorState, contentState, "apply-entity")
            updateStateForPopover(EditorState.forceSelection(newEditorState, newEditorState.getCurrentContent().getSelectionAfter()))
        }
        else {
            const newEditorState = insertAtomicBlock("IMAGE", data)
            updateStateForPopover(EditorState.forceSelection(newEditorState, newEditorState.getCurrentContent().getSelectionAfter()))
        }
        setFocusMediaKey("")
    }

    const updateStateForPopover = (editorState: EditorState) => {
        setEditorState(editorState)
        refocus()
        setState({
            ...state,
            anchorUrlPopover: undefined,
            urlKey: undefined,
            urlIsMedia: undefined,
            urlData: undefined
        })
    }

    const refocus = () => {
        setTimeout(() => (editorRef.current as any).blur(), 0)
        setTimeout(() => (editorRef.current as any).focus(), 1)
    }

    const toggleBlockType = (blockType: string) => {
        setEditorState(
            RichUtils.toggleBlockType(
                editorState,
                blockType
            )
        )
    }

    const toggleInlineStyle = (inlineStyle: string) => {
        setEditorState(
            RichUtils.toggleInlineStyle(
                editorState,
                inlineStyle
            )
        )
    }

    const focusMedia = (block: ContentBlock) => {
        const newSeletion = SelectionState.createEmpty(block.getKey())
        const newEditorState = EditorState.forceSelection(editorStateRef.current!, newSeletion)
        editorStateRef.current = newEditorState
        setFocusMediaKey(block.getKey())
        setEditorState(newEditorState)
        handlePromptForMedia(false, newEditorState)
    }

    const blockRenderer = (contentBlock: ContentBlock) => {
        const blockType = contentBlock.getType()
        if (blockType === 'atomic') {
            const contentState = editorState.getCurrentContent()
            const entity = contentBlock.getEntityAt(0)
            if (entity) {
                const type = contentState.getEntity(entity).getType()
                if (type === "IMAGE") {
                    return {
                        component: Media,
                        editable: false,
                        props: {
                            onClick: focusMedia,
                            readOnly: props.readOnly,
                            focusKey: focusMediaKey
                        }
                    }
                }
                else {
                    const block = atomicBlockExists(type.toLowerCase(), props.customControls)
                    if (!block) {
                        return null
                    }
                    return {
                        component: block.atomicComponent,
                        editable: false,
                        props: contentState.getEntity(contentBlock.getEntityAt(0)).getData()
                    }
                }
            }
        }
        return null
    }

    const insertAtomicBlock = (type: string, data: any, options?: any) => {
        const contentState = editorState.getCurrentContent()
        const contentStateWithEntity = contentState.createEntity(type, 'IMMUTABLE', data)
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
        const newEditorStateRaw = EditorState.set(editorState, { 
            currentContent: contentStateWithEntity, 
            ...options
        })
        return AtomicBlockUtils.insertAtomicBlock(newEditorStateRaw, entityKey, ' ')
    }

    const keyBindingFn = (e: React.KeyboardEvent<{}>): string | null => {
        if (hasCommandModifier(e) && props.keyCommands) {
            const comm = props.keyCommands.find(comm => comm.key === e.keyCode)
            if (comm) {
                return comm.name
            }
        }
        return getDefaultKeyBinding(e)
    }

    const renderToolbar = props.toolbar === undefined || props.toolbar
    const inlineToolbarControls = props.inlineToolbarControls || ["bold", "italic", "underline", "clear"]
    const editable = props.readOnly === undefined || !props.readOnly
    let className = ""
    let placeholder: React.ReactElement | null = null
    if (!focus) {
        const contentState = editorState.getCurrentContent()
        if (!contentState.hasText()) {
            placeholder = (
                <div
                    className={classNames(classes.editorContainer, classes.placeHolder, {
                        [classes.error]: props.error
                    })}
                    onClick={handleFocus}
                >
                    {props.label || ""}
                </div>
            )
            className = classes.hidePlaceholder
        }
    }

    return (
        <div id={`${editorId}-root`} className={classes.root}>
            <div id={`${editorId}-container`} className={classNames(classes.container, {
                [classes.inheritFontSize]: props.inheritFontSize
            })}>
                {props.inlineToolbar && editable && state.toolbarPosition ?
                    <Paper className={classes.inlineToolbar} style={{
                        top: state.toolbarPosition.top,
                        left: state.toolbarPosition.left
                    }}>
                        <Toolbar
                            id={editorId}
                            editorState={editorState}
                            onClick={handleToolbarClick}
                            controls={inlineToolbarControls}
                            customControls={customControls}
                            inlineMode={true}
                        />
                    </Paper>
                    : null}
                {renderToolbar ?
                    <Toolbar
                        id={editorId}
                        editorState={editorState}
                        onClick={handleToolbarClick}
                        controls={controls}
                        customControls={customControls}
                        className={classes.toolbar}
                        disabled={!editable}
                        size={props.toolbarButtonSize}
                    />
                    : null}
                {placeholder}
                <div id={`${editorId}-editor`} className={classes.editor}>
                    <div id={`${editorId}-editor-container`} className={classNames(className, classes.editorContainer, {
                        [classes.editorReadOnly]: !editable,
                        [classes.error]: props.error
                    })} onClick={handleFocus} onBlur={handleBlur}>
                        <Editor
                            customStyleMap={customRenderers.style}
                            blockRenderMap={customRenderers.block}
                            blockRendererFn={blockRenderer}
                            editorState={editorState}
                            onChange={handleChange}
                            readOnly={props.readOnly}
                            handleKeyCommand={handleKeyCommand}
                            handleBeforeInput={handleBeforeInput}
                            handlePastedText={handlePastedText}
                            keyBindingFn={keyBindingFn}
                            ref={editorRef}
                            {...props.draftEditorProps}
                        />
                    </div>
                </div>
                {state.anchorUrlPopover ?
                    <UrlPopover
                        data={state.urlData}
                        anchor={state.anchorUrlPopover}
                        onConfirm={handleConfirmPrompt}
                        isMedia={state.urlIsMedia}
                    />
                    : null}
            </div>
        </div>
    )
}

export default withStyles(styles, { withTheme: true, name: "MUIRichTextEditor" })(forwardRef(MUIRichTextEditor))
