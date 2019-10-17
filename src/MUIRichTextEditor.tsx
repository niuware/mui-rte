import React, { FunctionComponent, useEffect, useState, useRef, 
    forwardRef, useImperativeHandle, RefForwardingComponent } from 'react'
import Immutable from 'immutable'
import classNames from 'classnames'
import { createStyles, withStyles, WithStyles, Theme } from '@material-ui/core/styles'
import { Paper } from '@material-ui/core'
import {
    Editor, EditorState, convertFromRaw, RichUtils, AtomicBlockUtils,
    CompositeDecorator, convertToRaw, DefaultDraftBlockRenderMap, DraftEditorCommand,
    DraftHandleValue, DraftStyleMap, ContentBlock, DraftDecorator, getVisibleSelectionRect, 
    SelectionState
} from 'draft-js'
import EditorControls, { TEditorControl, TCustomControl } from './components/EditorControls'
import Link from './components/Link'
import Image from './components/Image'
import Blockquote from './components/Blockquote'
import CodeBlock from './components/CodeBlock'
import UrlPopover, { TAlignment } from './components/UrlPopover'
import { getSelectionInfo, getCompatibleSpacing, removeBlockFromMap } from './utils'

const styles = ({ spacing, typography, palette }: Theme) => createStyles({
    root: {
    },
    container: {
        margin: getCompatibleSpacing(spacing, 1, 0, 0, 0),
        fontFamily: typography.body1.fontFamily,
        fontSize: typography.body1.fontSize,
        '& figure': {
            margin: 0,
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

interface IMUIRichTextEditorProps extends WithStyles<typeof styles> {
    value?: any
    label?: string,
    readOnly?: boolean
    inheritFontSize?: boolean
    error?: boolean
    controls?: Array<TEditorControl>
    onSave?: (data: string) => void
    onChange?: (state: EditorState) => void
    customControls?: TCustomControl[],
    decorators?: TDecorator[]
    toolbar?: boolean
    inlineToolbar?: boolean
    inlineToolbarControls?: Array<TEditorControl>
}

type IMUIRichTextEditorState = {
    anchorUrlPopover?: HTMLElement
    urlValue?: string
    urlKey?: string
    urlWidth?: number
    urlHeight?: number
    urlAlignment?: TAlignment
    toolbarPosition?: TToolbarPosition
    sizeProps?: boolean
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

const MUIRichTextEditor: RefForwardingComponent<any, IMUIRichTextEditorProps> = (props, ref) => {
    const { classes, controls, customControls } = props
    const [state, setState] = useState<IMUIRichTextEditorState>({})
    const [focus, setFocus] = useState(false)
    const [editorState, setEditorState] = useState(EditorState.createEmpty())
    const [customRenderers, setCustomRenderers] = useState<TCustomRenderers>({
        style: undefined,
        block: undefined
    })
    const [focusImageKey, setFocusImageKey] = useState("")

    const editorRef = useRef(null)
    const selectionRef = useRef<TStateOffset>({
        start: 0,
        end: 0
    })
    const toolbarPositionRef = useRef<TToolbarPosition | undefined>(undefined)
    const editorStateRef = useRef<EditorState | null>(editorState)

    /**
     * Expose the save method 
     */
    useImperativeHandle(ref, () => ({
        save: () => {
            handleSave()
        }
    }))

    useEffect(() => {
        const decorators: DraftDecorator[] = [
            {
                strategy: findLinkEntities,
                component: Link,
            }
        ]
        if (props.decorators) {
            props.decorators.forEach(deco => decorators.push({
                strategy: (contentBlock: any, callback: any, contentState: any) => {
                    findDecoWithRegex(deco.regex, contentBlock, callback)
                },
                component: deco.component
            }))
        }
        const decorator = new CompositeDecorator(decorators)
        const editorState = (props.value)
            ? EditorState.createWithContent(convertFromRaw(JSON.parse(props.value)), decorator)
            : EditorState.createEmpty(decorator)
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
        if (event.target.nodeName === "IMG"){
            return
        }
        setTimeout(() => {
            const selection = editorStateRef.current!.getSelection()
            if (selection.isCollapsed() || (toolbarPositionRef !== undefined && 
                selectionRef.current.start === selection.getStartOffset() &&
                selectionRef.current.end === selection.getEndOffset())) {
                    const selectionInfo = getSelectionInfo(editorStateRef.current!)
                    if (selectionInfo.entityType === "IMAGE") {
                        focusImage(selectionInfo.block)
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

    const handleFocus = () => {
        setFocus(true)
        setTimeout(() => (editorRef.current as any).focus(), 0)
    }

    const handleBlur = () => {
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

    const handleKeyCommand = (command: DraftEditorCommand, editorState: EditorState): DraftHandleValue => {
        const newState = RichUtils.handleKeyCommand(editorState, command)
        if (newState) {
            handleChange(newState)
            return "handled"
        }
        return "not-handled"
    }

    const handleCustomClick = (style: any) => {
        if (!props.customControls) {
            return
        }
        for (let control of props.customControls) {
            if (control.name.toUpperCase() === style) {
                if (control.onClick) {
                    control.onClick(editorState, control.name)
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

    const handlePromptForLink = (style: string, toolbarMode: boolean) => {
        const selection = editorState.getSelection()

        if (!selection.isCollapsed()) {
            const selectionInfo = getSelectionInfo(editorState)
            const contentState = editorState.getCurrentContent()
            const linkKey = selectionInfo.linkKey

            let url = ''
            let urlKey = undefined
            if (linkKey) {
                const linkInstance = contentState.getEntity(linkKey)
                url = linkInstance.getData().url
                urlKey = linkKey
            }
            setState({
                ...state,
                urlValue: url,
                urlKey: urlKey,
                toolbarPosition: !toolbarMode ? undefined : state.toolbarPosition,
                anchorUrlPopover: !toolbarMode ? document.getElementById("mui-rte-link-control")!
                                                : document.getElementById("mui-rte-link-control-toolbar")!,
                sizeProps: undefined
            })
        }
    }

    const handlePromptForMedia = (style: string, toolbarMode: boolean, newState?: EditorState) => {
        const lastState = newState || editorState
        let url = ''
        let width = undefined
        let height = undefined
        let urlKey = undefined
        let alignment = undefined
        const selectionInfo = getSelectionInfo(lastState)
        const contentState = lastState.getCurrentContent()
        const linkKey = selectionInfo.linkKey

        if (linkKey) {
            const linkInstance = contentState.getEntity(linkKey)
            url = linkInstance.getData().url
            width = linkInstance.getData().width
            height = linkInstance.getData().height
            alignment = linkInstance.getData().alignment
            urlKey = linkKey
        }
        setState({
            urlValue: url,
            urlKey: urlKey,
            urlWidth: width,
            urlHeight: height,
            urlAlignment: alignment,
            toolbarPosition: !toolbarMode ? undefined : state.toolbarPosition,
            anchorUrlPopover: !toolbarMode ? document.getElementById("mui-rte-image-control")!
                                            : document.getElementById("mui-rte-image-control-toolbar")!,
            sizeProps: true
        })
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

        if (urlKey) {
            contentState.replaceEntityData(urlKey, {
                url: url
            })
            replaceEditorState = EditorState.push(editorState, contentState, "apply-entity")
        }
        else {
            const contentStateWithEntity = contentState.createEntity(
                'LINK',
                'MUTABLE',
                {
                    url: url
                }
            )

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

    const confirmMedia = (url?: string, width?: number, height?: number, alignment?: TAlignment) => {
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
            alignment: alignment
        }
        let replaceEditorState = null

        if (urlKey) {
            contentState.replaceEntityData(urlKey, data)
            const newEditorState = EditorState.push(editorState, contentState, "apply-entity")
            replaceEditorState = EditorState.forceSelection(newEditorState, newEditorState.getCurrentContent().getSelectionAfter())
        }
        else {
            const contentStateWithEntity = contentState.createEntity('IMAGE', 'IMMUTABLE',data)
            const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
            const newEditorStateRaw = EditorState.set(editorState, { currentContent: contentStateWithEntity })
            const newEditorState = AtomicBlockUtils.insertAtomicBlock(
                newEditorStateRaw,
                entityKey, ' ')

            const mediaBlock = newEditorState.getCurrentContent().getBlockMap().find(block => {
                return block !== undefined && block.getEntityAt(0) === entityKey
            })
            const previousBlock = newEditorState.getCurrentContent().getBlockBefore(mediaBlock.getKey())

            if (editorState.getCurrentContent().getPlainText() !== "" && previousBlock.getText() === "") {
                const newContentState = removeBlockFromMap(newEditorState, previousBlock)
                const updatedEditorState = EditorState.push(editorState, newContentState, "remove-range")

                replaceEditorState = EditorState.forceSelection(updatedEditorState, updatedEditorState.getCurrentContent().getSelectionAfter())
            }
            else {
                replaceEditorState = EditorState.forceSelection(newEditorState, newEditorState.getCurrentContent().getSelectionAfter())
            }
        }
        setFocusImageKey("")
        updateStateForPopover(replaceEditorState)
    }

    const updateStateForPopover = (editorState: EditorState) => {
        setEditorState(editorState)
        refocus()
        setState({
            ...state,
            anchorUrlPopover: undefined,
            urlValue: undefined,
            urlKey: undefined,
            sizeProps: undefined,
            urlWidth: undefined,
            urlHeight: undefined,
        })
    }

    const refocus = () => {
        setTimeout(() => (editorRef.current as any).blur(), 0)
        setTimeout(() => (editorRef.current as any).focus(), 1)
    }

    const toggleBlockType = (blockType: any) => {
        setEditorState(
            RichUtils.toggleBlockType(
                editorState,
                blockType
            )
        )
    }

    const toggleInlineStyle = (inlineStyle: any) => {
        setEditorState(
            RichUtils.toggleInlineStyle(
                editorState,
                inlineStyle
            )
        )
    }

    const focusImage = (block: ContentBlock) => {
        const newSeletion = SelectionState.createEmpty(block.getKey())
        const newEditorState = EditorState.forceSelection(editorStateRef.current!, newSeletion)
        editorStateRef.current = newEditorState
        setFocusImageKey(block.getKey())
        setEditorState(newEditorState)
        handlePromptForMedia("", false, newEditorState)
    }

    const blockRenderer = (contentBlock: ContentBlock) => {
        const blockType = contentBlock.getType()
        if (blockType === 'atomic') {
            const contentState = editorState.getCurrentContent()
            const entity = contentBlock.getEntityAt(0)
            if (entity) {
                const type = contentState.getEntity(entity).getType()
                if (type === 'IMAGE') {
                    return {
                        component: Image,
                        editable: false,
                        props: {
                            onClick: focusImage,
                            readOnly: props.readOnly,
                            focusKey: focusImageKey
                        }
                    }
                }
            }
        }
        return null
    }

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
        <div className={classes.root}>
            <div className={classNames(classes.container, {
                [classes.inheritFontSize]: props.inheritFontSize
            })}>
                {props.inlineToolbar && editable && state.toolbarPosition ?
                    <Paper className={classes.inlineToolbar} style={{
                        top: state.toolbarPosition.top,
                        left: state.toolbarPosition.left
                    }}>
                        <EditorControls
                            editorState={editorState}
                            onToggleInline={toggleInlineStyle}
                            onPromptLink={handlePromptForLink}
                            onClear={handleClearFormat}
                            onSave={handleSave}
                            controls={inlineToolbarControls}
                            customControls={customControls}
                            toolbarMode={true}
                        />
                    </Paper>
                    : null}
                {editable && renderToolbar ?
                    <EditorControls
                        editorState={editorState}
                        onToggleBlock={toggleBlockType}
                        onToggleInline={toggleInlineStyle}
                        onPromptLink={handlePromptForLink}
                        onPromptMedia={handlePromptForMedia}
                        onClear={handleClearFormat}
                        onUndo={handleUndo}
                        onRedo={handleRedo}
                        onSave={handleSave}
                        onCustomClick={handleCustomClick}
                        controls={controls}
                        customControls={customControls}
                        className={classes.toolbar}
                    />
                    : null}
                {placeholder}
                <div className={classes.editor}>
                    <div className={classNames(className, classes.editorContainer, {
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
                            ref={editorRef}
                        />
                    </div>
                </div>
                {state.anchorUrlPopover ?
                    <UrlPopover
                        url={state.urlValue}
                        width={state.urlWidth}
                        height={state.urlHeight}
                        alignment={state.urlAlignment}
                        anchor={state.anchorUrlPopover}
                        onConfirm={state.sizeProps ? confirmMedia : confirmLink}
                        useSize={state.sizeProps}
                    />
                    : null}
            </div>
        </div>
    )
}

export default withStyles(styles, { withTheme: true, name: "MUIRichTextEditor" })(forwardRef(MUIRichTextEditor))
