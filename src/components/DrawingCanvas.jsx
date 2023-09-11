import React, { useRef, useEffect } from "react";
import rough from "roughjs";

function DrawingCanvas() {
  const canvasRef = useRef(null);
  let drawing;
  const drawingState = useRef({ elements: [], tool: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    drawing = rough.canvas(canvas);
  }, []);

  const handleMouseDown = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;

    if (drawingState.current.tool === "rectangle") {
      const roughRectangle = drawing.rectangle(offsetX, offsetY, 100, 50, {
        roughness: 1.5,
        fill: "rgba(0,0,0,0.2)",
        stroke: "black",
      });

      drawingState.current.elements.push(roughRectangle);
      redrawCanvas();
    } else if (drawingState.current.tool === "line") {
      drawingState.current.startX = offsetX;
      drawingState.current.startY = offsetY;
    }
  };

  const handleMouseUp = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;

    if (drawingState.current.tool === "line") {
      const roughLine = drawing.line(
        drawingState.current.startX,
        drawingState.current.startY,
        offsetX,
        offsetY,
        {
          stroke: "black",
          strokeWidth: 2,
        }
      );

      drawingState.current.elements.push(roughLine);
      redrawCanvas();
    }
  };

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    drawingState.current.elements.forEach((element) => {
      drawing.draw(element);
    });
  };

  const setTool = (tool) => {
    drawingState.current.tool = tool;
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        width={800}
        height={600}
      ></canvas>
      <button onClick={() => setTool("rectangle")}>Add Rectangle</button>
      <button onClick={() => setTool("line")}>Add Line</button>
    </div>
  );
}

export default DrawingCanvas;
