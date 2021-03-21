import {
    EditorState, DraftBlockType, ContentBlock, ContentState,
    Modifier, SelectionState, getVisibleSelectionRect, DraftStyleMap
} from 'draft-js'
import Immutable from 'immutable'
import { TCustomControl } from './components/Toolbar'

export type TPosition = {
    top: number
    left: number
}

export type TSelectionInfo = {
    inlineStyle: Immutable.OrderedSet<string>,
    blockType: DraftBlockType,
    entityType: string,
    linkKey: string
    block: ContentBlock
}

/**
 * Get the current selection details
 */
const getSelectionInfo = (editorState: EditorState): TSelectionInfo => {
    const selection = editorState.getSelection()
    const startOffset = selection.getStartOffset()
    const currentContent = editorState.getCurrentContent()
    const contentBlock = currentContent.getBlockForKey(selection.getStartKey())
    const currentStyle = editorState.getCurrentInlineStyle()
    const linkKey = contentBlock.getEntityAt(startOffset)
    let entityType = ""
    if (linkKey) {
        const linkInstance = currentContent.getEntity(linkKey)
        entityType = linkInstance.getType()
    }
    return {
        inlineStyle: currentStyle,
        blockType: contentBlock.getType(),
        entityType: entityType,
        linkKey: linkKey,
        block: contentBlock
    }
}

/**
 * Remove a block from the ContentState
 */
const removeBlockFromMap = (editorState: EditorState, block: ContentBlock): ContentState => {
    const contentState = editorState.getCurrentContent()
    const removeBlockContentState = Modifier.removeRange(
        contentState,
        new SelectionState({
            anchorKey: block.getKey(),
            anchorOffset: 0,
            focusKey: block.getKey(),
            focusOffset: block.getLength(),
        }),
        'backward'
    )
    const blockMap = removeBlockContentState.getBlockMap().delete(block.getKey())
    return removeBlockContentState.merge({
        blockMap,
        selectionAfter: contentState.getSelectionAfter()
    }) as ContentState
}

const atomicBlockExists = (name: string, controls?: TCustomControl[]) => {
    if (!controls) {
        return undefined
    }
    return controls.find(control =>
        control.type === "atomic" &&
        control.name === name &&
        control.atomicComponent !== undefined)
}

const isGreaterThan = (value: number, maxValue?: number): boolean => {
    if (!maxValue) {
        return false
    }
    return value > maxValue
}

const clearInlineStyles = (editorState: EditorState, customStyles?: DraftStyleMap): ContentState => {
    let styles = ['BOLD', 'ITALIC', 'UNDERLINE']
    if (customStyles) {
        styles = styles.concat(Object.getOwnPropertyNames(customStyles))
    }
    return styles.reduce((newContentState: ContentState, style: string) => (
        Modifier.removeInlineStyle(newContentState, editorState.getSelection(), style)
    ), editorState.getCurrentContent())
}

const getEditorBounds = (editor: HTMLElement) => {
    let fakeClientRect = getVisibleSelectionRect(window)
    return {
        selectionRect: fakeClientRect ? {
            top: fakeClientRect?.top,
            left: fakeClientRect?.left
        } as TPosition : null,
        editorRect: editor.getBoundingClientRect()
    }
}

const getLineNumber = (editorState: EditorState) => {
    const currentBlockKey = editorState.getSelection().getStartKey()
    return editorState.getCurrentContent().getBlockMap()
        .keySeq().findIndex(k => k === currentBlockKey)
}

export { getSelectionInfo, removeBlockFromMap, atomicBlockExists, isGreaterThan, clearInlineStyles, getEditorBounds, getLineNumber }
