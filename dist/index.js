'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var Immutable = _interopDefault(require('immutable'));
var classNames = _interopDefault(require('classnames'));
var styles$6 = require('@material-ui/core/styles');
var Paper = _interopDefault(require('@material-ui/core/Paper'));
var draftJs = require('draft-js');
var FormatBoldIcon = _interopDefault(require('@material-ui/icons/FormatBold'));
var FormatItalicIcon = _interopDefault(require('@material-ui/icons/FormatItalic'));
var FormatUnderlinedIcon = _interopDefault(require('@material-ui/icons/FormatUnderlined'));
var StrikethroughIcon = _interopDefault(require('@material-ui/icons/StrikethroughS'));
var HighlightIcon = _interopDefault(require('@material-ui/icons/Highlight'));
var TitleIcon = _interopDefault(require('@material-ui/icons/Title'));
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
var IconButton = _interopDefault(require('@material-ui/core/IconButton'));
var MuiLink = _interopDefault(require('@material-ui/core/Link'));
var Button = _interopDefault(require('@material-ui/core/Button'));
var Grid = _interopDefault(require('@material-ui/core/Grid'));
var Popover = _interopDefault(require('@material-ui/core/Popover'));
var TextField = _interopDefault(require('@material-ui/core/TextField'));
var ButtonGroup = _interopDefault(require('@material-ui/core/ButtonGroup'));
var InsertPhotoIcon = _interopDefault(require('@material-ui/icons/InsertPhoto'));
var MovieIcon = _interopDefault(require('@material-ui/icons/Movie'));
var CheckIcon = _interopDefault(require('@material-ui/icons/Check'));
var DeleteIcon = _interopDefault(require('@material-ui/icons/DeleteOutline'));
var FormatAlignCenter = _interopDefault(require('@material-ui/icons/FormatAlignCenter'));
var FormatAlignLeft = _interopDefault(require('@material-ui/icons/FormatAlignLeft'));
var FormatAlignRight = _interopDefault(require('@material-ui/icons/FormatAlignRight'));
var List = _interopDefault(require('@material-ui/core/List'));
var ListItem = _interopDefault(require('@material-ui/core/ListItem'));
var draftJsExportHtml = require('draft-js-export-html');

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
    var editorId = props.editorId || "mui-rte";
    var elemId = editorId + "-" + (props.id || props.label) + "-button" + toolbarId;
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
        return (React__default.createElement(IconButton, __assign({}, sharedProps, { "aria-label": props.label, color: props.active ? "primary" : "default", size: size }), props.icon));
    }
    if (props.component) {
        return (React__default.createElement(props.component, __assign({}, sharedProps, { active: props.active || false })));
    }
    return null;
};
//# sourceMappingURL=ToolbarButton.js.map

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
    var entityType = "";
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
var isGreaterThan = function (value, maxValue) {
    if (!maxValue) {
        return false;
    }
    return value > maxValue;
};
var clearInlineStyles = function (editorState, customStyles) {
    var styles = ['BOLD', 'ITALIC', 'UNDERLINE'];
    if (customStyles) {
        styles = styles.concat(Object.getOwnPropertyNames(customStyles));
    }
    return styles.reduce(function (newContentState, style) { return (draftJs.Modifier.removeInlineStyle(newContentState, editorState.getSelection(), style)); }, editorState.getCurrentContent());
};
var getEditorBounds = function (editor) {
    return {
        selectionRect: draftJs.getVisibleSelectionRect(window),
        editorRect: editor.getBoundingClientRect()
    };
};
var getLineNumber = function (editorState) {
    var currentBlockKey = editorState.getSelection().getStartKey();
    return editorState.getCurrentContent().getBlockMap()
        .keySeq().findIndex(function (k) { return k === currentBlockKey; });
};
//# sourceMappingURL=utils.js.map

var STYLE_TYPES = [
    {
        label: 'H2',
        name: "title",
        style: 'header-two',
        icon: React__default.createElement(TitleIcon, null),
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
        id: "link-control"
    },
    {
        label: 'Media',
        name: "media",
        style: 'IMAGE',
        icon: React__default.createElement(PhotoLibraryIcon, null),
        type: "callback",
        id: "media-control"
    },
    {
        label: 'UL',
        name: "bulletList",
        style: 'unordered-list-item',
        icon: React__default.createElement(FormatListBulletedIcon, null),
        type: "block"
    },
    {
        label: 'OL',
        name: "numberList",
        style: 'ordered-list-item',
        icon: React__default.createElement(FormatListNumberedIcon, null),
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
        if (!props.isActive) {
            active = false;
        }
        else if (style.type === "inline") {
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
        return (React__default.createElement(ToolbarButton, { id: style.id, editorId: props.id, key: "key-" + style.label, active: active, label: style.label, onClick: action, style: style.style, type: style.type, icon: style.icon, component: style.component, inlineMode: props.inlineMode, disabled: props.disabled, size: props.size }));
    })));
};
//# sourceMappingURL=Toolbar.js.map

var Link = function (props) {
    var _a = props.contentState.getEntity(props.entityKey).getData(), url = _a.url, className = _a.className;
    return (React__default.createElement(MuiLink, { href: url, className: className + " editor-anchor", target: "_blank" }, props.children));
};
//# sourceMappingURL=Link.js.map

