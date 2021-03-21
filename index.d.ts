import React, { FunctionComponent } from 'react';
import { WithStyles, Theme } from '@material-ui/core/styles';
import { EditorState, DraftHandleValue, SelectionState } from 'draft-js';

// Autocomplete

export declare type TAutocompleteItem = {
    keys: string[];
    value: any;
    content: string | JSX.Element;
};
interface TAutocompleteProps extends WithStyles<typeof AutocompleteStyles> {
    items: TAutocompleteItem[];
    top: number;
    left: number;
    selectedIndex: number;
    onClick: (selectedIndex: number) => void;
}
declare const AutocompleteStyles: () => Record<"container" | "item", import("@material-ui/styles").CSSProperties | import("@material-ui/styles").CreateCSSProperties<{}> | import("@material-ui/styles").PropsFunc<{}, import("@material-ui/styles").CreateCSSProperties<{}>>>;
export declare const Autocomplete: React.ComponentType<Pick<React.PropsWithChildren<TAutocompleteProps>, "left" | "top" | "children" | "onClick" | "items" | "selectedIndex"> & import("@material-ui/core/styles").StyledComponentProps<"container" | "item">>;

// ToolbarButton

interface IToolbarButtonProps {
    id?: string;
    editorId?: string;
    label: string;
    style: string;
    type: string;
    active?: boolean;
    icon?: JSX.Element;
    onClick?: any;
    inlineMode?: boolean;
    disabled?: boolean;
    size?: TToolbarButtonSize;
    component?: FunctionComponent<TToolbarComponentProps>;
}
export declare const ToolbarButton: FunctionComponent<IToolbarButtonProps>;

// Toolbar

export declare type TToolbarControl = "title" | "bold" | "italic" | "underline" | "link" | "numberList" | "bulletList" | "quote" | "code" | "clear" | "save" | "media" | "strikethrough" | "highlight" | string;
export declare type TControlType = "inline" | "block" | "callback" | "atomic";
export declare type TToolbarButtonSize = "small" | "medium";
export declare type TToolbarComponentProps = {
    id: string;
    onMouseDown: (e: React.MouseEvent) => void;
    active: boolean;
    disabled: boolean;
};
export declare type TCustomControl = {
    id?: string;
    name: string;
    icon?: JSX.Element;
    type: TControlType;
    component?: FunctionComponent<TToolbarComponentProps>;
    inlineStyle?: React.CSSProperties;
    blockWrapper?: React.ReactElement;
    atomicComponent?: FunctionComponent;
    onClick?: (editorState: EditorState, name: string, anchor: HTMLElement | null) => EditorState | void;
};
declare type TToolbarProps = {
    id: string;
    editorState: EditorState;
    controls?: Array<TToolbarControl>;
    customControls?: TCustomControl[];
    onClick: (style: string, type: string, id: string, inlineMode?: boolean) => void;
    inlineMode?: boolean;
    className?: string;
    disabled?: boolean;
    size?: TToolbarButtonSize;
    isActive: boolean;
};
export declare const Toolbar: FunctionComponent<TToolbarProps>;

// MUIRichTextEditor

export declare type TDecorator = {
    component: FunctionComponent;
    regex: RegExp;
};
export declare type TAutocompleteStrategy = {
    triggerChar: string;
    items: TAutocompleteItem[];
    insertSpaceAfter?: boolean;
    atomicBlockName?: string;
};
export declare type TAutocomplete = {
    strategies: TAutocompleteStrategy[];
    suggestLimit?: number;
};
export declare type TAsyncAtomicBlockResponse = {
    data: any;
};
export declare type TMUIRichTextEditorRef = {
    focus: () => void;
    save: () => void;
    /**
     * @deprecated Use `insertAtomicBlockSync` instead.
     */
    insertAtomicBlock: (name: string, data: any) => void;
    insertAtomicBlockSync: (name: string, data: any) => void;
    insertAtomicBlockAsync: (name: string, promise: Promise<TAsyncAtomicBlockResponse>, placeholder?: string) => void;
};
export declare type TDraftEditorProps = {
    spellCheck?: boolean;
    stripPastedStyles?: boolean;
    handleDroppedFiles?: (selectionState: SelectionState, files: Blob[]) => DraftHandleValue;
};
export declare type TKeyCommand = {
    key: number;
    name: string;
    callback: (state: EditorState) => EditorState;
};
export declare type TMUIRichTextEditorProps = {
    id?: string;
    /**
     * @deprecated Use `defaultValue` instead.
     */
    value?: any;
    defaultValue?: any;
    label?: string;
    readOnly?: boolean;
    inheritFontSize?: boolean;
    error?: boolean;
    controls?: Array<TToolbarControl>;
    customControls?: TCustomControl[];
    decorators?: TDecorator[];
    toolbar?: boolean;
    toolbarButtonSize?: TToolbarButtonSize;
    inlineToolbar?: boolean;
    inlineToolbarControls?: Array<TToolbarControl>;
    draftEditorProps?: TDraftEditorProps;
    keyCommands?: TKeyCommand[];
    maxLength?: number;
    autocomplete?: TAutocomplete;
    onSave?: (data: string) => void;
    onChange?: (state: EditorState) => void;
    onFocus?: () => void;
    onBlur?: () => void;
};
interface IMUIRichTextEditorProps extends TMUIRichTextEditorProps, WithStyles<typeof MUIRichTextEditorStyles> {
}
declare const MUIRichTextEditorStyles: ({ spacing, typography, palette }: Theme) => Record<"error" | "toolbar" | "root" | "container" | "linkPopover" | "linkTextField" | "inheritFontSize" | "editor" | "editorContainer" | "editorReadOnly" | "hidePlaceholder" | "placeHolder" | "anchorLink" | "inlineToolbar", import("@material-ui/styles").CSSProperties | import("@material-ui/styles").CreateCSSProperties<{}> | import("@material-ui/styles").PropsFunc<{}, import("@material-ui/styles").CreateCSSProperties<{}>>>;
declare const MUIRichTextEditor: React.ComponentType<Pick<IMUIRichTextEditorProps & React.RefAttributes<TMUIRichTextEditorRef>, "error" | "label" | "toolbar" | "ref" | "key" | "defaultValue" | "id" | "onFocus" | "onBlur" | "onChange" | "value" | "readOnly" | "maxLength" | "controls" | "inheritFontSize" | "inlineToolbar" | "customControls" | "decorators" | "toolbarButtonSize" | "inlineToolbarControls" | "draftEditorProps" | "keyCommands" | "autocomplete" | "onSave"> & import("@material-ui/core/styles").StyledComponentProps<"error" | "toolbar" | "root" | "container" | "linkPopover" | "linkTextField" | "inheritFontSize" | "editor" | "editorContainer" | "editorReadOnly" | "hidePlaceholder" | "placeHolder" | "anchorLink" | "inlineToolbar">>;
export default MUIRichTextEditor;
