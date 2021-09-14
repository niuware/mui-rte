'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var Immutable = _interopDefault(require('immutable'));
var classNames = _interopDefault(require('classnames'));
var styles$5 = require('@material-ui/core/styles');
var core = require('@material-ui/core');
var draftJs = require('draft-js');
var FormatBoldIcon = _interopDefault(require('@material-ui/icons/FormatBold'));
var FormatItalicIcon = _interopDefault(require('@material-ui/icons/FormatItalic'));
var FormatUnderlinedIcon = _interopDefault(require('@material-ui/icons/FormatUnderlined'));
var StrikethroughIcon = _interopDefault(require('@material-ui/icons/StrikethroughS'));
var HighlightIcon = _interopDefault(require('@material-ui/icons/Highlight'));
var InsertLinkIcon = _interopDefault(require('@material-ui/icons/InsertLink'));
var PhotoLibraryIcon = _interopDefault(require('@material-ui/icons/PhotoLibrary'));
var FormatListNumberedIcon = _interopDefault(require('@material-ui/icons/FormatListNumbered'));
var FormatListBulletedIcon = _interopDefault(require('@material-ui/icons/FormatListBulleted'));
var FormatQuoteIcon = _interopDefault(require('@material-ui/icons/FormatQuote'));
var CodeIcon = _interopDefault(require('@material-ui/icons/Code'));
var FormatClearIcon = _interopDefault(require('@material-ui/icons/FormatClear'));
var SaveIcon = _interopDefault(require('@material-ui/icons/Save'));
var UndoIcon = _interopDefault(require('@material-ui/icons/Undo'));
var RedoIcon = _interopDefault(require('@material-ui/icons/Redo'));
var ButtonGroup = _interopDefault(require('@material-ui/core/ButtonGroup'));
var InsertPhotoIcon = _interopDefault(require('@material-ui/icons/InsertPhoto'));
var MovieIcon = _interopDefault(require('@material-ui/icons/Movie'));
var CheckIcon = _interopDefault(require('@material-ui/icons/Check'));
var DeleteIcon = _interopDefault(require('@material-ui/icons/DeleteOutline'));
var FormatAlignCenter = _interopDefault(require('@material-ui/icons/FormatAlignCenter'));
var FormatAlignLeft = _interopDefault(require('@material-ui/icons/FormatAlignLeft'));
var FormatAlignRight = _interopDefault(require('@material-ui/icons/FormatAlignRight'));

var Link = function (props) {
    var url = props.contentState.getEntity(props.entityKey).getData().url;
    return (React.createElement("a", { href: url, style: {
            textDecoration: "underline",
            color: "inherit"
        }, className: "editor-anchor", target: "_blank" }, props.children));
};

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

var ToolbarButton = function (props) {
    var size = !props.inlineMode ? (props.size || "medium") : "small";
    var toolbarId = props.inlineMode ? "-toolbar" : "";
    var elemId = (props.id || props.label) + "-button" + toolbarId;
    var sharedProps = {
        id: elemId,
        onMouseDown: function (e) {
            e.preventDefault();
            if (props.onClick) {
                props.onClick(props.style, props.type, elemId, props.inlineMode);
            }
        },
        disabled: props.disabled || false
    };
    if (props.icon) {
        return (React__default.createElement(core.IconButton, __assign({}, sharedProps, { "aria-label": props.label, color: props.active ? "primary" : "default", size: size }), props.icon));
    }
    if (props.component) {
        return (React__default.createElement(props.component, __assign({}, sharedProps, { active: props.active || false })));
    }
    return null;
};

/**
 * Get the current selection details
 */
var getSelectionInfo = function (editorState) {
    var selection = editorState.getSelection();
    var startOffset = selection.getStartOffset();
    var currentContent = editorState.getCurrentContent();
    var contentBlock = currentContent.getBlockForKey(selection.getStartKey());
    var currentStyle = editorState.getCurrentInlineStyle();
    var linkKey = contentBlock.getEntityAt(startOffset);
    var entityType = null;
    if (linkKey) {
        var linkInstance = currentContent.getEntity(linkKey);
        entityType = linkInstance.getType();
    }
    return {
        inlineStyle: currentStyle,
        blockType: contentBlock.getType(),
        entityType: entityType,
        linkKey: linkKey,
        block: contentBlock
    };
};
/**
 * Spacing compatible for material-ui v3.2.x ~ v.4.x.x
 */
var getCompatibleSpacing = function (spacing, top, right, bottom, left) {
    if (typeof spacing === "function") {
        return spacing(top, right, bottom, left);
    }
    var unit = spacing.unit;
    return top * unit + "px " + right * unit + "px " + bottom * unit + "px " + left * unit + "px";
};
/**
 * Remove a block from the ContentState
 */
