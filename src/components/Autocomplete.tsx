import React, { FunctionComponent } from "react";
import { Paper, List, ListItem } from "@mui/material";

export type TAutocompleteItem = {
  keys: string[];
  value: any;
  content: string | JSX.Element;
};

type TAutocompleteProps = {
  items: TAutocompleteItem[];
  top: number;
  left: number;
  selectedIndex: number;
  onClick: (selectedIndex: number) => void;
};

const Autocomplete: FunctionComponent<TAutocompleteProps> = (props) => {
  if (!props.items.length) {
    return null;
  }

  return (
    <Paper
      style={{
        top: props.top,
        left: props.left,
        minWidth: "200px",
        position: "absolute",
        zIndex: 10,
      }}
    >
      <List dense={true}>
        {props.items.map((item, index) => (
          <ListItem
            key={index}
            selected={index === props.selectedIndex}
            onClick={() => props.onClick(index)}
            style={{ cursor: "pointer" }}
          >
            {item.content}
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default Autocomplete;
