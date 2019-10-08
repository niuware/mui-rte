import React from 'react'
import MUIRichTextEditor from '../../'

const save = (data: string) => {
    console.log(data)
}

const MyHashTagDecorator = (props: any) => {
    return (
        <span style={{
            color: "#3F51B5"
        }}>
            {props.children}
        </span>
    )
}

const MyAtDecorator = (props: any) => {
    const customUrl = "http://myulr/mention/" + props.decoratedText
    return (
        <a
            onClick={() => window.location.href = customUrl}
            style={{
                color: "green",
                cursor: "pointer"
            }}
        >
            {props.children}
        </a>
    )
}

const Decorators = () => {
    return (
        <MUIRichTextEditor 
            label="Try writing a #hashtag or a @mention..."
            onSave={save}
            decorators={[
                {
                    component: MyHashTagDecorator,
                    regex: /\#[\w]+/g
                },
                {
                    component: MyAtDecorator,
                    regex: /\@[\w]+/g
                }
            ]}
        />
    )
}

export default Decorators