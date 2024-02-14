import { grey } from "@mui/material/colors";
import React, { FunctionComponent } from "react";

type IBlockquoteProps = {
  children?: React.ReactNode;
};

const Blockquote: FunctionComponent<IBlockquoteProps> = (props) => {
  return (
    <div
      style={{
        fontStyle: "italic",
        color: `${grey[800]}`,
        borderLeft: `4px solid ${grey[800]}`,
      }}
    >
      {props.children}
    </div>
  );
};

export default Blockquote;
