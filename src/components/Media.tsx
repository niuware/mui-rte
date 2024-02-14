import React, { FunctionComponent } from 'react';
import { ContentState, ContentBlock } from 'draft-js';
import { Box, useTheme } from '@mui/material';

interface IMediaProps {
  block: ContentBlock;
  contentState: ContentState;
  blockProps: any;
  onClick: (block: ContentBlock) => void;
}

const constructMediaSx = (editable: boolean, focused: boolean, shadow: string) => ({
  margin: '5px 0 1px',
  outline: 'none',
  ...(editable
    ? {
        cursor: 'pointer',
        '&:hover': {
          boxShadow: shadow,
        },
      }
    : {}),
  ...(focused
    ? {
        boxShadow: shadow,
      }
    : {}),
});

const constructWrapperSx = (textAlign: string) => {
  if (textAlign === 'left' || textAlign === 'center' || textAlign === 'right') return { textAlign };
  return {};
};

const Media: FunctionComponent<IMediaProps> = (props) => {
  const { contentState, block, blockProps } = props;
  const { url, width, height, alignment, type } = contentState
    .getEntity(block.getEntityAt(0))
    .getData();
  const { onClick, readOnly, focusKey } = blockProps;

  const theme = useTheme();
  const { shadows } = theme;

  const mediaOnClick = () => {
    if (readOnly) return;
    onClick(block);
  };

  const htmlTag = () => {
    if (!type || type === 'image')
      return (
        <Box
          src={url}
          component="img"
          sx={constructMediaSx(!readOnly, !readOnly && focusKey === block.getKey(), shadows[3])}
          width={width}
          height={height}
          onClick={mediaOnClick}
        />
      );

    if (type === 'video') {
      return (
        <Box sx={constructMediaSx(!readOnly, !readOnly && focusKey === block.getKey(), shadows[3])}>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            src={url}
            width={width}
            height={'auto'}
            onClick={mediaOnClick}
            autoPlay={false}
            controls
          />
        </Box>
      );
    }
    return null;
  };

  return <Box sx={constructWrapperSx(alignment)}>{htmlTag()}</Box>;
};

export default Media;