var removeBlockFromMap = function (editorState, block) {
    var contentState = editorState.getCurrentContent();
    var removeBlockContentState = draftJs.Modifier.removeRange(contentState, new draftJs.SelectionState({
        anchorKey: block.getKey(),
        anchorOffset: 0,
        focusKey: block.getKey(),
        focusOffset: block.getLength(),
    }), 'backward');
    var blockMap = removeBlockContentState.getBlockMap().delete(block.getKey());
    return removeBlockContentState.merge({
        blockMap: blockMap,
        selectionAfter: contentState.getSelectionAfter()
    });
};
var atomicBlockExists = function (name, controls) {
    if (!controls) {
        return undefined;
    }
    return controls.find(function (control) {
        return control.type === "atomic" &&
            control.name === name &&
            control.atomicComponent !== undefined;
    });
};

var STYLE_TYPES = [
    {
        label: 'H1',
        name: "h1",
        style: 'header-one',
        icon: React__default.createElement('span', null, 'H1'),
        type: "block"
    },
    {
        label: 'H2',
        name: "h2",
        style: 'header-two',
        icon: React__default.createElement('span', null, 'H2'),
        type: "block"
    },
    {
        label: 'H3',
        name: "h3",
        style: 'header-three',
        icon: React__default.createElement('span', null, 'H3'),
        type: "block"
    },
    {
        label: 'Bold',
        name: "bold",
        style: 'BOLD',
        icon: React__default.createElement(FormatBoldIcon, null),
        type: "inline"
    },
    {
        label: 'Italic',
        name: "italic",
        style: 'ITALIC',
        icon: React__default.createElement(FormatItalicIcon, null),
        type: "inline"
    },
    {
        label: 'Underline',
        name: "underline",
        style: 'UNDERLINE',
        icon: React__default.createElement(FormatUnderlinedIcon, null),
        type: "inline"
    },
    {
        label: 'Strikethrough',
        name: "strikethrough",
        style: 'STRIKETHROUGH',
        icon: React__default.createElement(StrikethroughIcon, null),
        type: "inline"
    },
    {
        label: 'Highlight',
        name: "highlight",
        style: 'HIGHLIGHT',
        icon: React__default.createElement(HighlightIcon, null),
        type: "inline"
    },
    {
        label: 'Undo',
        name: "undo",
        style: "UNDO",
        icon: React__default.createElement(UndoIcon, null),
        type: "callback",
    },
    {
        label: 'Redo',
        name: "redo",
        style: "REDO",
        icon: React__default.createElement(RedoIcon, null),
        type: "callback",
    },
    {
        label: 'Link',
        name: "link",
        style: 'LINK',
        icon: React__default.createElement(InsertLinkIcon, null),
        type: "callback",
        id: "mui-rte-link-control"
    },
    {
        label: 'Media',
        name: "media",
        style: 'IMAGE',
        icon: React__default.createElement(PhotoLibraryIcon, null),
        type: "callback",
        id: "mui-rte-media-control"
    },
    {
        label: 'OL',
        name: "bulletList",
        style: 'ordered-list-item',
        icon: React__default.createElement(FormatListNumberedIcon, null),
        type: "block"
    },
    {
        label: 'UL',
        name: "numberList",
        style: 'unordered-list-item',
        icon: React__default.createElement(FormatListBulletedIcon, null),
        type: "block"
    },
    {
        label: 'Blockquote',
        name: "quote",
        style: 'blockquote',
        icon: React__default.createElement(FormatQuoteIcon, null),
        type: "block"
    },
    {
        label: 'Code Block',
        name: "code",
        style: 'code-block',
        icon: React__default.createElement(CodeIcon, null),
        type: "block"
    },
    {
        label: 'Clear',
        name: "clear",
        style: 'clear',
        icon: React__default.createElement(FormatClearIcon, null),
        type: "callback"
    },
    {
        label: 'Save',
        name: "save",
        style: 'save',
        icon: React__default.createElement(SaveIcon, null),
        type: "callback"
    }
];
var Toolbar = function (props) {
    var _a = React.useState(props.controls ? [] : STYLE_TYPES), availableControls = _a[0], setAvailableControls = _a[1];
    var editorState = props.editorState;
    var id = props.inlineMode ? "-inline-toolbar" : "-toolbar";
    React.useEffect(function () {
        if (!props.controls) {
            return;
        }
        var filteredControls = [];
        var controls = props.controls.filter(function (control, index) { return props.controls.indexOf(control) >= index; });
        controls.forEach(function (name) {
            var style = STYLE_TYPES.find(function (style) { return style.name === name; });
            if (style) {
                filteredControls.push(style);
            }
            else if (props.customControls) {
                var customControl = props.customControls.find(function (style) { return style.name === name; });
                if (customControl && customControl.type !== "atomic" &&
                    (customControl.icon || customControl.component)) {
                    filteredControls.push({
                        id: customControl.id || (customControl.name + "Id"),
                        name: customControl.name,
                        label: customControl.name,
                        style: customControl.name.toUpperCase(),
                        icon: customControl.icon,
                        component: customControl.component,
                        type: customControl.type,
                        clickFnName: "onCustomClick"
                    });
                }
            }
        });
        setAvailableControls(filteredControls);
    }, [props.controls, props.customControls]);
    return (React__default.createElement("div", { id: "" + props.id + id, className: props.className }, availableControls.map(function (style) {
        if (props.inlineMode &&
            (style.type !== "inline" && (style.name !== "link" && style.name !== "clear"))) {
            return null;
        }
        var active = false;
        var action = props.onClick;
        if (style.type === "inline") {
            active = editorState.getCurrentInlineStyle().has(style.style);
        }
        else if (style.type === "block") {
            var selection = editorState.getSelection();
            var block = editorState.getCurrentContent().getBlockForKey(selection.getStartKey());
            if (block) {
                active = style.style === block.getType();
            }
        }
        else {
            if (style.style === "IMAGE" || style.style === "LINK") {
                active = style.style === getSelectionInfo(editorState).entityType;
            }
        }
        return (React__default.createElement(ToolbarButton, { id: style.id, key: "key-" + style.label, active: active, label: style.label, onClick: action, style: style.style, type: style.type, icon: style.icon, component: style.component, inlineMode: props.inlineMode, disabled: props.disabled, size: props.size }));
    })));
};

