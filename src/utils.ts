import { EditorState, DraftBlockType, ContentBlock, ContentState, 
    Modifier, SelectionState, getVisibleSelectionRect } from 'draft-js'
import Immutable from 'immutable'
import { TCustomControl } from './components/Toolbar'

export type TSelectionInfo = {
    inlineStyle: Immutable.OrderedSet<string>,
    blockType: DraftBlockType,
    entityType: string | null,
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
    let entityType = null
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

const isGt = (value: number, maxValue?: number): boolean => {
    if (!maxValue) {
        return false
    }
    return value > maxValue
}

const clearInlineStyles = (editorState: EditorState): ContentState => {
    const styles = ['BOLD', 'ITALIC', 'UNDERLINE', 'STRIKETHROUGH']
    return styles.reduce((newContentState: ContentState, style: string) => (
        Modifier.removeInlineStyle(newContentState, editorState.getSelection(), style)
    ), editorState.getCurrentContent())
}

export { getSelectionInfo, removeBlockFromMap, atomicBlockExists, isGt, clearInlineStyles }
const getRects = (editor: HTMLElement) => {
    return {
        selectionRect: getVisibleSelectionRect(window),
        editorRect: editor.getBoundingClientRect()
    }
}

