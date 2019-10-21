import React from 'react'
import { mount } from 'enzyme'
import { assert, expect } from 'chai'
import { EditorState } from 'draft-js'
import EditorControls, { TEditorControl } from '../src/components/EditorControls'
import EditorButton from '../src/components/EditorButton'

describe('<EditorControls />', () => {
    let editorState: EditorState

    before(() => {
        editorState = EditorState.createEmpty()
    })

    it('should render all controls', () => {
        const wrapper = mount(
            <EditorControls
                editorState={editorState}
                onClick={() => {}}
            />
        )
        const result = wrapper.find(EditorButton)
        assert.strictEqual(result.length, 16)
    })

    it('should render controls in order', () => {
        const controls: TEditorControl[] = [
            "save",
            "code",
            "underline"
        ]
        const expected = [
            "Save",
            "Code Block",
            "Underline"
        ]
        const wrapper = mount(
            <EditorControls
                editorState={editorState}
                controls={controls}
                onClick={() => {}}
            />
        )
        const result = wrapper.find(EditorButton).map(item => {
            return item.prop("label")
        })
        expect(result).to.have.ordered.members(expected)
    })

    it('should not render controls', () => {
        const wrapper = mount(
            <EditorControls
                editorState={editorState}
                controls={[]}
                onClick={() => {}}
            />
        )
        const result = wrapper.find(EditorButton)
        assert.strictEqual(result.length, 0)
    })
})