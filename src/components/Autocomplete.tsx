import React from 'react';
import { Paper, List, ListItem } from '@mui/material';

export type TAutocompleteItem = {
  keys: string[];
  value: any;
  content: string | React.JSX.Element;
};

interface TAutocompleteProps {
  items: TAutocompleteItem[];
  top: number;
  left: number;
  selectedIndex: number;
  onClick: (selectedIndex: number) => void;
}

const Autocomplete = (props: TAutocompleteProps) => {
  const { items, top, left, selectedIndex, onClick } = props;
  if (!items.length) return null;

  return (
    <Paper
      sx={{
        minWidth: '200px',
        position: 'absolute',
        zIndex: 10,
      }}
      style={{
        top,
        left,
      }}
    >
      <List dense>
        {items.map((item, index) => (
          <ListItem
            key={index}
            sx={{
              cursor: 'pointer',
            }}
            selected={index === selectedIndex}
            onClick={() => onClick(index)}
          >
            {item.content}
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default Autocomplete;