var styles = function (_a) {
    var shadows = _a.shadows;
    return styles$5.createStyles({
        root: {
            margin: "5px 0 1px",
            outline: "none"
        },
        editable: {
            cursor: "pointer",
            "&:hover": {
                boxShadow: shadows[3]
            }
        },
        focused: {
            boxShadow: shadows[3]
        },
        centered: {
            textAlign: "center"
        },
        leftAligned: {
            textAlign: "left"
        },
        rightAligned: {
            textAlign: "right"
        }
    });
};
var Media = function (props) {
    var _a;
    var _b = props.contentState.getEntity(props.block.getEntityAt(0)).getData(), url = _b.url, width = _b.width, height = _b.height, alignment = _b.alignment, type = _b.type;
    var _c = props.blockProps, onClick = _c.onClick, readOnly = _c.readOnly, focusKey = _c.focusKey;
    var htmlTag = function () {
        var _a;
        var componentProps = {
            src: url,
            className: classNames(props.classes.root, (_a = {},
                _a[props.classes.editable] = !readOnly,
                _a[props.classes.focused] = !readOnly && focusKey === props.block.getKey(),
                _a)),
            width: width,
            height: type === "video" ? "auto" : height,
            onClick: function () {
                if (readOnly) {
                    return;
                }
                onClick(props.block);
            }
        };
        if (!type || type === "image") {
            return React__default.createElement("img", __assign({}, componentProps));
        }
        if (type === "video") {
            return React__default.createElement("video", __assign({}, componentProps, { autoPlay: false, controls: true }));
        }
        return null;
    };
    return (React__default.createElement("div", { className: classNames((_a = {},
            _a[props.classes.centered] = alignment === "center",
            _a[props.classes.leftAligned] = alignment === "left",
            _a[props.classes.rightAligned] = alignment === "right",
            _a)) }, htmlTag()));
};
var Media$1 = styles$5.withStyles(styles, { withTheme: true })(Media);

var styles$1 = function (_a) {
    var palette = _a.palette;
    return styles$5.createStyles({
        root: {
            fontStyle: "italic",
            color: palette.grey[800],
            borderLeft: "4px solid " + palette.grey.A100
        }
    });
};
var Blockquote = function (props) {
    return (React.createElement("div", { className: props.classes.root }, props.children));
};
var Blockquote$1 = styles$5.withStyles(styles$1, { withTheme: true })(Blockquote);

var styles$2 = function (_a) {
    var spacing = _a.spacing, palette = _a.palette;
    return styles$5.createStyles({
        root: {
            backgroundColor: palette.grey[200],
            padding: getCompatibleSpacing(spacing, 1, 2, 1, 2)
        }
    });
};
var CodeBlock = function (props) {
    console.log(props);
    return (React.createElement("div", { className: props.classes.root },
        React.createElement("pre", { style: { whiteSpace: 'pre-wrap' } }, props.children)));
};
var CodeBlock$1 = styles$5.withStyles(styles$2, { withTheme: true })(CodeBlock);

