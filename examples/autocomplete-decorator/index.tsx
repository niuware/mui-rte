import React, { useRef } from "react";
import MUIRichTextEditor from "../..";
import { TAutocompleteItem } from "../../src/components/Autocomplete";
import { TMUIRichTextEditorRef } from "../../src/MUIRichTextEditor";

let options = {
  entityStyleFn: (entity: any) => {
    const entityType = entity.get("type");
    if (entityType === "MYATDECO") {
      const data: any = entity.getData();
      return {
        element: "a",
        attributes: {
          href: data ? data.url : "",
          key: data.key,
        },
        style: {
          color: "red",
          cursor: "pointer",
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
  const data = props.contentState.getEntity(props.entityKey).data;
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
  const ref = useRef<TMUIRichTextEditorRef>(null);
  return (
    <>
      <MUIRichTextEditor
        ref={ref}
        label="Type something here..."
        defaultValueHtml={`<p>Hi testing <a href="/mexico" key="mex" type="mention" style="color: red; cursor: pointer">Mexico City</a> huhu</p> <ul> <li><a href="/tokyo" key="tok" type="mention" style="color: red; cursor: pointer">Tokyo</a> is nice</li> <li><a href="/cancun" key="can" type="mention" style="color: red; cursor: pointer">Cancun</a> hmm</li> </ul>`}
        onSave={(data) => {
          console.log(data);
        }}
        onSaveHtml={(d) => console.log("html", d)}
        autocomplete={{
          strategies: [
            {
              items: cities,
              triggerChar: "@",
              decoratorName: "MYATDECO",
              insertSpaceAfter: false,
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
      <button onClick={() => ref.current?.saveHtml(options)}>save html</button>
    </>
  );
};

export default AutocompleteDecorator;
