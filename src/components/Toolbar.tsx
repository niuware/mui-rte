import React, { FunctionComponent, useState, useEffect, CSSProperties } from 'react';
import { EditorState } from 'draft-js';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import StrikethroughIcon from '@mui/icons-material/StrikethroughS';
import HighlightIcon from '@mui/icons-material/Highlight';
import TitleIcon from '@mui/icons-material/Title';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import CodeIcon from '@mui/icons-material/Code';
import FormatClearIcon from '@mui/icons-material/FormatClear';
import SaveIcon from '@mui/icons-material/Save';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import { Box } from '@mui/material';
import { SystemStyleObject } from '@mui/system/styleFunctionSx/styleFunctionSx';
import ToolbarButton from './ToolbarButton';
import { getSelectionInfo } from '../utils';

export type TToolbarControl =
  | 'title'
  | 'bold'
  | 'italic'
  | 'underline'
  | 'link'
  | 'numberList'
  | 'bulletList'
  | 'quote'
  | 'code'
  | 'clear'
  | 'save'
  | 'media'
  | 'strikethrough'
  | 'highlight'
  | string;

export type TControlType = 'inline' | 'block' | 'callback' | 'atomic';

export type TToolbarButtonSize = 'small' | 'medium';

export type TToolbarComponentProps = {
  id: string;
  onMouseDown: (e: React.MouseEvent) => void;
  active: boolean;
  disabled: boolean;
};

export type TCustomControl = {
  id?: string;
  name: string;
  icon?: React.JSX.Element;
  type: TControlType;
  component?: FunctionComponent<TToolbarComponentProps>;
  inlineStyle?: React.CSSProperties;
  blockWrapper?: React.ReactElement;
  atomicComponent?: FunctionComponent;
  onClick?: (
    editorState: EditorState,
    name: string,
    anchor: HTMLElement | null,
  ) => EditorState | void;
};

type TStyleType = {
  id?: string;
  name: TToolbarControl | string;
  label: string;
  style: string;
  icon?: React.JSX.Element;
  component?: FunctionComponent<TToolbarComponentProps>;
  type: TControlType;
  active?: boolean;
  clickFnName?: string;
};

type TToolbarProps = {
  id: string;
  editorState: EditorState;
  controls?: Array<TToolbarControl>;
  customControls?: TCustomControl[];
  onClick: (style: string, type: string, id: string, inlineMode?: boolean) => void;
  inlineMode?: boolean;
  sx?: SystemStyleObject;
  disabled?: boolean;
  size?: TToolbarButtonSize;
  isActive: boolean;
};

const STYLE_TYPES: TStyleType[] = [
  {
    label: 'H2',
    name: 'title',
    style: 'header-two',
    icon: <TitleIcon />,
    type: 'block',
  },
  {
    label: 'Bold',
    name: 'bold',
    style: 'BOLD',
    icon: <FormatBoldIcon />,
    type: 'inline',
  },
  {
    label: 'Italic',
    name: 'italic',
    style: 'ITALIC',
    icon: <FormatItalicIcon />,
    type: 'inline',
  },
  {
    label: 'Underline',
    name: 'underline',
    style: 'UNDERLINE',
    icon: <FormatUnderlinedIcon />,
    type: 'inline',
  },
  {
    label: 'Strikethrough',
    name: 'strikethrough',
    style: 'STRIKETHROUGH',
    icon: <StrikethroughIcon />,
    type: 'inline',
  },
  {
    label: 'Highlight',
    name: 'highlight',
    style: 'HIGHLIGHT',
    icon: <HighlightIcon />,
    type: 'inline',
  },
  {
    label: 'Undo',
    name: 'undo',
    style: 'UNDO',
    icon: <UndoIcon />,
    type: 'callback',
  },
  {
    label: 'Redo',
    name: 'redo',
    style: 'REDO',
    icon: <RedoIcon />,
    type: 'callback',
  },
  {
    label: 'Link',
    name: 'link',
    style: 'LINK',
    icon: <InsertLinkIcon />,
    type: 'callback',
    id: 'link-control',
  },
  {
    label: 'Media',
    name: 'media',
    style: 'IMAGE',
    icon: <PhotoLibraryIcon />,
    type: 'callback',
    id: 'media-control',
  },
  {
    label: 'UL',
    name: 'bulletList',
    style: 'unordered-list-item',
    icon: <FormatListBulletedIcon />,
    type: 'block',
  },
  {
    label: 'OL',
    name: 'numberList',
    style: 'ordered-list-item',
    icon: <FormatListNumberedIcon />,
    type: 'block',
  },
  {
    label: 'Blockquote',
    name: 'quote',
    style: 'blockquote',
    icon: <FormatQuoteIcon />,
    type: 'block',
  },
  {
    label: 'Code Block',
    name: 'code',
    style: 'code-block',
    icon: <CodeIcon />,
    type: 'block',
  },
  {
    label: 'Clear',
    name: 'clear',
    style: 'clear',
    icon: <FormatClearIcon />,
    type: 'callback',
  },
  {
    label: 'Save',
    name: 'save',
    style: 'save',
    icon: <SaveIcon />,
    type: 'callback',
  },
];

