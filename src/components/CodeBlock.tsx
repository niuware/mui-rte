import { grey } from "@mui/material/colors";
import React, { FunctionComponent } from "react";

type IBlockquoteProps = {
  children?: React.ReactNode;
};

const CodeBlock: FunctionComponent<IBlockquoteProps> = (props) => {
  return (
    <div
      style={{
        backgroundColor: grey[200],
        padding: 1,
      }}
    >
      {props.children}
    </div>
  );
};

export default CodeBlock;