var styles$3 = function (_a) {
    var spacing = _a.spacing;
    return styles$5.createStyles({
        linkPopover: {
            padding: getCompatibleSpacing(spacing, 2, 2, 2, 2),
            minWidth: "90%",
        },
        linkTextField: {
            width: "100%"
        }
    });
};
var UrlPopover = function (props) {
    var _a = React.useState(props.data || {
        url: undefined,
        width: undefined,
        height: undefined,
        alignment: undefined,
        type: undefined
    }), data = _a[0], setData = _a[1];
    var classes = props.classes;
    var onSizeChange = function (value, prop) {
        var _a, _b;
        if (value === "") {
            setData(__assign(__assign({}, data), (_a = {}, _a[prop] = undefined, _a)));
            return;
        }
        var intValue = parseInt(value, 10);
        if (isNaN(intValue)) {
            return;
        }
        setData(__assign(__assign({}, data), (_b = {}, _b[prop] = intValue, _b)));
    };
    return (React__default.createElement(core.Popover, { onClose: props.onCancel, open: props.anchor !== undefined, anchorEl: props.anchor, anchorOrigin: {
            vertical: "bottom",
            horizontal: "center"
        }, transformOrigin: {
            vertical: 'top',
            horizontal: 'center',
        }, PaperProps: {
            style: { width: '70%' },
        } },
        React__default.createElement("div", { className: classes.linkPopover },
            React__default.createElement(core.Grid, { container: true, spacing: 1 },
                React__default.createElement(core.Grid, { container: true, item: true, xs: true, spacing: 1 },
                    React__default.createElement(core.Grid, { item: true, xs: 12 },
                        React__default.createElement(core.TextField, { className: classes.linkTextField, onChange: function (event) {
                                setData(__assign(__assign({}, data), { url: event.target.value }));
                            }, label: "URL", defaultValue: props.data && props.data.url, autoFocus: true, multiline: true, InputLabelProps: {
                                shrink: true
                            } })),
                    props.isMedia ?
                        React__default.createElement(React__default.Fragment, null,
                            React__default.createElement(core.Grid, { item: true, xs: 12 },
                                React__default.createElement(ButtonGroup, { fullWidth: true },
                                    React__default.createElement(core.Button, { color: (!data.type || data.type === "image") ? "primary" : "default", size: "small", onClick: function () { return setData(__assign(__assign({}, data), { type: "image" })); } },
                                        React__default.createElement(InsertPhotoIcon, null)),
                                    React__default.createElement(core.Button, { color: data.type === "video" ? "primary" : "default", size: "small", onClick: function () { return setData(__assign(__assign({}, data), { type: "video" })); } },
                                        React__default.createElement(MovieIcon, null)))),
                            React__default.createElement(core.Grid, { item: true, xs: 6 },
                                React__default.createElement(core.TextField, { onChange: function (event) { return onSizeChange(event.target.value, "width"); }, value: data.width || "", label: "Width", InputLabelProps: {
                                        shrink: true
                                    } })),
                            React__default.createElement(core.Grid, { item: true, xs: 6 },
                                React__default.createElement(core.TextField, { onChange: function (event) { return onSizeChange(event.target.value, "height"); }, value: data.height || "", label: "Height", InputLabelProps: {
                                        shrink: true
                                    } })),
                            React__default.createElement(core.Grid, { item: true, xs: 12 },
                                React__default.createElement(ButtonGroup, { fullWidth: true },
                                    React__default.createElement(core.Button, { color: data.alignment === "left" ? "primary" : "default", size: "small", onClick: function () { return setData(__assign(__assign({}, data), { alignment: "left" })); } },
                                        React__default.createElement(FormatAlignLeft, null)),
                                    React__default.createElement(core.Button, { color: data.alignment === "center" ? "primary" : "default", size: "small", onClick: function () { return setData(__assign(__assign({}, data), { alignment: "center" })); } },
                                        React__default.createElement(FormatAlignCenter, null)),
                                    React__default.createElement(core.Button, { color: data.alignment === "right" ? "primary" : "default", size: "small", onClick: function () { return setData(__assign(__assign({}, data), { alignment: "right" })); } },
                                        React__default.createElement(FormatAlignRight, null)))))
                        : null),
                React__default.createElement(core.Grid, { container: true, item: true, xs: 12, direction: "row", justify: "flex-end" },
                    props.data && props.data.url ?
                        React__default.createElement(core.Button, { onClick: function () { return props.onConfirm(props.isMedia, ""); } },
                            React__default.createElement(DeleteIcon, null))
                        : null,
                    React__default.createElement(core.Button, { onClick: function () { return props.onConfirm(props.isMedia, data.url, data.width, data.height, data.alignment, data.type); } },
                        React__default.createElement(CheckIcon, null)))))));
};
var UrlPopover$1 = styles$5.withStyles(styles$3, { withTheme: true })(UrlPopover);

