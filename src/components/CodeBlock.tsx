import React, { FunctionComponent } from "react";
import { createStyles, styled } from "@mui/material";
import { Theme } from "@mui/material/styles";
import { MaterialStyle } from "../types";

const styles = ({ spacing, palette }: Theme) =>
  createStyles({
    root: {
      backgroundColor: palette.grey[200],
      padding: spacing(1, 2, 1, 2),
    },
  });

type IBlockquoteProps = {
  children?: React.ReactNode;
} & MaterialStyle<ReturnType<typeof styles>>;

const CodeBlock: FunctionComponent<IBlockquoteProps> = (props) => {
  return <div className={props.classes.root}>{props.children}</div>;
};

export default styled(CodeBlock)(({}) => styles);
