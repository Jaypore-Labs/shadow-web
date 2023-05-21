// @ts-nocheck
import React, { useEffect } from "react";
import { IMAGE_MARGIN } from "@/constants";
import { calculateAspectRatioFit } from "@/utils";

const Screenshot = ({
  filePath,
  dimensions,
  api,
  color1,
  color2,
  color3,
  color4,
  setHeight,
  setWidth,
  setMinWidth,
  setMinHeight,
}) => {
  const [init, setInit] = React.useState(false);
  const applyGradientBackground = () => {
    const background = document.getElementById("canvas-container");
    const canvasSide = document.getElementById("canva-side");
    if (!canvasSide) return;
    canvasSide.style.background = "transparent";
    const gradient1 = `linear-gradient(135deg, ${color1} 0%, ${color3} 100%)`;
    const gradient2 = `linear-gradient(225deg, ${color2} 0%, ${color4} 100%)`;

    if (!background) return;
    background.style.display = "inline-block";
    background.style.backgroundImage = `${gradient1}, ${gradient2}`;
  };

  const drawCanvas = () => {
    const canvaWidth = document.getElementById("canva-side").offsetWidth;
    const canvaHeight = document.getElementById("canva-side").offsetHeight;

    const containerWidth = canvaWidth;
    const containerHeight = canvaHeight;
    const canvasContainer = document.getElementById("canvas-container");
    if (!canvasContainer) return;

    canvasContainer.style.width = `${containerWidth}px`;
    canvasContainer.style.height = `${containerHeight}px`;
    canvasContainer.width = containerWidth;
    canvasContainer.height = containerHeight;

    const screenshot = document.getElementById("screenshot");
    if (!screenshot) return;

    screenshot.src = `file://${filePath}`;
    screenshot.style.display = "block";

    const { width, height } = dimensions;
    const data = calculateAspectRatioFit(
      width,
      height,
      canvaWidth - IMAGE_MARGIN,
      canvaHeight - IMAGE_MARGIN
    );
    setHeight(parseInt(canvaHeight));
    setWidth(parseInt(canvaWidth));
    setMinWidth(parseInt(data.width + 30));
    setMinHeight(parseInt(data.height + 30));
    screenshot.style.width = `${data.width}px`;
    screenshot.style.height = `${data.height}px`;

    canvasContainer.style.display = "block";

    applyGradientBackground();
  };

  useEffect(() => {
    if (filePath && dimensions) {
      if (!init) {
        setInit(true);
        drawCanvas();
      } else {
        applyGradientBackground();
      }
    }
  }, [color1, color2, color3, color4, filePath, dimensions]);

  useEffect(() => {
    drawCanvas();
  }, [filePath, dimensions]);
  return (
    <>
      <div id="canvas-container">
        <img
          id="screenshot"
          style={{ display: "none", maxWidth: "100%", maxHeight: "100%" }}
        />
      </div>
    </>
  );
};
export default Screenshot;
