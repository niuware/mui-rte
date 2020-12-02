import React from "react";
import MUIRichTextEditor from "../..";
import { TAutocompleteItem } from "../../src/components/Autocomplete";

const save = (data: string) => {
  console.log(data);
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

  return (
    <a
      onClick={() => (window.location.href = data.url)}
      key={data.key}
      style={{
        color: "green",
        cursor: "pointer",
      }}
    >
      {props.children}-{data.key}
    </a>
  );
};

const AutocompleteDecorator = () => {
  return (
    <MUIRichTextEditor
      label="Type something here..."
      onSave={save}
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
