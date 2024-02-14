import React, { FunctionComponent } from 'react';
import { Box } from '@mui/material';

interface IBlockquoteProps {
  children?: React.ReactNode;
}

const CodeBlock: FunctionComponent<IBlockquoteProps> = (props) => {
  const { children } = props;

  return (
    <Box
      sx={(theme) => ({
        backgroundColor: theme.palette.grey[200],
        padding: theme.spacing(1, 2, 1, 2),
      })}
    >
      {children}
    </Box>
  );
};

export default CodeBlock;
