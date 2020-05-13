import React from 'react'
import { convertFromHTML, ContentState, convertToRaw } from 'draft-js'
import MUIRichTextEditor from '../../'

const sampleMarkup = '<b>Bold text</b>, <i>Italic text</i><br/ ><br />Other text<br /><br /><a href="http://myurl.com">Some link</a>'
const contentHTML = convertFromHTML(sampleMarkup)
const state = ContentState.createFromBlockArray(contentHTML.contentBlocks, contentHTML.entityMap)
const content = JSON.stringify(convertToRaw(state))

const save = (data: string) => {
    console.log(data)
}

const LoadHTML = () => {
    return (
        <MUIRichTextEditor 
            defaultValue={content} 
            onSave={save}
        />
    )
}

export default LoadHTML