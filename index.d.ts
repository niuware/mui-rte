import React, { FunctionComponent } from 'react';
import { WithStyles, StyleRules, CSSProperties, CreateCSSProperties, PropsFunc } from '@mui/styles';
import { Theme } from '@mui/material/styles';
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
declare const AutocompleteStyles: () => Record<"container" | "item", import("@mui/styles").CSSProperties | import("@mui/styles").CreateCSSProperties<{}> | import("@mui/styles").PropsFunc<{}, import("@mui/styles").CreateCSSProperties<{}>>>;
export declare const Autocomplete: React.ComponentType<Pick<React.PropsWithChildren<TAutocompleteProps>, "left" | "top" | "children" | "onClick" | "items" | "selectedIndex"> & import("@mui/material/styles").StyledComponentProps<"container" | "item">>;

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
export interface TMUIRichTextEditorStyles {
    overrides?: {
        MUIRichTextEditor?: {
            root?: CSSProperties | CreateCSSProperties<{}> | PropsFunc<{}, CreateCSSProperties<{}>>;
            container?: CSSProperties | CreateCSSProperties<{}> | PropsFunc<{}, CreateCSSProperties<{}>>;
            inheritFontSize?: CSSProperties | CreateCSSProperties<{}> | PropsFunc<{}, CreateCSSProperties<{}>>;
            editor?: CSSProperties | CreateCSSProperties<{}> | PropsFunc<{}, CreateCSSProperties<{}>>;
            editorContainer?: CSSProperties | CreateCSSProperties<{}> | PropsFunc<{}, CreateCSSProperties<{}>>;
            editorReadOnly?: CSSProperties | CreateCSSProperties<{}> | PropsFunc<{}, CreateCSSProperties<{}>>;
            error?: CSSProperties | CreateCSSProperties<{}> | PropsFunc<{}, CreateCSSProperties<{}>>;
            hidePlaceholder?: CSSProperties | CreateCSSProperties<{}> | PropsFunc<{}, CreateCSSProperties<{}>>;
            placeHolder?: CSSProperties | CreateCSSProperties<{}> | PropsFunc<{}, CreateCSSProperties<{}>>;
            linkPopover?: CSSProperties | CreateCSSProperties<{}> | PropsFunc<{}, CreateCSSProperties<{}>>;
            linkTextField?: CSSProperties | CreateCSSProperties<{}> | PropsFunc<{}, CreateCSSProperties<{}>>;
            anchorLink?: CSSProperties | CreateCSSProperties<{}> | PropsFunc<{}, CreateCSSProperties<{}>>;
            toolbar?: CSSProperties | CreateCSSProperties<{}> | PropsFunc<{}, CreateCSSProperties<{}>>;
            inlineToolbar?: CSSProperties | CreateCSSProperties<{}> | PropsFunc<{}, CreateCSSProperties<{}>>;
        };
    };
}
declare const MUIRichTextEditorStyles: (theme: Theme & TMUIRichTextEditorStyles) => StyleRules<{}, "error" | "toolbar" | "root" | "container" | "inheritFontSize" | "editor" | "editorContainer" | "editorReadOnly" | "hidePlaceholder" | "placeHolder" | "linkPopover" | "linkTextField" | "anchorLink" | "inlineToolbar">;
declare const MUIRichTextEditor: import("react").JSXElementConstructor<Omit<IMUIRichTextEditorProps & import("react").RefAttributes<TMUIRichTextEditorRef>, "classes" | "theme"> & import("@mui/styles").StyledComponentProps<"error" | "toolbar" | "root" | "container" | "inheritFontSize" | "editor" | "editorContainer" | "editorReadOnly" | "hidePlaceholder" | "placeHolder" | "linkPopover" | "linkTextField" | "anchorLink" | "inlineToolbar">>;
export default MUIRichTextEditor;
