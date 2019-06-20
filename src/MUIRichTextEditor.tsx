import * as React from 'react'
import Immutable from 'immutable'
import classNames from 'classnames'
import { createStyles, withStyles, WithStyles, Theme } from '@material-ui/core/styles'
import SaveIcon from '@material-ui/icons/Save'
import FormatClearIcon from '@material-ui/icons/FormatClear'
import {
    Editor, EditorState, convertFromRaw, RichUtils,
    CompositeDecorator, convertToRaw, DefaultDraftBlockRenderMap
} from 'draft-js'
import EditorControls, { TEditorControl } from './components/EditorControls'
import EditorButton from './components/EditorButton'
import Link from './components/Link'
import LinkPopover from './components/LinkPopover'
import Blockquote from './components/Blockquote'
import CodeBlock from './components/CodeBlock'
import { getSelectionInfo, getCompatibleSpacing } from './utils'

const styles = ({ spacing, typography, palette }: Theme) => createStyles({
    root: {
        margin: getCompatibleSpacing(spacing, 1, 0, 0, 0),
        fontFamily: typography.body1.fontFamily,
        fontSize: typography.body1.fontSize
    },
    inheritFontSize: {
        fontSize: "inherit"
    },
    editor: {
        margin: getCompatibleSpacing(spacing, 1, 0, 0, 0),
        cursor: "text",
        width: "100%",
        padding: getCompatibleSpacing(spacing, 0, 0, 1, 0)
    },
    editorReadOnly: {
        borderBottom: "none"
    },
    error: {
        borderBottom: "1px solid red"
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
    }
})

interface IMUIRichTextEditorProps extends WithStyles<typeof styles> {
    value?: any
    label?: string,
    readOnly?: boolean
    inheritFontSize?: boolean
    error?: boolean
    controls?: Array<TEditorControl>
    onSave?: (data: string) => void
    ref?: any
}

type IMUIRichTextEditorState = {
    editorState: EditorState
    focused: boolean
    anchorLinkPopover?: HTMLElement
    urlValue?: string
    urlKey?: string
}

