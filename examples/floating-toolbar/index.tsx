import React, { useState } from "react";
import MUIRichTextEditor from "../../";

const FloatingToolbar = () => {
  const [showToolbar, setShowToolbar] = useState(false);

  return (
    <>
      <MUIRichTextEditor
        label="Type something here..."
        floatingToolbar={showToolbar}
        floatingToolbarControls={[
          "bold",
          "italic",
          "underline",
          "quote",
          "bulletList",
          "numberList",
          "link",
        ]}
        floatingToolbarPosition={{
          bottom: 0,
          left: 0,
        }}
        toolbar={false}
        toolbarButtonSize="small"
      />
      <button onClick={() => setShowToolbar(!showToolbar)}>Toolbar</button>
    </>
  );
};

export default FloatingToolbar;
