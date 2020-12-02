import React from "react";
import MUIRichTextEditor from "../..";
import { TAutocompleteItem } from "../../src/components/Autocomplete";
import { stateToHTML } from "draft-js-export-html";
import { convertToRaw, ContentState } from "draft-js";
import htmlToDraft from "html-to-draftjs";

// const save = (data: string) => {
//   console.log(data);
// };
/*
<p>test <a href="/mexico" type="mention" style="color: red">Mexico City</a>&nbsp;</p> <ul> <li>testing</li> <li>123</li> </ul> <p><a href="/tokyo" type="mention" style="color: red">Tokyo</a>&nbsp;</p>
{"blocks":[{"key":"fqvfu","text":"test Mexico City ","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[{"offset":5,"length":11,"key":0}],"data":{}},{"key":"9bbee","text":"testing","type":"unordered-list-item","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"2uuli","text":"123","type":"unordered-list-item","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"60rk3","text":"Tokyo ","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[{"offset":0,"length":5,"key":1}],"data":{}}],"entityMap":{"0":{"type":"MYATDECO","mutability":"IMMUTABLE","data":{"url":"/mexico","key":"mex"}},"1":{"type":"MYATDECO","mutability":"IMMUTABLE","data":{"url":"/tokyo","key":"tok"}}}}
*/

let options = {
  entityStyleFn: (entity: any) => {
    const entityType = entity.get("type");
    if (entityType === "MYATDECO") {
      const data: any = entity.getData();
      return {
        element: "a",
        attributes: {
          href: data ? data.url : "",
          type: "mention",
        },
        style: {
          color: "blue",
        },
      };
    } else {
      return {};
    }
  },
};

const cities: TAutocompleteItem[] = [
  {
    keys: ["mexico"],
    value: "Mexico City", // gets inserted
    content: "Mexico City", // gets displayed
    data: {
      url: "/mexico",
      key: "mex",
    },
  },
  {
    keys: ["mexico", "cancun"],
    value: "Cancun",
    content: "Cancun",
    data: {
      url: "/cancun",
      key: "can",
    },
  },
  {
    keys: ["japan", "tokyo"],
    value: "Tokyo",
    content: "Tokyo",
    data: {
      url: "/tokyo",
      key: "tok",
    },
  },
  {
    keys: ["japan"],
    value: "Osaka",
    content: "Osaka",
    data: {
      url: "/osaka",
      key: "jap",
    },
  },
];

const MyAtDecorator = (props: any) => {
  //   const customUrl = "http://myulr/mention/" + props.decoratedText;
  const data = props.contentState.getEntity(props.entityKey).data;

  // if (data.fromHTML) {

  // }
  // else {

  // }

  return (
    <a
      onClick={() => (window.location.href = data.url)}
      key={data.key}
      style={{
        color: "red",
        cursor: "pointer",
      }}
    >
      {props.children}
    </a>
  );
};

const AutocompleteDecorator = () => {
  let _editorState: any = null;

  const blocksFromHtml = htmlToDraft(
    '<p>test <a href="/mexico" type="mention" style="color: red">Mexico City</a>&nbsp;</p> <ul> <li>testing</li> <li>123</li> </ul> <p><a href="/tokyo" type="mention" style="color: red">Tokyo</a>&nbsp;</p>',
    (nodeName, node) => {
      if (nodeName === "a") {
        if (node.getAttribute("type") === "mention") {
          return {
            type: "MYATDECO",
            mutability: "IMMUTABLE",
            data: {
              url: node.getAttribute("href"),
              key: node.getAttribute("href"),
            },
            text: node.innerHTML,
          };
        } else {
          return undefined;
        }
      } else {
        return undefined;
      }
    }
  );
  const { contentBlocks, entityMap } = blocksFromHtml;
  const state = ContentState.createFromBlockArray(contentBlocks, entityMap);
  const content = JSON.stringify(convertToRaw(state));

  return (
    <MUIRichTextEditor
      label="Type something here..."
      // defaultValue={`<p>Hi test <a href="/mexico" style="color: red">Mexico City</a> &nbsp;hello&nbsp;</p><ul><li>on</li><li>two</li><li>threee</li></ul><p>neyz</p>`}
      defaultValue={content}
      onChange={(state) => {
        _editorState = state;
      }}
      onSave={() => {
        console.log(
          JSON.stringify(convertToRaw(_editorState.getCurrentContent()))
        );
        const html = stateToHTML(_editorState.getCurrentContent(), options); // => here you gonna receive the HTML
        console.log(html);
      }}
      autocomplete={{
        strategies: [
          {
            items: cities,
            triggerChar: "@",
            decoratorName: "MYATDECO",
          },
        ],
      }}
      decorators={[
        {
          component: MyAtDecorator,
          regex: /\@[\w ]+\@/g, // unused but required
          name: "MYATDECO",
        },
      ]}
    />
  );
};

export default AutocompleteDecorator;