class MUIRichTextEditor extends React.Component<IMUIRichTextEditorProps, IMUIRichTextEditorState> {
    private blockRenderMap = Immutable.Map({
        'blockquote': {
            element: "blockquote",
            wrapper: <Blockquote />
        },
        'code-block': {
            element: "pre",
            wrapper: <CodeBlock />
        }
    })
    private extendedBlockRenderMap: Immutable.Map<any, any>
    constructor(props: IMUIRichTextEditorProps) {
        super(props)
        const decorator = new CompositeDecorator([
            {
                strategy: this.findLinkEntities,
                component: Link,
            },
        ])
        let editorState = EditorState.createEmpty(decorator)
        if (this.props.value) {
            editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(this.props.value)), decorator)
        }
        this.state = {
            editorState: editorState,
            focused: false
        }
        this.extendedBlockRenderMap = DefaultDraftBlockRenderMap.merge(this.blockRenderMap)
    }

    handleChange = (state: EditorState) => {
        this.setState({
            editorState: state
        })
    }

    handleClearFormat = () => {
        const { editorState } = this.state
        const selectionInfo = getSelectionInfo(editorState)
        let newEditorState = editorState
        selectionInfo.inlineStyle.forEach((effect) => {
            if (effect) {
                newEditorState = RichUtils.toggleInlineStyle(newEditorState, effect)
            }
        })
        newEditorState = RichUtils.toggleBlockType(newEditorState, selectionInfo.blockType)
        this.updateAndFocus(newEditorState)
    }

    handleFocus = () => {
        (this.refs.editor as any).focus()
        this.setState({
            focused: true
        })
    }

    handleBlur = () => {
        this.setState({
            focused: false
        })
    }

    handleCloseAnchorLinkPopover = () => {
        this.setState({
            anchorLinkPopover: undefined
        })
    }

    save = () => {
        if (this.props.onSave) {
            this.props.onSave(JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent())))
        }
    }

    updateAndFocus = (state: EditorState) => {
        this.setState({
            editorState: state
        }, () => {
            setTimeout(() => this.handleFocus(), 0)
        })
    }

    toggleBlockType = (blockType: any) => {
        this.updateAndFocus(
            RichUtils.toggleBlockType(
                this.state.editorState,
                blockType
            )
        )
    }

    toggleInlineStyle = (inlineStyle: any) => {
        this.updateAndFocus(
            RichUtils.toggleInlineStyle(
                this.state.editorState,
                inlineStyle
            )
        )
    }

    promptForLink = () => {
        const { editorState } = this.state
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
            this.setState({
                urlValue: url,
                urlKey: urlKey,
                anchorLinkPopover: document.getElementById("mui-rte-link-control")!
            }, () => {
                setTimeout(() => document.getElementById("mui-rte-link-popover")!.focus(), 0)
            })
        }
    }

    removeLink = () => {
        const { editorState } = this.state
        const selection = editorState.getSelection()
        this.updateStateForLink(RichUtils.toggleLink(editorState, selection, null))
    }

    confirmLink = (url?: string) => {
        const { editorState, urlKey } = this.state
        if (!url) {
            if (urlKey) {
                this.removeLink()
                return
            }
            this.setState({
                anchorLinkPopover: undefined
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
        this.updateStateForLink(replaceEditorState)
    }

    updateStateForLink = (editorState: EditorState) => {
        this.setState({
            editorState: editorState,
            anchorLinkPopover: undefined,
            urlValue: undefined,
            urlKey: undefined
        }, () => {
            setTimeout(() => this.handleFocus(), 0)
        })
    }

    findLinkEntities(contentBlock: any, callback: any, contentState: any) {
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

    render() {
        const { classes, controls } = this.props
        const contentState = this.state.editorState.getCurrentContent()
        let className = ""
        let placeholder = null
        const editable = this.props.readOnly === undefined || !this.props.readOnly
        if (!contentState.hasText() && !this.state.focused) {
            placeholder = (
                <div
                    className={classNames(classes.editor, classes.placeHolder, {
                        [classes.error]: this.props.error
                    })}
                    onClick={this.handleFocus}
                >
                    {this.props.label || ""}
                </div>
            )
            className = classes.hidePlaceholder
        }

        return (
            <div className={classNames(this.props.classes.root, {
                [classes.inheritFontSize]: this.props.inheritFontSize
            })}>
                {editable ?
                    <EditorControls
                        editorState={this.state.editorState}
                        onToggleBlock={this.toggleBlockType}
                        onToggleInline={this.toggleInlineStyle}
                        onPromptLink={this.promptForLink}
                        controls={controls}
                    >
                        {this.props.controls === undefined || this.props.controls.includes("clear") ?
                            <EditorButton
                                key="clear"
                                label="Format Clear"
                                onClick={this.handleClearFormat}
                                icon={<FormatClearIcon />}
                            />
                        : null }
                        {this.props.controls === undefined || this.props.controls.includes("save") ?
                            <EditorButton
                                key="save"
                                label="Save"
                                onClick={this.save}
                                icon={<SaveIcon />}
                            />
                        : null }
                    </EditorControls>
                    : null}
                {placeholder}
                <div className={classNames(className, classes.editor, {
                    [classes.editorReadOnly]: !editable,
                    [classes.error]: this.props.error
                })} onClick={this.handleFocus} onBlur={this.handleBlur}>
                    <Editor
                        blockRenderMap={this.extendedBlockRenderMap}
                        editorState={this.state.editorState}
                        onChange={this.handleChange}
                        readOnly={this.props.readOnly}
                        ref="editor"
                    />
                </div>
                {this.state.anchorLinkPopover ?
                    <LinkPopover
                        url={this.state.urlValue}
                        anchor={this.state.anchorLinkPopover}
                        onConfirm={this.confirmLink}
                    />
                    : null}
            </div>
        )
    }
}

export default withStyles(styles, { withTheme: true })(MUIRichTextEditor)