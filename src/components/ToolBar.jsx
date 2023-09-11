import React from "react";

function Toolbar({ onAddRectangle, onAddLine, onUseEraser }) {
  return (
    <div className="toolbar">
      <button onClick={onAddRectangle}>Add Rectangle</button>
      <button onClick={onAddLine}>Add Line</button>
      <button onClick={onUseEraser}>Eraser</button>
    </div>
  );
}

export default Toolbar;
