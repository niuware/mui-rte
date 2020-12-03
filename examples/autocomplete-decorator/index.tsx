import React, { useRef } from "react";
import MUIRichTextEditor from "../..";
import { TAutocompleteItem } from "../../src/components/Autocomplete";
import { TMUIRichTextEditorRef } from "../../src/MUIRichTextEditor";

let options = {
  entityStyleFn: (entity: any) => {
    const entityType = entity.get("type");
    if (entityType === "MYATDECO" || entityType === "MYHASHDECO") {
      const data: any = entity.getData();
      if(data.key.includes("#")){
        return {
        element: "a",
        attributes: {
          href: data ? data.url : "",
          key: data.key,
        },
        style: {
          color: "orange",
          cursor: "pointer",
        },
      };
      }
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
    } else if(entityType==='LINK'){
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
    }
    else {
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

const tags: TAutocompleteItem[] = [
  {
    keys: ["travel","tour", "trip"],
    value: "#Travel", // gets inserted
    content: "#Travel", // gets displayed
    data: {
      url: "/travel",
      key: "#travel",
    },
  },
  {
    keys: ["food", "breakfast", "dinner", "lunch", "cooking"],
    value: "#Food",
    content: "#food",
    data: {
      url: "/food",
      key: "#food",
    },
  },
  {
    keys: ["literature", "books"],
    value: "#Literature",
    content: "#Literature",
    data: {
      url: "/literature",
      key: "#literature",
    },
  },
  {
    keys: ["technology", "phone", "laptop"],
    value: "#Tech",
    content: "#Tech",
    data: {
      url: "/tech",
      key: "#tech",
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

const MyHashTagDecorator = (props: any) => {
  const data = props.contentState.getEntity(props.entityKey).data;
  
  return (
    <a
      onClick={() => (window.location.href = data.url)}
       key={data.key}
      style={{
        color: 'orange',
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
            {
              items: tags,
              triggerChar: "#",
              decoratorName: "MYHASHDECO",
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
          {
            component: MyHashTagDecorator,
            regex: /\#[\w ]+/g, // unused but required
            name: "MYHASHDECO",
          },
        ]}
      />
      <button onClick={() => ref.current?.saveHtml(options)}>save html</button>
    </>
  );
};

export default AutocompleteDecorator;
