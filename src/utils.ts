import { EditorState, DraftBlockType } from 'draft-js'
import Immutable from 'immutable'

const getSelectionInfo = (editorState: EditorState): {
    inlineStyle: Immutable.OrderedSet<string>,
    blockType: DraftBlockType,
    entityType: string | null,
    linkKey: string
} => {
    const selection = editorState.getSelection()
    const startOffset = editorState.getSelection().getStartOffset()
    const contentBlock = editorState.getCurrentContent().getBlockForKey(selection.getStartKey())
    const currentStyle = editorState.getCurrentInlineStyle()
    const linkKey = contentBlock.getEntityAt(startOffset)
    let entityType = null
    if (linkKey) {
        const linkInstance = editorState.getCurrentContent().getEntity(linkKey)
        entityType = linkInstance.getType()
    }
    return {
        inlineStyle: currentStyle,
        blockType: contentBlock.getType(),
        entityType: entityType,
        linkKey: linkKey
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

export { getSelectionInfo, getCompatibleSpacing }