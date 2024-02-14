import React, { FunctionComponent } from 'react';
import { Box } from '@mui/material';

interface IBlockquoteProps {
  children?: React.ReactNode;
}

const Blockquote: FunctionComponent<IBlockquoteProps> = (props) => {
  const { children } = props;
  return (
    <Box
      sx={(theme) => ({
        fontStyle: 'italic',
        color: theme.palette.grey[800],
        borderLeft: `4px solid ${theme.palette.grey.A100}`,
      })}
    >
      {children}
    </Box>
  );
};

export default Blockquote;
