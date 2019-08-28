import React from 'react'
import { mount } from 'enzyme'
import { spy } from 'sinon'
import { assert, expect } from 'chai'
import { Editor, convertFromRaw } from 'draft-js'
import MUIRichTextEditor from '../src/MUIRichTextEditor'
import EditorControls from '../src/components/EditorControls'
import EditorButton from '../src/components/EditorButton'

describe('<MUIRichTextEditor />', () => {

    it('should render controls and editor', () => {
        const wrapper = mount(<MUIRichTextEditor />)
        const editorControls = wrapper.find(EditorControls)
        const editor = wrapper.find(Editor)

        assert.strictEqual(editorControls.length, 1)
        assert.strictEqual(editor.length, 1)
    })

    it('should render editor only', () => {
        const wrapper = mount(<MUIRichTextEditor readOnly={true} />)
        const editorControls = wrapper.find(EditorControls)
        const editor = wrapper.find(Editor)

        assert.strictEqual(editorControls.length, 0)
        assert.strictEqual(editor.length, 1)
    })

    it('should load content', () => {
        const expected = '{"blocks":[{"key":"4a8q0","text":"bold text and normal","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":9,"style":"BOLD"}],"entityRanges":[],"data":{}}],"entityMap":{}}'
        const wrapper = mount(<MUIRichTextEditor value={expected} />)
        const editor = wrapper.find(Editor)
        expect(editor.prop("editorState").getCurrentContent()).to.deep.equal(convertFromRaw(JSON.parse(expected)))
    })

    it('should call save', () => {
        const saveSpy = spy()
        const component = <MUIRichTextEditor onSave={saveSpy} />
        const wrapper = mount(component)
        const saveButton = wrapper.find(EditorButton).filterWhere((button: any) => {
            return button.prop("label") === "Save"
        })
        assert.strictEqual(saveButton.length, 1)
        saveButton.first().simulate("mousedown")
        assert.isTrue(saveSpy.called)
    })
})