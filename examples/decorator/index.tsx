import React, { FunctionComponent, Fragment } from 'react'
import MUIRichTextEditor from '../../'
import { Modifier, EditorState, ContentState } from 'draft-js'
import { Chip, Avatar, Popover, Grid } from '@material-ui/core'
import { TToolbarComponentProps } from '../../src/components/Toolbar'

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
const MyCallbackComponent: FunctionComponent<TToolbarComponentProps> = props => {
    return (
      <Chip
        id={props.id}
        avatar={<Avatar>C</Avatar>}
        onClick={props.onMouseDown}
        label="aaa"
        disabled={props.disabled}
      />
    );
  };

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

const EntityDecorator = (props: any) => {

    const contentState: ContentState = props.contentState;
    const entity = contentState.getEntity(props.entityKey);
    return (
        <span
            title={entity.getData().someData}
          style={{
            backgroundColor: "lemonchiffon",
            borderRadius: "3px",
            cursor: "pointer"
          }}
        >
          {props.children}
        </span>
    );
  };
  

const Decorators = () => {
    return (
        <MUIRichTextEditor 
            label="Try writing a #hashtag or a @mention..."
            onSave={save}
            controls={["add-entity"]}
            decorators={[
                {
                    component: MyHashTagDecorator,
                    regex: /\#[\w]+/g
                },
                {
                    component: MyAtDecorator,
                    regex: /\@[\w]+/g
                },
                {
                    component: EntityDecorator,
                    entityType: "entity-type"
                }
            ]}
            customControls={[
                {
                    name: "add-entity",
                    component: MyCallbackComponent,
                    type: "callback",
                    onClick: editorState => {
                      const contentstate = editorState.getCurrentContent();
          
                      // Returns ContentState record updated to include the newly created DraftEntity record in it's EntityMap.
                      let newContentState = contentstate.createEntity(
                        "MENTION",
                        "IMMUTABLE",
                        { 
                          someData: "some data",
                          entityType: "entity-type"
                        },
          
                      );
          
                      // Call getLastCreatedEntityKey to get the key of the newly created DraftEntity record.
                      const entityKey = contentstate.getLastCreatedEntityKey();
          
                      // Get the current selection
                      const selectionState = editorState.getSelection();
          
                      // Add the created entity to the current selection, for a new contentState
                      newContentState = Modifier.applyEntity(
                        newContentState,
                        selectionState,
                        entityKey
                      );
          
                      // Add newContentState to the existing editorState, for a new editorState
                      const newEditorState = EditorState.push(
                        editorState,
                        newContentState,
                        "apply-entity"
                      );
          
                      return newEditorState;
                    }
                }
            ]}
        />
    )
}

export default Decorators