var styles = function (_a) {
    var shadows = _a.shadows;
    return styles$6.createStyles({
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
var Media$1 = styles$6.withStyles(styles, { withTheme: true })(Media);
//# sourceMappingURL=Media.js.map

var styles$1 = function (_a) {
    var palette = _a.palette;
    return styles$6.createStyles({
        root: {
            fontStyle: "italic",
            color: palette.grey[800],
            borderLeft: "4px solid " + palette.grey.A100
        }
    });
};
var Blockquote = function (props) {
    return (React__default.createElement("div", { className: props.classes.root }, props.children));
};
var Blockquote$1 = styles$6.withStyles(styles$1, { withTheme: true })(Blockquote);
//# sourceMappingURL=Blockquote.js.map

var styles$2 = function (_a) {
    var spacing = _a.spacing, palette = _a.palette;
    return styles$6.createStyles({
        root: {
            backgroundColor: palette.grey[200],
            padding: spacing(1, 2, 1, 2)
        }
    });
};
var CodeBlock = function (props) {
    return (React__default.createElement("div", { className: props.classes.root }, props.children));
};
var CodeBlock$1 = styles$6.withStyles(styles$2, { withTheme: true })(CodeBlock);
//# sourceMappingURL=CodeBlock.js.map

var styles$3 = function (_a) {
    var spacing = _a.spacing;
    return styles$6.createStyles({
        linkPopover: {
            padding: spacing(2, 2, 2, 2),
            maxWidth: 250
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
    return (React__default.createElement(Popover, { open: props.anchor !== undefined, anchorEl: props.anchor, anchorOrigin: {
            vertical: "bottom",
            horizontal: "left"
        }, transformOrigin: {
            vertical: 'top',
            horizontal: 'left',
        } },
        React__default.createElement("div", { className: classes.linkPopover },
            React__default.createElement(Grid, { container: true, spacing: 1 },
                React__default.createElement(Grid, { container: true, item: true, xs: true, spacing: 1 },
                    React__default.createElement(Grid, { item: true, xs: 12 },
                        React__default.createElement(TextField, { className: classes.linkTextField, onChange: function (event) { return setData(__assign(__assign({}, data), { url: event.target.value })); }, label: "URL", defaultValue: props.data && props.data.url, autoFocus: true, InputLabelProps: {
                                shrink: true
                            } })),
                    props.isMedia ?
                        React__default.createElement(React__default.Fragment, null,
                            React__default.createElement(Grid, { item: true, xs: 12 },
                                React__default.createElement(ButtonGroup, { fullWidth: true },
                                    React__default.createElement(Button, { color: (!data.type || data.type === "image") ? "primary" : "default", size: "small", onClick: function () { return setData(__assign(__assign({}, data), { type: "image" })); } },
                                        React__default.createElement(InsertPhotoIcon, null)),
                                    React__default.createElement(Button, { color: data.type === "video" ? "primary" : "default", size: "small", onClick: function () { return setData(__assign(__assign({}, data), { type: "video" })); } },
                                        React__default.createElement(MovieIcon, null)))),
                            React__default.createElement(Grid, { item: true, xs: 6 },
                                React__default.createElement(TextField, { onChange: function (event) { return onSizeChange(event.target.value, "width"); }, value: data.width || "", label: "Width", InputLabelProps: {
                                        shrink: true
                                    } })),
                            React__default.createElement(Grid, { item: true, xs: 6 },
                                React__default.createElement(TextField, { onChange: function (event) { return onSizeChange(event.target.value, "height"); }, value: data.height || "", label: "Height", InputLabelProps: {
                                        shrink: true
                                    } })),
                            React__default.createElement(Grid, { item: true, xs: 12 },
                                React__default.createElement(ButtonGroup, { fullWidth: true },
                                    React__default.createElement(Button, { color: data.alignment === "left" ? "primary" : "default", size: "small", onClick: function () { return setData(__assign(__assign({}, data), { alignment: "left" })); } },
                                        React__default.createElement(FormatAlignLeft, null)),
                                    React__default.createElement(Button, { color: data.alignment === "center" ? "primary" : "default", size: "small", onClick: function () { return setData(__assign(__assign({}, data), { alignment: "center" })); } },
                                        React__default.createElement(FormatAlignCenter, null)),
                                    React__default.createElement(Button, { color: data.alignment === "right" ? "primary" : "default", size: "small", onClick: function () { return setData(__assign(__assign({}, data), { alignment: "right" })); } },
                                        React__default.createElement(FormatAlignRight, null)))))
                        : null),
                React__default.createElement(Grid, { container: true, item: true, xs: 12, direction: "row", justify: "flex-end" },
                    props.data && props.data.url ?
                        React__default.createElement(Button, { onClick: function () { return props.onConfirm(props.isMedia, ""); } },
                            React__default.createElement(DeleteIcon, null))
                        : null,
                    React__default.createElement(Button, { onClick: function () { return props.onConfirm(props.isMedia, data.url, data.width, data.height, data.alignment, data.type); } },
                        React__default.createElement(CheckIcon, null)))))));
};
var UrlPopover$1 = styles$6.withStyles(styles$3, { withTheme: true })(UrlPopover);
//# sourceMappingURL=UrlPopover.js.map

var styles$4 = function () {
    return styles$6.createStyles({
        container: {
            minWidth: "200px",
            position: "absolute",
            zIndex: 10,
        },
        item: {
            cursor: "pointer",
        },
    });
};
var Autocomplete = function (props) {
    if (!props.items.length) {
        return null;
    }
    var classes = props.classes;
    return (React__default.createElement(Paper, { className: classes.container, style: {
            top: props.top,
            left: props.left,
        } },
        React__default.createElement(List, { dense: true }, props.items.map(function (item, index) { return (React__default.createElement(ListItem, { key: index, className: classes.item, selected: index === props.selectedIndex, onClick: function () { return props.onClick(index); } }, item.content)); }))));
};
var Autocomplete$1 = styles$6.withStyles(styles$4, { withTheme: true })(Autocomplete);
//# sourceMappingURL=Autocomplete.js.map

var styles$5 = function (_a) {
    var spacing = _a.spacing, typography = _a.typography, palette = _a.palette;
    return styles$6.createStyles({
        root: {},
        container: {
            margin: spacing(1, 0, 0, 0),
            position: "relative",
            fontFamily: typography.body1.fontFamily,
            fontSize: typography.body1.fontSize,
            "& figure": {
                margin: 0,
            },
        },
        inheritFontSize: {
            fontSize: "inherit",
        },
        editor: {},
        editorContainer: {
            margin: spacing(1, 0, 0, 0),
            cursor: "text",
            width: "100%",
            padding: spacing(0, 0, 1, 0),
        },
        editorReadOnly: {
            borderBottom: "none",
        },
        error: {
            borderBottom: "2px solid red",
        },
        hidePlaceholder: {
            display: "none",
        },
        placeHolder: {
            color: palette.grey[600],
            position: "absolute",
            outline: "none",
        },
        linkPopover: {
            padding: spacing(2, 2, 2, 2),
        },
        linkTextField: {
            width: "100%",
        },
        anchorLink: {},
        toolbar: {},
        floatingToolbar: {
            position: "absolute",
            paddingTop: "6px",
            paddingBottom: "6px",
            "& button": {
                marginLeft: 4,
                marginRight: 4,
            },
            zIndex: 9999,
        },
        inlineToolbar: {
            maxWidth: "180px",
            position: "absolute",
            padding: "5px",
            zIndex: 10,
        },
    });
};
var blockRenderMap = Immutable.Map({
    blockquote: {
        element: "blockquote",
        wrapper: React__default.createElement(Blockquote$1, null),
    },
    "code-block": {
        element: "pre",
        wrapper: React__default.createElement(CodeBlock$1, null),
    },
});
var styleRenderMap = {
    STRIKETHROUGH: {
        textDecoration: "line-through",
    },
    HIGHLIGHT: {
        backgroundColor: "yellow",
    },
};
var hasCommandModifier = draftJs.KeyBindingUtil.hasCommandModifier;
var autocompleteMinSearchCharCount = 2;
var lineHeight = 26;
var defaultInlineToolbarControls = ["bold", "italic", "underline", "clear"];
var findLinkEntities = function (contentBlock, callback, contentState) {
    contentBlock.findEntityRanges(function (character) {
        var entityKey = character.getEntity();
        return (entityKey !== null &&
            contentState.getEntity(entityKey).getType() === "LINK");
    }, callback);
};
// const findMentionEntities = (
//   contentBlock: any,
//   callback: any,
//   contentState: any
// ) => {
//   console.log(JSON.stringify(contentBlock));
//   console.log(JSON.stringify(contentState));
//   console.log(callback);
//   contentBlock.findEntityRanges((character: any) => {
//     const entityKey = character.getEntity();
//     return (
//       entityKey !== null &&
//       contentState.getEntity(entityKey).getType() === "LINK"
//     );
//   }, callback);
//   contentBlock.findEntityRanges((character: any) => {
//     const entityKey = character.getEntity();
//     return (
//       entityKey !== null &&
//       contentState.getEntity(entityKey).getType() === "AC_ITEM"
//     );
//   }, callback);
//   findDecoWithRegex(/\@[\w ]+\@/g, contentBlock, callback);
// };
var findDecoWithRegex = function (regex, contentBlock, callback) {
    var text = contentBlock.getText();
    var matchArr, start;
    while ((matchArr = regex.exec(text)) !== null) {
        start = matchArr.index;
        callback(start, start + matchArr[0].length);
    }
};
var findDecoWithNameFromAutoComplete = function (name, contentBlock, callback, contentState) {
    contentBlock.findEntityRanges(function (character) {
        var entityKey = character.getEntity();
        return (entityKey !== null && contentState.getEntity(entityKey).getType() === name);
    }, callback);
};
var useEditorState = function (props) {
    var decorators = [
        {
            strategy: findLinkEntities,
            component: Link,
        },
    ];
    if (props.decorators) {
        props.decorators.forEach(function (deco) {
            return decorators.push({
                strategy: deco.name
                    ? function (contentBlock, callback, contentState) {
                        findDecoWithNameFromAutoComplete(deco.name, contentBlock, callback, contentState);
                    }
                    : function (contentBlock, callback) {
                        findDecoWithRegex(deco.regex, contentBlock, callback);
                    },
                component: deco.component,
            });
        });
    }
    var decorator = new draftJs.CompositeDecorator(decorators);
    var defaultValue;
    if (props.defaultValueHtml) {
        var contentHTML = draftJs.convertFromHTML(props.defaultValueHtml);
        var state = draftJs.ContentState.createFromBlockArray(contentHTML.contentBlocks, contentHTML.entityMap);
        defaultValue = JSON.stringify(draftJs.convertToRaw(state));
    }
    else {
        defaultValue = props.defaultValue || props.value;
    }
    return defaultValue
        ? draftJs.EditorState.createWithContent(draftJs.convertFromRaw(JSON.parse(defaultValue)), decorator)
        : draftJs.EditorState.createEmpty(decorator);
};
var MUIRichTextEditor = function (props, ref) {
    var _a, _b, _c;
    var classes = props.classes, controls = props.controls, customControls = props.customControls;
    var _d = React.useState({}), state = _d[0], setState = _d[1];
    var _f = React.useState(false), focus = _f[0], setFocus = _f[1];
    var _g = React.useState(""), searchTerm = _g[0], setSearchTerm = _g[1];
    var _h = React.useState(0), selectedIndex = _h[0], setSelectedIndex = _h[1];
    var _j = React.useState(function () { return useEditorState(props); }), editorState = _j[0], setEditorState = _j[1];
    var _k = React.useState(""), focusMediaKey = _k[0], setFocusMediaKey = _k[1];
    var editorRef = React.useRef(null);
    var editorId = props.id || "mui-rte";
    var toolbarPositionRef = React.useRef(undefined);
    var editorStateRef = React.useRef(editorState);
    var autocompleteRef = React.useRef(undefined);
    var autocompleteSelectionStateRef = React.useRef(undefined);
    var autocompletePositionRef = React.useRef(undefined);
    var autocompleteLimit = props.autocomplete
        ? props.autocomplete.suggestLimit || 5
        : 5;
    var isFirstFocus = React.useRef(true);
    var customBlockMapRef = React.useRef(undefined);
    var customStyleMapRef = React.useRef(undefined);
    var isFocusedWithMouse = React.useRef(false);
    var selectionRef = React.useRef({
        start: 0,
        end: 0,
    });
    /**
     * Exposed methods
     */
    React.useImperativeHandle(ref, function () { return ({
        focus: function () {
            handleFocus();
        },
        save: function () {
            handleSave();
        },
        saveHtml: function (options) {
            handleSaveHtml(options);
        },
        insertAtomicBlock: function (name, data) {
            handleInsertAtomicBlockSync(name, data);
        },
        insertAtomicBlockSync: function (name, data) {
            handleInsertAtomicBlockSync(name, data);
        },
        insertAtomicBlockAsync: function (name, promise, placeholder) {
            handleInsertAtomicBlockAsync(name, promise, placeholder);
        },
    }); });
    React.useEffect(function () {
        var editorState = useEditorState(props);
        setEditorState(editorState);
        toggleMouseUpListener(true);
        return function () {
            toggleMouseUpListener();
        };
    }, [props.value, props.defaultValue]);
    React.useEffect(function () {
        if (props.onChange) {
            props.onChange(editorState);
        }
        editorStateRef.current = editorState;
    }, [editorState]);
    React.useEffect(function () {
        toolbarPositionRef.current = state.toolbarPosition;
    }, [state.toolbarPosition]);
    React.useEffect(function () {
        if (searchTerm.length < autocompleteMinSearchCharCount) {
            setSelectedIndex(0);
        }
    }, [searchTerm]);
    var clearSearch = function () {
        setSearchTerm("");
        autocompletePositionRef.current = undefined;
        autocompleteSelectionStateRef.current = undefined;
    };
    var handleMouseUp = function (event) {
        var nodeName = event.target.nodeName;
        clearSearch();
        if (nodeName === "IMG" || nodeName === "VIDEO") {
            return;
        }
        setTimeout(function () {
            var _a;
            var selection = editorStateRef.current.getSelection();
            if (selection.isCollapsed() ||
                (toolbarPositionRef !== undefined &&
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
                end: selection.getEndOffset(),
            };
            var editor = (_a = editorRef.current) === null || _a === void 0 ? void 0 : _a.editor;
            if (!editor) {
                return;
            }
            var _b = getEditorBounds(editor), editorRect = _b.editorRect, selectionRect = _b.selectionRect;
            if (!selectionRect) {
                return;
            }
            var position = {
                top: editor.offsetTop - 48 + (selectionRect.top - editorRect.top),
                left: editor.offsetLeft + (selectionRect.left - editorRect.left),
            };
            setState(__assign(__assign({}, state), { toolbarPosition: position }));
        }, 1);
    };
    var findAutocompleteStrategy = function (chars) {
        if (!props.autocomplete) {
            return undefined;
        }
        var acArray = props.autocomplete.strategies.filter(function (ac) { return ac.triggerChar === chars; });
        if (acArray.length) {
            return acArray[0];
        }
        return undefined;
    };
    var updateAutocompletePosition = function () {
        var _a;
        var editor = (_a = editorRef.current) === null || _a === void 0 ? void 0 : _a.editor;
        if (!editor) {
            return;
        }
        var _b = getEditorBounds(editor), editorRect = _b.editorRect, selectionRect = _b.selectionRect;
        var line = getLineNumber(editorState);
        var top = selectionRect
            ? selectionRect.top
            : editorRect.top + lineHeight * line;
        var left = selectionRect ? selectionRect.left : editorRect.left;
        var position = {
            top: editor.offsetTop + (top - editorRect.top) + lineHeight,
            left: editor.offsetLeft + (left - editorRect.left),
        };
        if (!autocompleteSelectionStateRef.current) {
            autocompleteSelectionStateRef.current = editorStateRef.current.getSelection();
        }
        autocompletePositionRef.current = position;
    };
    var insertAutocompleteSuggestionAsAtomicBlock = function (name, selection, value) {
        var block = atomicBlockExists(name, props.customControls);
        if (!block) {
            return;
        }
        var contentState = draftJs.Modifier.removeRange(editorStateRef.current.getCurrentContent(), selection, "forward");
        var newEditorState = draftJs.EditorState.push(editorStateRef.current, contentState, "remove-range");
        // console.log(value);
        var withAtomicBlock = insertAtomicBlock(newEditorState, name.toUpperCase(), {
            value: value,
        }, {
            selection: newEditorState.getCurrentContent().getSelectionAfter(),
        });
        handleChange(withAtomicBlock);
    };
    var insertAutocompleteSuggestionAsText = function (selection, value) {
        var currentContentState = editorState.getCurrentContent();
        var entityKey = currentContentState
            .createEntity("AC_ITEM", "IMMUTABLE")
            .getLastCreatedEntityKey();
        var contentState = draftJs.Modifier.replaceText(editorStateRef.current.getCurrentContent(), selection, value, editorStateRef.current.getCurrentInlineStyle(), entityKey);
        var newEditorState = draftJs.EditorState.push(editorStateRef.current, contentState, "insert-characters");
        if (autocompleteRef.current.insertSpaceAfter === false) {
            handleChange(newEditorState);
        }
        else {
            var addSpaceState = draftJs.Modifier.insertText(newEditorState.getCurrentContent(), newEditorState.getSelection(), " ", newEditorState.getCurrentInlineStyle());
            handleChange(draftJs.EditorState.push(newEditorState, addSpaceState, "insert-characters"));
        }
    };
    var insertAutocompleteSuggestionUsingDecorator = function (name, selection, item) {
        //console.log(name, selection, item);
        var currentContentState = editorState.getCurrentContent();
        var entityKey = currentContentState
            .createEntity(name, "IMMUTABLE", item.data)
            .getLastCreatedEntityKey();
        var contentState = draftJs.Modifier.replaceText(editorStateRef.current.getCurrentContent(), selection, item.value, editorStateRef.current.getCurrentInlineStyle(), entityKey);
        var newEditorState = draftJs.EditorState.push(editorStateRef.current, contentState, "insert-characters");
        if (autocompleteRef.current.insertSpaceAfter === false) {
            handleChange(newEditorState);
        }
        else {
            var addSpaceState = draftJs.Modifier.insertText(newEditorState.getCurrentContent(), newEditorState.getSelection(), " ", newEditorState.getCurrentInlineStyle());
            handleChange(draftJs.EditorState.push(newEditorState, addSpaceState, "insert-characters"));
        }
    };
    var handleAutocompleteSelected = function (index) {
        var itemIndex = index || selectedIndex;
        var items = getAutocompleteItems();
        if (items.length > itemIndex) {
            var item = items[itemIndex];
            var currentSelection = autocompleteSelectionStateRef.current;
            var offset = currentSelection.getFocusOffset() + searchTerm.length + 1;
            var newSelection = currentSelection.merge({
                focusOffset: offset,
            });
            if (autocompleteRef.current.atomicBlockName) {
                var name = autocompleteRef.current.atomicBlockName;
                insertAutocompleteSuggestionAsAtomicBlock(name, newSelection, item.value);
            }
            else if (autocompleteRef.current.decoratorName) {
                insertAutocompleteSuggestionUsingDecorator(autocompleteRef.current.decoratorName, newSelection, item // send the entire item, so it's data can also be set in the entity
                );
            }
            else {
                insertAutocompleteSuggestionAsText(newSelection, item.value);
            }
        }
        handleAutocompleteClosed();
    };
    var handleAutocompleteClosed = function () {
        clearSearch();
        setSelectedIndex(0);
        refocus();
    };
    var getAutocompleteItems = function () {
        if (searchTerm.length < autocompleteMinSearchCharCount) {
            return [];
        }
        return autocompleteRef
            .current.items.filter(function (item) { return item.keys.filter(function (key) { return key.includes(searchTerm); }).length > 0; })
            .splice(0, autocompleteLimit);
    };
    var handleChange = function (state) {
        setEditorState(state);
    };
    var handleBeforeInput = function (chars, editorState) {
        if (chars === " " && searchTerm.length) {
            clearSearch();
        }
        else if (autocompleteSelectionStateRef.current) {
            setSearchTerm(searchTerm + chars);
        }
        else {
            var strategy = findAutocompleteStrategy(chars);
            if (strategy) {
                autocompleteRef.current = strategy;
                updateAutocompletePosition();
            }
        }
        return isMaxLengthHandled(editorState, 1);
    };
    var handleEditorFocus = function () {
        handleFocus();
        if (isFocusedWithMouse.current === true) {
            isFocusedWithMouse.current = false;
            return;
        }
        var nextEditorState = draftJs.EditorState.forceSelection(editorState, editorState.getSelection());
        setTimeout(function () { return setEditorState(draftJs.EditorState.moveFocusToEnd(nextEditorState)); }, 0);
    };
    var handlePlaceholderFocus = function () {
        if (isFirstFocus.current === false) {
            focusEditor();
            return;
        }
        handleFocus();
        isFirstFocus.current = false;
    };
    var handleFocus = function () {
        focusEditor();
        if (props.onFocus) {
            props.onFocus();
        }
    };
    var focusEditor = function () {
        setFocus(true);
        setTimeout(function () { var _a; return (_a = editorRef.current) === null || _a === void 0 ? void 0 : _a.focus(); }, 0);
    };
    var handleBlur = function () {
        isFocusedWithMouse.current = false;
        setFocus(false);
        if (props.onBlur) {
            props.onBlur();
        }
        if (!state.anchorUrlPopover) {
            setState(__assign(__assign({}, state), { toolbarPosition: undefined }));
        }
    };
    var handleMouseDown = function () {
        isFocusedWithMouse.current = true;
    };
    var handleClearFormat = function () {
        if (customStyleMapRef.current === undefined) {
            return;
        }
        var withoutStyles = clearInlineStyles(editorState, customStyleMapRef.current);
        var selectionInfo = getSelectionInfo(editorState);
        var newEditorState = draftJs.EditorState.push(editorState, withoutStyles, "change-inline-style");
        setEditorState(draftJs.RichUtils.toggleBlockType(newEditorState, selectionInfo.blockType));
    };
    var handleSave = function () {
        if (props.onSave) {
            props.onSave(JSON.stringify(draftJs.convertToRaw(editorState.getCurrentContent())));
        }
    };
    var handleSaveHtml = function (options) {
        if (props.onSaveHtml) {
            props.onSaveHtml(draftJsExportHtml.stateToHTML(editorState.getCurrentContent(), options));
        }
    };
    var handleInsertAtomicBlockSync = function (name, data) {
        var block = atomicBlockExists(name, props.customControls);
        if (!block) {
            return;
        }
        var newEditorState = insertAtomicBlock(editorState, block.name.toUpperCase(), data, {
            selection: editorState.getCurrentContent().getSelectionAfter(),
        });
        updateStateForPopover(newEditorState);
    };
    var handleInsertAtomicBlockAsync = function (name, promise, placeholder) {
        var selection = insertAsyncAtomicBlockPlaceholder(name, placeholder);
        var offset = selection.getFocusOffset() + 1;
        var newSelection = selection.merge({
            focusOffset: offset,
        });
        promise
            .then(function (response) {
            var newEditorState = insertAtomicBlock(editorStateRef.current, name, response.data, {
                selection: newSelection,
            });
            handleChange(newEditorState);
        })
            .catch(function (error) {
            if (error) {
                return;
            }
            var newContentState = draftJs.Modifier.removeRange(editorStateRef.current.getCurrentContent(), newSelection, "forward");
            handleChange(draftJs.EditorState.push(editorStateRef.current, newContentState, "remove-range"));
        });
    };
    var insertAsyncAtomicBlockPlaceholder = function (name, placeholder) {
        var placeholderName = placeholder || name + "...";
        var currentContentState = editorStateRef.current.getCurrentContent();
        var entityKey = currentContentState
            .createEntity("ASYNC_ATOMICBLOCK", "IMMUTABLE")
            .getLastCreatedEntityKey();
        var contentState = draftJs.Modifier.insertText(editorStateRef.current.getCurrentContent(), currentContentState.getSelectionAfter(), placeholderName, undefined, entityKey);
        var selection = currentContentState.getSelectionAfter();
        var newEditorState = draftJs.EditorState.push(editorStateRef.current, contentState, "insert-characters");
        handleChange(newEditorState);
        return selection;
    };
    var handleKeyCommand = function (command, editorState) {
        var newState = draftJs.RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            handleChange(newState);
            return "handled";
        }
        else {
            if (command.includes("mui-autocomplete")) {
                if (command === "mui-autocomplete-insert") {
                    handleAutocompleteSelected();
                }
                if (command === "mui-autocomplete-end") {
                    handleAutocompleteClosed();
                }
                return "handled";
            }
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
                    setTimeout(function () { var _a; return (_a = editorRef.current) === null || _a === void 0 ? void 0 : _a.blur(); }, 0);
                    var newState = control.onClick(editorState, control.name, document.getElementById(id));
                    if (newState) {
                        if (newState.getSelection().isCollapsed()) {
                            setEditorState(newState);
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
        setEditorState(draftJs.EditorState.undo(editorState));
    };
    var handleRedo = function () {
        setEditorState(draftJs.EditorState.redo(editorState));
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
            toolbarPosition: !inlineMode ? undefined : state.toolbarPosition,
            anchorUrlPopover: !inlineMode
                ? document.getElementById(editorId + "-" + type + "-control-button")
                : document.getElementById(editorId + "-" + type + "-control-button-toolbar"),
            urlIsMedia: type === "media" ? true : undefined,
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
    var handlePastedText = function (text, _html, editorState) {
        return isMaxLengthHandled(editorState, text.length);
    };
    var handleReturn = function (_e, editorState) {
        return isMaxLengthHandled(editorState, 1);
    };
    var isMaxLengthHandled = function (editorState, nextLength) {
        var currentLength = editorState.getCurrentContent().getPlainText("")
            .length;
        return isGreaterThan(currentLength + nextLength, props.maxLength)
            ? "handled"
            : "not-handled";
    };
    var toggleMouseUpListener = function (addAfter) {
        var _a;
        if (addAfter === void 0) { addAfter = false; }
        var editor = (_a = editorRef.current) === null || _a === void 0 ? void 0 : _a.editor;
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
        setEditorState(draftJs.RichUtils.toggleLink(editorState, selection, null));
    };
    var confirmLink = function (url) {
        var urlKey = state.urlKey;
        if (!url) {
            if (urlKey) {
                removeLink();
            }
            dismissPopover();
            return;
        }
        var contentState = editorState.getCurrentContent();
        var replaceEditorState = editorState;
        var data = {
            url: url,
            className: classes.anchorLink,
        };
        if (urlKey) {
            contentState.replaceEntityData(urlKey, data);
            replaceEditorState = draftJs.EditorState.push(editorState, contentState, "apply-entity");
        }
        else {
            var contentStateWithEntity = contentState.createEntity("LINK", "MUTABLE", data);
            var entityKey = contentStateWithEntity.getLastCreatedEntityKey();
            var newEditorState = draftJs.EditorState.set(editorState, {
                currentContent: contentStateWithEntity,
            });
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
        setEditorState(newEditorState);
    };
    var confirmMedia = function (url, width, height, alignment, type) {
        var urlKey = state.urlKey;
        if (!url) {
            if (urlKey) {
                removeMedia();
            }
            dismissPopover();
            return;
        }
        var contentState = editorState.getCurrentContent();
        var data = {
            url: url,
            width: width,
            height: height,
            alignment: alignment,
            type: type,
        };
        if (urlKey) {
            contentState.replaceEntityData(urlKey, data);
            var newEditorState = draftJs.EditorState.push(editorState, contentState, "apply-entity");
            updateStateForPopover(draftJs.EditorState.forceSelection(newEditorState, newEditorState.getCurrentContent().getSelectionAfter()));
        }
        else {
            var newEditorState = insertAtomicBlock(editorState, "IMAGE", data);
            updateStateForPopover(draftJs.EditorState.forceSelection(newEditorState, newEditorState.getCurrentContent().getSelectionAfter()));
        }
        setFocusMediaKey("");
    };
    var updateStateForPopover = function (editorState) {
        setEditorState(editorState);
        dismissPopover();
    };
    var dismissPopover = function () {
        refocus();
        setState(__assign(__assign({}, state), { anchorUrlPopover: undefined, urlKey: undefined, urlIsMedia: undefined, urlData: undefined }));
    };
    var refocus = function () {
        setTimeout(function () { var _a; return (_a = editorRef.current) === null || _a === void 0 ? void 0 : _a.blur(); }, 0);
        setTimeout(function () { var _a; return (_a = editorRef.current) === null || _a === void 0 ? void 0 : _a.focus(); }, 1);
    };
    var toggleBlockType = function (blockType) {
        setEditorState(draftJs.RichUtils.toggleBlockType(editorState, blockType));
    };
    var toggleInlineStyle = function (inlineStyle) {
        setEditorState(draftJs.RichUtils.toggleInlineStyle(editorState, inlineStyle));
    };
    var focusMedia = function (block) {
        var newSeletion = draftJs.SelectionState.createEmpty(block.getKey());
        var newEditorState = draftJs.EditorState.forceSelection(editorStateRef.current, newSeletion);
        editorStateRef.current = newEditorState;
        setFocusMediaKey(block.getKey());
        setEditorState(newEditorState);
        handlePromptForMedia(false, newEditorState);
    };
    var getStyleMap = function () {
        if (customStyleMapRef.current === undefined) {
            setupStyleMap();
        }
        return customStyleMapRef.current;
    };
    var setupStyleMap = function () {
        var _a;
        var customStyleMap = JSON.parse(JSON.stringify(styleRenderMap));
        (_a = props.customControls) === null || _a === void 0 ? void 0 : _a.filter(function (control) { return control.type === "inline" && control.inlineStyle; }).forEach(function (control) {
            customStyleMap[control.name.toUpperCase()] = control.inlineStyle;
        });
        customStyleMapRef.current = customStyleMap;
    };
    var getBlockMap = function () {
        if (customBlockMapRef.current === undefined) {
            setupBlockMap();
        }
        return customBlockMapRef.current;
    };
    var setupBlockMap = function () {
        var _a;
        var customBlockMap = {};
        (_a = props.customControls) === null || _a === void 0 ? void 0 : _a.filter(function (control) { return control.type === "block" && control.blockWrapper; }).forEach(function (control) {
            customBlockMap[control.name.toUpperCase()] = {
                element: "div",
                wrapper: control.blockWrapper,
            };
        });
        customBlockMapRef.current = draftJs.DefaultDraftBlockRenderMap.merge(blockRenderMap, Immutable.Map(customBlockMap));
    };
    var blockRenderer = function (contentBlock) {
        var blockType = contentBlock.getType();
        if (blockType === "atomic") {
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
                            focusKey: focusMediaKey,
                        },
                    };
                }
                else {
                    var block = atomicBlockExists(type.toLowerCase(), props.customControls);
                    if (block) {
                        return {
                            component: block.atomicComponent,
                            editable: false,
                            props: contentState
                                .getEntity(contentBlock.getEntityAt(0))
                                .getData(),
                        };
                    }
                }
            }
        }
        return null;
    };
    var styleRenderer = function (style) {
        var customStyleMap = getStyleMap();
        var styleNames = style.toJS();
        return styleNames.reduce(function (styles, styleName) {
            styles = customStyleMap[styleName];
            return styles;
        }, {});
    };
    var insertAtomicBlock = function (editorState, type, data, options) {
        var contentState = editorState.getCurrentContent();
        var contentStateWithEntity = contentState.createEntity(type, "IMMUTABLE", data);
        var entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        var newEditorStateRaw = draftJs.EditorState.set(editorState, __assign({ currentContent: contentStateWithEntity }, options));
        return draftJs.AtomicBlockUtils.insertAtomicBlock(newEditorStateRaw, entityKey, " ");
    };
    var getAutocompleteKeyEvent = function (keyboardEvent) {
        var itemsLength = getAutocompleteItems().length;
        var limit = autocompleteLimit > itemsLength ? itemsLength : autocompleteLimit;
        switch (keyboardEvent.key) {
            case "ArrowDown":
                if ((selectedIndex === 0 && itemsLength === 1) ||
                    selectedIndex + 1 === limit) {
                    setSelectedIndex(0);
                }
                else {
                    setSelectedIndex(selectedIndex + 1 < limit ? selectedIndex + 1 : selectedIndex);
                }
                return "mui-autocomplete-navigate";
            case "ArrowUp":
                if (selectedIndex) {
                    setSelectedIndex(selectedIndex - 1);
                }
                else {
                    setSelectedIndex(limit - 1);
                }
                return "mui-autocomplete-navigate";
            case "Enter":
                return "mui-autocomplete-insert";
            case "Escape":
                return "mui-autocomplete-end";
            default:
                return null;
        }
    };
    var updateSearchTermForKeyBinding = function (keyBinding) {
        var text = editorStateRef
            .current.getCurrentContent()
            .getLastBlock()
            .getText();
        if (keyBinding === "backspace" &&
            autocompleteRef.current &&
            text.substr(text.length - 1) === autocompleteRef.current.triggerChar) {
            clearSearch();
        }
        else if (autocompletePositionRef.current &&
            keyBinding === "backspace" &&
            searchTerm.length) {
            setSearchTerm(searchTerm.substr(0, searchTerm.length - 1));
        }
        else if (!autocompletePositionRef.current &&
            (keyBinding === "backspace" || keyBinding === "split-block")) {
            clearSearch();
        }
    };
    var keyBindingFn = function (e) {
        if (hasCommandModifier(e) && props.keyCommands) {
            var comm = props.keyCommands.find(function (comm) { return comm.key === e.keyCode; });
            if (comm) {
                return comm.name;
            }
        }
        if (searchTerm) {
            var autocompleteEvent = getAutocompleteKeyEvent(e);
            if (autocompleteEvent) {
                return autocompleteEvent;
            }
        }
        var keyBinding = draftJs.getDefaultKeyBinding(e);
        updateSearchTermForKeyBinding(keyBinding);
        return keyBinding;
    };
    var renderToolbar = props.toolbar === undefined || props.toolbar;
    var inlineToolbarControls = props.inlineToolbarControls || defaultInlineToolbarControls;
    var editable = props.readOnly === undefined || !props.readOnly;
    var className = "";
    var placeholder = null;
    if (!focus) {
        var contentState = editorState.getCurrentContent();
        if (!contentState.hasText()) {
            placeholder = (React__default.createElement("div", { className: classNames(classes.editorContainer, classes.placeHolder, (_a = {},
                    _a[classes.error] = props.error,
                    _a)), tabIndex: 0, onFocus: handlePlaceholderFocus }, props.label || ""));
            className = classes.hidePlaceholder;
        }
    }
    return (React__default.createElement("div", { id: editorId + "-root", className: classes.root },
        React__default.createElement("div", { id: editorId + "-container", className: classNames(classes.container, (_b = {},
                _b[classes.inheritFontSize] = props.inheritFontSize,
                _b)) },
            props.autocomplete && autocompletePositionRef.current ? (React__default.createElement(Autocomplete$1, { items: getAutocompleteItems(), top: autocompletePositionRef.current.top, left: autocompletePositionRef.current.left, onClick: handleAutocompleteSelected, selectedIndex: selectedIndex })) : null,
            props.inlineToolbar && editable && state.toolbarPosition ? (React__default.createElement(Paper, { className: classes.inlineToolbar, style: {
                    top: state.toolbarPosition.top,
                    left: state.toolbarPosition.left,
                } },
                React__default.createElement(Toolbar, { id: editorId, editorState: editorState, onClick: handleToolbarClick, controls: inlineToolbarControls, customControls: customControls, inlineMode: true, isActive: true }))) : null,
            props.floatingToolbar &&
                props.floatingToolbarPosition &&
                props.floatingToolbarControls &&
                editable ? (React__default.createElement(Paper, { className: classes.floatingToolbar, style: props.floatingToolbarPosition },
                React__default.createElement(Toolbar, { id: editorId, editorState: editorState, onClick: handleToolbarClick, controls: props.floatingToolbarControls, customControls: customControls, 
                    // className={classes.floatingToolbar}
                    size: props.toolbarButtonSize, 
                    // inlineMode={true}
                    isActive: true }))) : null,
            renderToolbar ? (React__default.createElement(Toolbar, { id: editorId, editorState: editorState, onClick: handleToolbarClick, controls: controls, customControls: customControls, className: classes.toolbar, disabled: !editable, size: props.toolbarButtonSize, isActive: focus })) : null,
            placeholder,
            React__default.createElement("div", { id: editorId + "-editor", className: classes.editor },
                React__default.createElement("div", { id: editorId + "-editor-container", className: classNames(className, classes.editorContainer, (_c = {},
                        _c[classes.editorReadOnly] = !editable,
                        _c[classes.error] = props.error,
                        _c)), onMouseDown: handleMouseDown, onBlur: handleBlur },
                    React__default.createElement(draftJs.Editor, __assign({ blockRenderMap: getBlockMap(), blockRendererFn: blockRenderer, customStyleFn: styleRenderer, editorState: editorState, onChange: handleChange, onFocus: handleEditorFocus, readOnly: props.readOnly, handleKeyCommand: handleKeyCommand, handleBeforeInput: handleBeforeInput, handlePastedText: handlePastedText, handleReturn: handleReturn, keyBindingFn: keyBindingFn, ref: editorRef }, props.draftEditorProps)))),
            state.anchorUrlPopover ? (React__default.createElement(UrlPopover$1, { data: state.urlData, anchor: state.anchorUrlPopover, onConfirm: handleConfirmPrompt, isMedia: state.urlIsMedia })) : null)));
};
var MUIRichTextEditor$1 = styles$6.withStyles(styles$5, {
    withTheme: true,
    name: "MUIRichTextEditor",
})(React.forwardRef(MUIRichTextEditor));
//# sourceMappingURL=MUIRichTextEditor.js.map

exports.default = MUIRichTextEditor$1;
//# sourceMappingURL=index.js.map
