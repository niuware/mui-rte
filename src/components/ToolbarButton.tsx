import React, { FunctionComponent } from 'react';
import IconButton from '@mui/material/IconButton';
import { TToolbarComponentProps, TToolbarButtonSize } from './Toolbar';

interface IToolbarButtonProps {
  id?: string;
  editorId?: string;
  label: string;
  style: string;
  type: string;
  active?: boolean;
  icon?: React.JSX.Element;
  onClick?: any;
  inlineMode?: boolean;
  disabled?: boolean;
  size?: TToolbarButtonSize;
  component?: FunctionComponent<TToolbarComponentProps>;
}

const ToolbarButton: FunctionComponent<IToolbarButtonProps> = (props) => {
  const {
    inlineMode,
    size: sizeProp,
    editorId: editorIdProp,
    label,
    id,
    onClick,
    style,
    type,
    disabled,
    icon,
    active,
    component: PropsComponent,
  } = props;

  const size = !inlineMode ? sizeProp || 'medium' : 'small';
  const toolbarId = inlineMode ? '-toolbar' : '';
  const editorId = editorIdProp || 'mui-rte';
  const elemId = `${editorId}-${id || label}-button${toolbarId}`;
  const sharedProps = {
    id: elemId,
    onMouseDown: (e: React.MouseEvent) => {
      e.preventDefault();
      if (onClick) {
        onClick(style, type, elemId, inlineMode);
      }
    },
    disabled: disabled || false,
  };
  if (icon) {
    return (
      <IconButton
        {...sharedProps}
        aria-label={label}
        color={active ? 'primary' : 'default'}
        size={size}
      >
        {icon}
      </IconButton>
    );
  }
  if (PropsComponent) {
    return <PropsComponent {...sharedProps} active={active || false} />;
  }
  return null;
};

export default ToolbarButton;
