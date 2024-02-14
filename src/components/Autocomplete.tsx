import React, { FunctionComponent } from "react";
import { Paper, List, ListItem, styled, createStyles } from "@mui/material";
import { MaterialStyle } from "../types";

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
} & MaterialStyle<ReturnType<typeof styles>>;

const styles = () =>
  createStyles({
    container: {
      minWidth: "200px",
      position: "absolute",
      zIndex: 10,
    },
    item: {
      cursor: "pointer",
    },
  });

const Autocomplete: FunctionComponent<TAutocompleteProps> = (props) => {
  if (!props.items.length) {
    return null;
  }

  const { classes } = props;
  return (
    <Paper
      className={classes.container}
      style={{
        top: props.top,
        left: props.left,
      }}
    >
      <List dense={true}>
        {props.items.map((item, index) => (
          <ListItem
            key={index}
            className={classes.item}
            selected={index === props.selectedIndex}
            onClick={() => props.onClick(index)}
          >
            {item.content}
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default styled(Autocomplete)(({}) => styles);
