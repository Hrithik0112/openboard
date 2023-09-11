import React, { useEffect, useRef, useState } from "react";
import rough from "roughjs";
import Toolbar from "./ToolBar";

function Canvas() {
  const canvasRef = useRef(null);
  let drawing;
  let isDrawing = false;
  let isErasing = false;
  const [elements, setElements] = useState([]);

  useEffect(() => {
    // const canvas = rough.canvas(canvasRef.current);
    // canvas.line(50, 250, 500, 250);
    const canvas = canvasRef.current;
    drawing = rough.canvas(canvas);
  }, []);

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const { offsetX, offsetY } = e.nativeEvent;
    if (isErasing) {
      // Implement eraser logic here
      const updatedElements = elements.filter((element) => {
        const shape = drawing.roughCanvas.draw(element);
        const roughElement = shape.toElement();
        return !roughElement.contains(offsetX, offsetY);
      });
      setElements(updatedElements);
    } else if (isDrawing) {
      // Implement drawing logic here based on the selected tool
      const newElement = {
        type: isDrawing === "rectangle" ? "rectangle" : "line",
        startX: offsetX,
        startY: offsetY,
        endX: offsetX,
        endY: offsetY,
      };
      setElements([...elements, newElement]);
    }
  };

  const handleMouseUp = () => {
    isDrawing = false;
    isErasing = false;
  };

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    const { offsetX, offsetY } = e.nativeEvent;
    if (isDrawing) {
      const updatedElements = [...elements];
      const currentElement = updatedElements[updatedElements.length - 1];
      currentElement.endX = offsetX;
      currentElement.endY = offsetY;
      setElements(updatedElements);
      redrawCanvas();
    }
  };

  const addRectangle = () => {
    // Set the tool to "drawing rectangles"
    isDrawing = true;
    isErasing = false;
  };

  const addLine = () => {
    // Set the tool to "drawing lines"
    isDrawing = true;
    isErasing = false;
  };

  const useEraser = () => {
    // Set the tool to "eraser"
    isDrawing = false;
    isErasing = true;
  };

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    elements.forEach((element) => {
      if (element.type === "rectangle") {
        const { startX, startY, endX, endY } = element;
        const width = endX - startX;
        const height = endY - startY;
        context.strokeRect(startX, startY, width, height);
      } else if (element.type === "line") {
        const { startX, startY, endX, endY } = element;
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(endX, endY);
        context.stroke();
      }
    });
  };

  return (
    <div>
      <Toolbar onAddRectangle={addRectangle} onAddLine={addLine} onUseEraser={useEraser} />
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      ></canvas>
      ;
    </div>
  );
}

export default Canvas;
