import * as React from 'react'
import MUIRichTextEditor from '../../'

const save = (data: string) => {
    console.log(data)
}

const MyHashTagDecorator: React.FC<any> = (props: any) => {
    return (
        <span style={{
            color: "#3F51B5"
        }}>
            {props.children}
        </span>
    )
}

const MyAtDecorator: React.FC<any> = (props: any) => {
    const customUrl = "http://myulr/mention/" + props.decoratedText
    return (
        <a 
            href={customUrl}
            style={{
                color: "green"
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