var styles$4 = function (_a) {
    var spacing = _a.spacing, typography = _a.typography, palette = _a.palette;
    return styles$5.createStyles({
        root: {},
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
        editor: {},
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
        toolbar: {},
        inlineToolbar: {
            maxWidth: "180px",
            position: "absolute",
            padding: "5px",
            zIndex: 10
        }
    });
};
var blockRenderMap = Immutable.Map({
    'blockquote': {
        element: "blockquote",
        wrapper: React__default.createElement(Blockquote$1, null)
    },
    'code-block': {
        element: "span",
        wrapper: React__default.createElement(CodeBlock$1, null)
    }
});
var styleRenderMap = {
    // 'STRIKETROUGH': {
    //     textDecoration: "line-through"
    // },
    'HIGHLIGHT': {
        backgroundColor: "yellow"
    }
};
var hasCommandModifier = draftJs.KeyBindingUtil.hasCommandModifier;
var findLinkEntities = function (contentBlock, callback, contentState) {
    contentBlock.findEntityRanges(function (character) {
        var entityKey = character.getEntity();
        return (entityKey !== null &&
            contentState.getEntity(entityKey).getType() === 'LINK');
    }, callback);
};
var findDecoWithRegex = function (regex, contentBlock, callback) {
    var text = contentBlock.getText();
    var matchArr, start;
    while ((matchArr = regex.exec(text)) !== null) {
        start = matchArr.index;
        callback(start, start + matchArr[0].length);
    }
};
var MUIRichTextEditor = function (props, ref) {
    var _a, _b, _c;
    var classes = props.classes, controls = props.controls, customControls = props.customControls;
    var _d = React.useState({}), state = _d[0], setState = _d[1];
    var _e = React.useState(false), focus = _e[0], setFocus = _e[1];
    var editorState = props.editorState;
    //const [editorState, setEditorState] = useState(() => useEditorState(props))
    var _f = React.useState({
        style: undefined,
        block: undefined
    }), customRenderers = _f[0], setCustomRenderers = _f[1];
    var _g = React.useState(""), focusMediaKey = _g[0], setFocusMediaKey = _g[1];
    var editorRef = React.useRef(null);
    var selectionRef = React.useRef({
        start: 0,
        end: 0
    });
    var toolbarPositionRef = React.useRef(undefined);
    var editorStateRef = React.useRef(editorState);
    /**
     * Expose methods
     */
    React.useImperativeHandle(ref, function () { return ({
        focus: function () {
            handleFocus();
        },
        save: function () {
            handleSave();
        },
        insertAtomicBlock: function (name, data) {
            handleInsertAtomicBlock(name, data);
        }
    }); });
    React.useEffect(function () {
        //const editorState = useEditorState(props)
        var customBlockMap = {};
        var customStyleMap = JSON.parse(JSON.stringify(styleRenderMap));
        if (props.customControls) {
            props.customControls.forEach(function (control) {
                if (control.type === "inline" && control.inlineStyle) {
                    customStyleMap[control.name.toUpperCase()] = control.inlineStyle;
                }
                else if (control.type === "block" && control.blockWrapper) {
                    customBlockMap[control.name.toUpperCase()] = {
                        element: "div",
                        wrapper: control.blockWrapper
                    };
                }
            });
        }
        setCustomRenderers({
            style: customStyleMap,
            block: draftJs.DefaultDraftBlockRenderMap.merge(blockRenderMap, Immutable.Map(customBlockMap))
        });
        //handleChange(editorState);
        //setEditorState(editorState)
        toggleMouseUpListener(true);
        return function () {
            toggleMouseUpListener();
        };
    }, []);
    React.useEffect(function () {
        editorStateRef.current = editorState;
    }, [editorState]);
    React.useEffect(function () {
        toolbarPositionRef.current = state.toolbarPosition;
    }, [state.toolbarPosition]);
    var handleMouseUp = function (event) {
        var nodeName = event.target.nodeName;
        if (nodeName === "IMG" || nodeName === "VIDEO") {
            return;
        }
        setTimeout(function () {
            var selection = editorStateRef.current.getSelection();
            if (selection.isCollapsed() || (toolbarPositionRef !== undefined &&
                selectionRef.current.start === selection.getStartOffset() &&
                selectionRef.current.end === selection.getEndOffset())) {
                var selectionInfo = getSelectionInfo(editorStateRef.current);
                if (selectionInfo.entityType === "IMAGE") {
                    focusMedia(selectionInfo.block);
                    return;
                }
                setState(__assign(__assign({}, state), { toolbarPosition: undefined }));
                return;
            }
            selectionRef.current = {
                start: selection.getStartOffset(),
                end: selection.getEndOffset()
            };
            var editor = editorRef.current.editor;
            var selectionRect = draftJs.getVisibleSelectionRect(window);
            var editorRect = editor.getBoundingClientRect();
            if (!selectionRect) {
                return;
            }
            var position = {
                top: editor.offsetTop - 48 + (selectionRect.top - editorRect.top),
                left: editor.offsetLeft + (selectionRect.left - editorRect.left)
            };
            setState(__assign(__assign({}, state), { toolbarPosition: position }));
        }, 1);
    };
    var handleChange = function (state) {
        //setEditorState(state)
        if (props.onChange) {
            props.onChange(state);
        }
    };
    var handleBeforeInput = function () {
        if (props.maxLength) {
            var length = editorState.getCurrentContent().getPlainText('').length;
            if (length >= props.maxLength) {
                return "handled";
            }
        }
        return "not-handled";
    };
    var handleFocus = function () {
        setFocus(true);
        setTimeout(function () { return editorRef.current.focus(); }, 0);
    };
    var handleBlur = function () {
        setFocus(false);
        if (!state.anchorUrlPopover) {
            setState(__assign(__assign({}, state), { toolbarPosition: undefined }));
        }
    };
    var handleClearFormat = function () {
        var selectionInfo = getSelectionInfo(editorState);
        var newEditorState = editorState;
        selectionInfo.inlineStyle.forEach(function (effect) {
            if (effect) {
                newEditorState = draftJs.RichUtils.toggleInlineStyle(newEditorState, effect);
            }
        });
        newEditorState = draftJs.RichUtils.toggleBlockType(newEditorState, selectionInfo.blockType);
        handleChange(newEditorState);
    };
    var handleSave = function () {
        if (props.onSave) {
            props.onSave(JSON.stringify(draftJs.convertToRaw(editorState.getCurrentContent())));
        }
    };
    var handleInsertAtomicBlock = function (name, data) {
        var block = atomicBlockExists(name, props.customControls);
        if (!block) {
            return;
        }
        var newEditorState = insertAtomicBlock(block.name.toUpperCase(), data, {
            selection: editorState.getCurrentContent().getSelectionAfter()
        });
        updateStateForPopover(newEditorState);
    };
    var handleKeyCommand = function (command, editorState) {
        var newState = draftJs.RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            handleChange(newState);
            return "handled";
        }
        else {
            if (props.keyCommands) {
                var keyCommand = props.keyCommands.find(function (comm) { return comm.name === command; });
                if (keyCommand) {
                    var newState_1 = keyCommand.callback(editorState);
                    handleChange(newState_1);
                    return "handled";
                }
            }
        }
        return "not-handled";
    };
    var handleCustomClick = function (style, id) {
        if (!props.customControls) {
            return;
        }
        for (var _i = 0, _a = props.customControls; _i < _a.length; _i++) {
            var control = _a[_i];
            if (control.name.toUpperCase() === style) {
                if (control.onClick) {
                    setTimeout(function () { return editorRef.current.blur(); }, 0);
                    var newState = control.onClick(editorState, control.name, document.getElementById(id));
                    if (newState) {
                        if (newState.getSelection().isCollapsed()) {
                            handleChange(newState);
                        }
                        else {
                            updateStateForPopover(newState);
                        }
                    }
                    else {
                        if (!editorState.getSelection().isCollapsed()) {
                            refocus();
                        }
                    }
                }
                break;
            }
        }
    };
    var handleUndo = function () {
        handleChange(draftJs.EditorState.undo(editorState));
    };
    var handleRedo = function () {
        handleChange(draftJs.EditorState.redo(editorState));
    };
    var handlePrompt = function (lastState, type, inlineMode) {
        var selectionInfo = getSelectionInfo(lastState);
        var contentState = lastState.getCurrentContent();
        var linkKey = selectionInfo.linkKey;
        var data = undefined;
        if (linkKey) {
            var linkInstance = contentState.getEntity(linkKey);
            data = linkInstance.getData();
        }
        setState({
            urlData: data,
            urlKey: linkKey,
            toolbarPosition: !inlineMode && type !== "link" ? undefined : state.toolbarPosition,
            anchorUrlPopover: !inlineMode ? document.getElementById("mui-rte-" + type + "-control-button")
                : document.getElementById("mui-rte-" + type + "-control-button-toolbar"),
            urlIsMedia: type === "media" ? true : undefined
        });
    };
    var handlePromptForLink = function (inlineMode) {
        var selection = editorState.getSelection();
        if (!selection.isCollapsed()) {
            handlePrompt(editorState, "link", inlineMode);
        }
    };
    var handlePromptForMedia = function (inlineMode, newState) {
        var lastState = newState || editorState;
        handlePrompt(lastState, "media", inlineMode);
    };
    var handleConfirmPrompt = function (isMedia) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (isMedia) {
            confirmMedia.apply(void 0, args);
            return;
        }
        confirmLink.apply(void 0, args);
    };
    var handleToolbarClick = function (style, type, id, inlineMode) {
        if (type === "inline") {
            return toggleInlineStyle(style);
        }
        if (type === "block") {
            return toggleBlockType(style);
        }
        switch (style) {
            case "UNDO":
                handleUndo();
                break;
            case "REDO":
                handleRedo();
                break;
            case "LINK":
                handlePromptForLink(inlineMode);
                break;
            case "IMAGE":
                handlePromptForMedia(inlineMode);
                break;
            case "clear":
                handleClearFormat();
                break;
            case "save":
                handleSave();
                break;
            default:
                handleCustomClick(style, id);
        }
    };
    var toggleMouseUpListener = function (addAfter) {
        if (addAfter === void 0) { addAfter = false; }
        var editor = editorRef.current.editor;
        if (!editor) {
            return;
        }
        editor.removeEventListener("mouseup", handleMouseUp);
        if (addAfter) {
            editor.addEventListener("mouseup", handleMouseUp);
        }
    };
    var removeLink = function () {
        var selection = editorState.getSelection();
        updateStateForPopover(draftJs.RichUtils.toggleLink(editorState, selection, null));
    };
    var confirmLink = function (url) {
        var urlKey = state.urlKey;
        if (!url) {
            if (urlKey) {
                removeLink();
                return;
            }
            setState(__assign(__assign({}, state), { anchorUrlPopover: undefined }));
            return;
        }
        var contentState = editorState.getCurrentContent();
        var replaceEditorState = null;
        var data = {
            url: url
        };
        if (urlKey) {
            contentState.replaceEntityData(urlKey, data);
            replaceEditorState = draftJs.EditorState.push(editorState, contentState, "apply-entity");
        }
        else {
            var contentStateWithEntity = contentState.createEntity('LINK', 'MUTABLE', data);
            var entityKey = contentStateWithEntity.getLastCreatedEntityKey();
            var newEditorState = draftJs.EditorState.set(editorState, { currentContent: contentStateWithEntity });
            replaceEditorState = draftJs.RichUtils.toggleLink(newEditorState, newEditorState.getSelection(), entityKey);
        }
        updateStateForPopover(replaceEditorState);
    };
    var removeMedia = function () {
        var blockKey = editorState.getSelection().getStartKey();
        var contentState = editorState.getCurrentContent();
        var mediaBlock = contentState.getBlockForKey(blockKey);
        var newContentState = removeBlockFromMap(editorState, mediaBlock);
        var newEditorState = draftJs.EditorState.push(editorState, newContentState, "remove-range");
        handleChange(newEditorState);
    };
    var confirmMedia = function (url, width, height, alignment, type) {
        var urlKey = state.urlKey;
        if (!url) {
            if (urlKey) {
                removeMedia();
            }
            setState(__assign(__assign({}, state), { anchorUrlPopover: undefined }));
            return;
        }
        var contentState = editorState.getCurrentContent();
        var data = {
            url: url,
            width: width,
            height: height,
            alignment: alignment,
            type: type
        };
        if (urlKey) {
            contentState.replaceEntityData(urlKey, data);
            var newEditorState = draftJs.EditorState.push(editorState, contentState, "apply-entity");
            updateStateForPopover(draftJs.EditorState.forceSelection(newEditorState, newEditorState.getCurrentContent().getSelectionAfter()));
        }
        else {
            var newEditorState = insertAtomicBlock("IMAGE", data);
            updateStateForPopover(draftJs.EditorState.forceSelection(newEditorState, newEditorState.getCurrentContent().getSelectionAfter()));
        }
        setFocusMediaKey("");
    };
    var updateStateForPopover = function (editorState) {
        handleChange(editorState);
        refocus();
        setState(__assign(__assign({}, state), { anchorUrlPopover: undefined, urlKey: undefined, urlIsMedia: undefined, urlData: undefined }));
    };
    var refocus = function () {
        setTimeout(function () { return editorRef.current.blur(); }, 0);
        setTimeout(function () { return editorRef.current.focus(); }, 1);
    };
    var toggleBlockType = function (blockType) {
        handleChange(draftJs.RichUtils.toggleBlockType(editorState, blockType));
    };
    var toggleInlineStyle = function (inlineStyle) {
        handleChange(draftJs.RichUtils.toggleInlineStyle(editorState, inlineStyle));
    };
    var focusMedia = function (block) {
        var newSeletion = draftJs.SelectionState.createEmpty(block.getKey());
        var newEditorState = draftJs.EditorState.forceSelection(editorStateRef.current, newSeletion);
        editorStateRef.current = newEditorState;
        setFocusMediaKey(block.getKey());
        handleChange(newEditorState);
        handlePromptForMedia(false, newEditorState);
    };
    var blockRenderer = function (contentBlock) {
        var blockType = contentBlock.getType();
        if (blockType === 'atomic') {
            var contentState = editorState.getCurrentContent();
            var entity = contentBlock.getEntityAt(0);
            if (entity) {
                var type = contentState.getEntity(entity).getType();
                if (type === "IMAGE") {
                    return {
                        component: Media$1,
                        editable: false,
                        props: {
                            onClick: focusMedia,
                            readOnly: props.readOnly,
                            focusKey: focusMediaKey
                        }
                    };
                }
                else {
                    var block = atomicBlockExists(type.toLowerCase(), props.customControls);
                    if (!block) {
                        return null;
                    }
                    return {
                        component: block.atomicComponent,
                        editable: false,
                        props: contentState.getEntity(contentBlock.getEntityAt(0)).getData()
                    };
                }
            }
        }
        return null;
    };
    var insertAtomicBlock = function (type, data, options) {
        var contentState = editorState.getCurrentContent();
        var contentStateWithEntity = contentState.createEntity(type, 'IMMUTABLE', data);
        var entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        var newEditorStateRaw = draftJs.EditorState.set(editorState, __assign({ currentContent: contentStateWithEntity }, options));
        return draftJs.AtomicBlockUtils.insertAtomicBlock(newEditorStateRaw, entityKey, ' ');
    };
    var keyBindingFn = function (e) {
        if (hasCommandModifier(e) && props.keyCommands) {
            var comm = props.keyCommands.find(function (comm) { return comm.key === e.keyCode; });
            if (comm) {
                return comm.name;
            }
        }
        return draftJs.getDefaultKeyBinding(e);
    };
    var renderToolbar = props.toolbar === undefined || props.toolbar;
    var inlineToolbarControls = props.inlineToolbarControls || ["bold", "italic", "underline", "clear"];
    var editable = props.readOnly === undefined || !props.readOnly;
    var id = props.id || "mui-rte";
    var className = "";
    var placeholder = null;
    if (!focus) {
        var contentState = editorState.getCurrentContent();
        if (!contentState.hasText()) {
            placeholder = (React__default.createElement("div", { className: classNames(classes.editorContainer, classes.placeHolder, (_a = {},
                    _a[classes.error] = props.error,
                    _a)), onClick: handleFocus }, props.label || ""));
            className = classes.hidePlaceholder;
        }
    }
    var dismissPopover = function () {
        refocus();
        setState(__assign(__assign({}, state), { anchorUrlPopover: undefined, urlKey: undefined, urlIsMedia: undefined, urlData: undefined }));
    };
    return (React__default.createElement("div", { id: id + "-root", className: classes.root },
        React__default.createElement("div", { id: id + "-container", className: classNames(classes.container, (_b = {},
                _b[classes.inheritFontSize] = props.inheritFontSize,
                _b)) },
            props.inlineToolbar && editable && state.toolbarPosition ?
                React__default.createElement(core.Paper, { className: classes.inlineToolbar, style: {
                        top: state.toolbarPosition.top + 75,
                        left: state.toolbarPosition.left
                    } },
                    React__default.createElement(Toolbar, { id: id, editorState: editorState, onClick: handleToolbarClick, controls: inlineToolbarControls, customControls: customControls }))
                : null,
            renderToolbar ?
                React__default.createElement(Toolbar, { id: id, editorState: editorState, onClick: handleToolbarClick, controls: controls, customControls: customControls, className: classes.toolbar, disabled: !editable, size: props.toolbarButtonSize })
                : null,
            placeholder,
            React__default.createElement("div", { id: id + "-editor", className: classes.editor },
                React__default.createElement("div", { id: id + "-editor-container", className: classNames(className, classes.editorContainer, (_c = {},
                        _c[classes.editorReadOnly] = !editable,
                        _c[classes.error] = props.error,
                        _c)), onClick: handleFocus, onBlur: handleBlur },
                    React__default.createElement(draftJs.Editor, __assign({ customStyleMap: customRenderers.style, blockRenderMap: customRenderers.block, blockRendererFn: blockRenderer, editorState: editorState, onChange: handleChange, readOnly: props.readOnly, handleKeyCommand: handleKeyCommand, handleBeforeInput: handleBeforeInput, keyBindingFn: keyBindingFn, ref: editorRef }, props.draftEditorProps)))),
            state.anchorUrlPopover ?
                React__default.createElement(UrlPopover$1, { data: state.urlData, anchor: state.anchorUrlPopover, onConfirm: handleConfirmPrompt, onCancel: dismissPopover, isMedia: state.urlIsMedia })
                : null)));
};
var MUIRichTextEditor$1 = styles$5.withStyles(styles$4, { withTheme: true, name: "MUIRichTextEditor" })(React.forwardRef(MUIRichTextEditor));

exports.Link = Link;
exports.default = MUIRichTextEditor$1;
exports.findDecoWithRegex = findDecoWithRegex;
exports.findLinkEntities = findLinkEntities;
//# sourceMappingURL=index.js.map
