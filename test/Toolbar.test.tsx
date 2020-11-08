import React from 'react'
import { mount } from 'enzyme'
import { assert, expect } from 'chai'
import { EditorState } from 'draft-js'
import Toolbar, { TToolbarControl } from '../src/components/Toolbar'
import EditorButton from '../src/components/ToolbarButton'

describe('<EditorControls />', () => {
    let editorState: EditorState

    before(() => {
        editorState = EditorState.createEmpty()
    })

    it('should render all controls', () => {
        const wrapper = mount(
            <Toolbar
                id="mui-rte"
                editorState={editorState}
                onClick={() => {}}
                isActive={true}
            />
        )
        const result = wrapper.find(EditorButton)
        assert.strictEqual(result.length, 16)
    })

    it('should render controls in order', () => {
        const controls: TToolbarControl[] = [
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
            <Toolbar
                id="mui-rte"
                editorState={editorState}
                controls={controls}
                onClick={() => {}}
                isActive={true}
            />
        )
        const result = wrapper.find(EditorButton).map(item => {
            return item.prop("label")
        })
        expect(result).to.have.ordered.members(expected)
    })

    it('should not render controls', () => {
        const wrapper = mount(
            <Toolbar
                id="mui-rte"
                editorState={editorState}
                controls={[]}
                onClick={() => {}}
                isActive={true}
            />
        )
        const result = wrapper.find(EditorButton)
        assert.strictEqual(result.length, 0)
    })
})