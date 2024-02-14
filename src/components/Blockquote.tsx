import React, { FunctionComponent } from "react";
import { createStyles, styled } from "@mui/material";
import { Theme } from "@mui/material/styles";
import { MaterialStyle } from "../types";

const styles = ({ palette }: Theme) =>
  createStyles({
    root: {
      fontStyle: "italic",
      color: palette.grey[800],
      borderLeft: `4px solid ${palette.grey.A100}`,
    },
  });

type IBlockquoteProps = {
  children?: React.ReactNode;
} & MaterialStyle<ReturnType<typeof styles>>;

const Blockquote: FunctionComponent<IBlockquoteProps> = (props) => {
  return <div className={props.classes.root}>{props.children}</div>;
};

export default styled(Blockquote)(({}) => styles);