const Toolbar: FunctionComponent<TToolbarProps> = (props) => {
  const {
    controls: propControls,
    inlineMode,
    customControls,
    id: propsId,
    onClick,
    isActive,
    disabled,
    size,
    sx,
  } = props;

  const [availableControls, setAvailableControls] = useState(propControls ? [] : STYLE_TYPES);
  const { editorState } = props;
  const id = inlineMode ? '-inline-toolbar' : '-toolbar';

  useEffect(() => {
    if (!propControls) return;
    const filteredControls: TStyleType[] = [];
    const controls = propControls.filter(
      (control, index) => propControls!.indexOf(control) >= index,
    );
    controls.forEach((name) => {
      const style = STYLE_TYPES.find((style) => style.name === name);
      if (style) {
        filteredControls.push(style);
      } else if (customControls) {
        const customControl = customControls.find((style) => style.name === name);
        if (
          customControl &&
          customControl.type !== 'atomic' &&
          (customControl.icon || customControl.component)
        ) {
          filteredControls.push({
            id: customControl.id || `${customControl.name}Id`,
            name: customControl.name,
            label: customControl.name,
            style: customControl.name.toUpperCase(),
            icon: customControl.icon,
            component: customControl.component,
            type: customControl.type,
            clickFnName: 'onCustomClick',
          });
        }
      }
    });
    setAvailableControls(filteredControls);
  }, [propControls, customControls]);

  return (
    <Box id={`${propsId}${id}`} sx={sx}>
      {availableControls.map((style) => {
        if (
          inlineMode &&
          style.type !== 'inline' &&
          style.name !== 'link' &&
          style.name !== 'clear'
        ) {
          return null;
        }
        let active = false;
        const action = onClick;
        if (!isActive) {
          active = false;
        } else if (style.type === 'inline') {
          active = editorState.getCurrentInlineStyle().has(style.style);
        } else if (style.type === 'block') {
          const selection = editorState.getSelection();
          const block = editorState.getCurrentContent().getBlockForKey(selection.getStartKey());
          if (block) {
            active = style.style === block.getType();
          }
        } else if (style.style === 'IMAGE' || style.style === 'LINK') {
          active = style.style === getSelectionInfo(editorState).entityType;
        }

        return (
          <ToolbarButton
            id={style.id}
            editorId={propsId}
            key={`key-${style.label}`}
            active={active}
            label={style.label}
            onClick={action}
            style={style.style}
            type={style.type}
            icon={style.icon}
            component={style.component}
            inlineMode={inlineMode}
            disabled={disabled}
            size={size}
          />
        );
      })}
    </Box>
  );
};
export default Toolbar;
