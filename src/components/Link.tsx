import React, { FunctionComponent } from 'react'
import { ContentState } from 'draft-js'

interface ILinkProps {
    children?: React.ReactNode
    contentState: ContentState
    entityKey: string
}

const Link: FunctionComponent<ILinkProps> = (props: ILinkProps) => {
    const { url } = props.contentState.getEntity(props.entityKey).getData()
    return (
        <a 
            href={url} 
            style={{
                textDecoration: "underline",
                color: "inherit"
            }} 
            className="editor-anchor"
            target="_blank"
        >
            {props.children}
        </a>
    )
}

export default Link