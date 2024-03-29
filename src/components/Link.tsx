import React, { FunctionComponent } from 'react'
import { ContentState } from 'draft-js'
import { Link as MuiLink } from '@mui/material'

type TLinkProps = {
    children?: React.ReactNode
    contentState: ContentState
    entityKey: string
}

const Link: FunctionComponent<TLinkProps> = (props) => {
    const { url, className } = props.contentState.getEntity(props.entityKey).getData()
    return (
        <MuiLink
            href={url}
            className={`${className} editor-anchor`}
            target="_blank"
        >
            {props.children}
        </MuiLink>
    )
}

export default Link
