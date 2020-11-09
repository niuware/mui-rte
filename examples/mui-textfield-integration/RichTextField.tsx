import React, { Ref, useRef, useImperativeHandle, useCallback, useEffect, useState } from 'react'
import TextField, { TextFieldProps } from '@material-ui/core/TextField'
import { InputBaseComponentProps } from '@material-ui/core/InputBase'
import { EditorState } from 'draft-js'
import MUIRichTextEditor from '../../'
import { TMUIRichTextEditorRef } from '../../src/MUIRichTextEditor'
import { TToolbarControl } from '../../src/components/Toolbar'

export interface RichTextInputProps extends Omit<InputBaseComponentProps, 'value'> {
    inputRef?: Ref<unknown>
    doFocus?: boolean
    onStateChange?: (state: EditorState) => void
    controls?: Array<TToolbarControl>
}

export const RichTextInput = ({
    inputRef,
    doFocus,
    onStateChange,
    controls,
    ...richTextProps
}: RichTextInputProps) => {
    const acquireFocus = doFocus ?? false

    // Setup ref for the rich text editor
    const richTextRef = useRef<TMUIRichTextEditorRef>(null)

    // Attempts to focus the rich text editor reference
    const focusRichText = useCallback(() => richTextRef.current?.focus(), [richTextRef])

    // Pass on the focus event of the input ref to the rich text ref
    useImperativeHandle(inputRef, () => ({ focus: () => focusRichText }))

    // If the `acquireFocus` is changed and its value is `true`, focus the editor
    useEffect(() => {
        if (acquireFocus) {
            focusRichText()
        }
    }, [acquireFocus, focusRichText])

    return (
        <MUIRichTextEditor
            {...richTextProps}
            ref={richTextRef}
            onChange={onStateChange}
            controls={controls}
        />
    )
}

export interface RichTextFieldProps extends Omit<TextFieldProps, 'value' | 'onChange'> {
    onChange?: (state: EditorState) => void
}

const RichTextField = ({
    id,
    placeholder,
    defaultValue,
    onChange,
    InputLabelProps,
    variant,
    ...textFieldProps
}: RichTextFieldProps) => {
    // Manually handle the TextField's focused state based on the editor's focused state
    const [isFocused, setIsFocused] = useState(false)

    const inputProps: RichTextInputProps = {
        id: id,
        defaultValue: defaultValue,
        label: placeholder,
        inlineToolbar: true,
        onStateChange: onChange,
        doFocus: isFocused,
        onFocus: () => setIsFocused(true),
        onBlur: () => setIsFocused(false),
    }

    return (
        <TextField
            {...textFieldProps}
            id={id}
            variant={variant} // Required to compile due to TextFieldProps variant incompatibility
            focused={isFocused}
            onClick={() => setIsFocused(true)}
            InputLabelProps={{ ...InputLabelProps, shrink: true }}
            InputProps={{ inputComponent: RichTextInput, inputProps: inputProps }}
        />
    )
}

export default RichTextField
