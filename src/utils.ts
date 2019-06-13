import { EditorState, DraftBlockType } from "draft-js"

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

export { getSelectionInfo }