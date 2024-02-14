import React from 'react';
import { Meta, Story } from '@storybook/react';
import { createTheme, ThemeProvider } from '@mui/material';
import MUIRichTextEditor, { TMUIRichTextEditorProps } from '../MUIRichTextEditor';

export default {
  title: 'components/MUIRichTextEditor',
  component: MUIRichTextEditor,
} as Meta;

const Template: Story<TMUIRichTextEditorProps> = (args, { parameters }) => {
  const { additionalThemes } = parameters;
  const defaultTheme = createTheme(additionalThemes);

  return (
    <ThemeProvider theme={defaultTheme}>
      <div>
        <MUIRichTextEditor {...args} />
      </div>
    </ThemeProvider>
  );
};

export const Default = Template.bind({});
const emojis = [
  {
    keys: ['face', 'grin'],
    value: '😀',
    content: '😀',
  },
  {
    keys: ['face', 'joy'],
    value: '😂',
    content: '😂',
  },
  {
    keys: ['face', 'sweat'],
    value: '😅',
    content: '😅',
  },
];

Default.args = {
  controls: ['bold', 'italic', 'bulletList', 'undo', 'redo'],
  label: 'Now with emojis 😀 e.g., start typing ":face"',
  maxLength: 1000,
  autocomplete: {
    strategies: [
      {
        items: emojis,
        triggerChar: ':',
      },
    ],
  },
};

Default.parameters = {
  additionalThemes: {
    mixins: {
      muiRichTextEditor: {
        root: {
          marginTop: 5,
          width: '20%',
          backgroundColor: '#AAD7D9',
          borderRadius: 1,
        },
        editor: {
          borderBottom: '1px solid #92C7CF',
        },
        placeHolder: {
          color: '#E5E1DA',
        },
      },
    },
  },
};
