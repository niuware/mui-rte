import React from 'react'
import MUIRichTextEditor from '../../'

const content = '{"blocks":[{"key":"7po5","text":"My Title","type":"header-two","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"apv19","text":"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi:","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":6,"length":5,"style":"BOLD"},{"offset":192,"length":16,"style":"UNDERLINE"},{"offset":261,"length":21,"style":"ITALIC"}],"entityRanges":[],"data":{}},{"key":"5sea5","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"57hbe","text":"Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet.","type":"blockquote","depth":0,"inlineStyleRanges":[{"offset":34,"length":17,"style":"BOLD"}],"entityRanges":[],"data":{}},{"key":"9ijl2","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"98bf8","text":"print(\\"OK\\")","type":"code-block","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"al2ij","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"d4no","text":"Visit this link!","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[{"offset":6,"length":9,"key":0}],"data":{}}],"entityMap":{"0":{"type":"LINK","mutability":"MUTABLE","data":{"url":"https://github.com/niuware"}}}}'

const ReadOnly = () => {
    return (
        <MUIRichTextEditor
            defaultValue={content}
            readOnly={true}
        />
    )
}

export default ReadOnly
