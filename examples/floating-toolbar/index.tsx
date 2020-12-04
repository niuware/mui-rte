import React, { useRef, useState, useEffect } from "react";
import MUIRichTextEditor from "../../";

const FloatingToolbar = () => {
  const [showToolbar, setShowToolbar] = useState(false);
  const [pos, setPos] = useState({ bottom: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setPos((p) => {
      return { bottom: p.bottom + 0, left: p.left + 0 };
    });
  }, [showToolbar]);

  return (
    <>
      <MUIRichTextEditor
        label="Type something here..."
        floatingToolbar={showToolbar}
        floatingToolbarControls={["bold", "italic", "link"]}
        floatingToolbarPosition={pos}
      />
      <button ref={btnRef} onClick={() => setShowToolbar(!showToolbar)}>
        Toolbar
      </button>
    </>
  );
};

export default FloatingToolbar;
