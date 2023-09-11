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
    } else if (drawingState.current.tool === "arrow") {
      // Call drawArrow with start and end coordinates
      if (!drawingState.current.startX || !drawingState.current.startY) {
        // If startX or startY is not set, set them as the current click coordinates
        drawingState.current.startX = offsetX;
        drawingState.current.startY = offsetY;
      } else {
        // If startX and startY are already set, call drawArrow
        drawArrow(drawingState.current.startX, drawingState.current.startY, offsetX, offsetY);

        // Reset startX and startY for the next arrow
        drawingState.current.startX = null;
        drawingState.current.startY = null;
      }
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

  const drawArrow = (startX, startY, endX, endY) => {
    const roughArrow = drawing.line(startX, startY, endX, endY, {
      stroke: "black",
      strokeWidth: 2,
    });

    // Add arrowhead to the line
    const arrowhead = drawing.line(endX - 10, endY - 10, endX, endY, {
      stroke: "black",
      strokeWidth: 2,
    });

    drawingState.current.elements.push(roughArrow, arrowhead);
    redrawCanvas();
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
      <button onClick={() => setTool("arrow")}>Add Arrow</button>
    </div>
  );
}

export default DrawingCanvas;
