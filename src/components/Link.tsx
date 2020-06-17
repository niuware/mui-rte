import React, { FunctionComponent } from 'react'
import { ContentState } from 'draft-js'

type TLinkProps = {
    children?: React.ReactNode
    contentState: ContentState
    entityKey: string
}

const Link: FunctionComponent<TLinkProps> = (props) => {
    const { url, className } = props.contentState.getEntity(props.entityKey).getData()
    return (
        <a 
            href={url} 
            className={`${className} editor-anchor`}
            target="_blank"
        >
            {props.children}
        </a>
    )
}

export default Link