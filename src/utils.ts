import { EditorState, DraftBlockType, ContentBlock, ContentState, 
    Modifier, SelectionState } from 'draft-js'
import Immutable from 'immutable'

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
 * Spacing compatible for material-ui v3.2.x ~ v.4.x.x
 */
const getCompatibleSpacing = (spacing: any, 
    top: number, 
    right: number, 
    bottom: number, 
    left: number) => {
    if (typeof spacing === "function") {
        return spacing(top, right, bottom, left)
    }
    const unit = (spacing as any).unit
    return `${top * unit}px ${right * unit}px ${bottom * unit}px ${left * unit}px`
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

export { getSelectionInfo, getCompatibleSpacing, removeBlockFromMap }
