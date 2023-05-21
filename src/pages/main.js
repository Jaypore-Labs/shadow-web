import {
  Button,
  Card,
  Col,
  InputNumber,
  Row,
  Slider,
  Typography,
  notification,
} from "antd";
import {
  CopyOutlined,
  HighlightOutlined,
  InboxOutlined,
  PlusOutlined,
  SaveOutlined,
  UndoOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { message, Upload } from "antd";
import { useEffect, useState } from "react";
import Screenshot from "./screenshot";
import getRandomBrightColor from "@/utils";

const { Dragger } = Upload;

export default function Index() {
  const [api, contextHolder] = notification.useNotification();

  const [color1, setColor1] = useState(undefined);
  const [color2, setColor2] = useState(undefined);
  const [color3, setColor3] = useState(undefined);
  const [color4, setColor4] = useState(undefined);

  const [shadow, setShadow] = useState(1);
  const [borderRadius, setBorderRadius] = useState(1);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [minWidth, setMinWidth] = useState(300);
  const [maxWidth, setMaxWidth] = useState(500);
  const [minHeight, setMinHeight] = useState(500);
  const [gradiant, setGradiant] = useState(undefined);

  const [selectedFilePath, setSelectedFilePath] = useState("");
  const [selectedFileDimensions, setSelectedFileDimensions] = useState({
    width: 0,
    height: 0,
  });

  const props = {
    name: "file",
    type: "image/*",
    action: "",
    multiple: false,
    showUploadList: false,
    onChange: (file) => {
      const path = `file://${file.file.originFileObj.path}`;
      const img = new Image();
      img.onload = function () {
        setSelectedFileDimensions({ width: this.width, height: this.height });
        setSelectedFilePath(file.file.originFileObj.path);
      };
      img.src = path;
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  useEffect(() => {
    setColor1(getRandomBrightColor());
    setColor2(getRandomBrightColor());
    setColor3(getRandomBrightColor());
    setColor4(getRandomBrightColor());
  }, []);

  const setBgGradiant = () => {
    if (!selectedFilePath) {
      const canvasSide = document.getElementById("canva-side");
      const gradient1 = `linear-gradient(135deg, ${color1} 0%, ${color3} 100%)`;
      const gradient2 = `linear-gradient(225deg, ${color2} 0%, ${color4} 100%)`;
      const combinedGradient = `background-image: ${gradient1}, ${gradient2};`;
      setGradiant(combinedGradient);
      if (!canvasSide) return;
      setMaxWidth(canvasSide?.clientWidth);
      canvasSide.setAttribute("style", combinedGradient);
    }
  };

  const getScreenshotBuffer = () => {
    const canvas = document.getElementById("canvas-container");
    const screenshot = document.querySelector("#screenshot");
    if (!canvas || !screenshot) return;
    const image = new Image();
    image.src = screenshot.src;
    return new Promise((resolve, reject) => {
      image.onload = () => {
        resolve(image);
      };
    }).then((image) => {
      const actualImageWidth = image.width;
      const actualImageHeight = image.height;
      const differenceWidth = actualImageWidth / screenshot.width;
      const differenceHeight = actualImageHeight / screenshot.height;
      const scaledCanvasWidth = differenceWidth * canvas.offsetWidth;
      const scaledCanvasHeight = differenceHeight * canvas.offsetHeight;
      const imageCanvas = document.createElement("canvas");
      imageCanvas.width = scaledCanvasWidth;
      imageCanvas.height = scaledCanvasHeight;

      // Center the screenshot inside the canvas
      const screenshotX = (imageCanvas.width - actualImageWidth) / 2;
      const screenshotY = (imageCanvas.height - actualImageHeight) / 2;
      const borderRadius = parseFloat(screenshot.style.borderRadius);
      let radiusX = 0;
      let radiusY = 0;
      if (!isNaN(borderRadius)) {
        radiusX = radiusY = borderRadius;
      }

      // Draw the screenshot onto the new canvas
      const imageCtx = imageCanvas.getContext("2d");
      const shadowCanvas = document.createElement("canvas");
      shadowCanvas.width = scaledCanvasWidth - 2;
      shadowCanvas.height = scaledCanvasWidth - 2;
      imageCanvas.width = scaledCanvasWidth;
      imageCanvas.height = scaledCanvasHeight;

      const backgroundCanvas = document.createElement("canvas");
      backgroundCanvas.width = imageCanvas.width = scaledCanvasWidth;
      backgroundCanvas.height = imageCanvas.height = scaledCanvasHeight;

      let backgroundCtx = backgroundCanvas.getContext("2d");

      const angle1 = 135 * (Math.PI / 180);
      const angle2 = 225 * (Math.PI / 180);

      const x1 = (scaledCanvasWidth * (1 - Math.cos(angle1))) / 2;
      const y1 = (scaledCanvasHeight * (1 - Math.sin(angle1))) / 2;
      const x2 = (scaledCanvasWidth * (1 + Math.cos(angle1))) / 2;
      const y2 = (scaledCanvasHeight * (1 + Math.sin(angle1))) / 2;

      const x3 = (scaledCanvasWidth * (1 - Math.cos(angle2))) / 2;
      const y3 = (scaledCanvasHeight * (1 - Math.sin(angle2))) / 2;
      const x4 = (scaledCanvasWidth * (1 + Math.cos(angle2))) / 2;
      const y4 = (scaledCanvasHeight * (1 + Math.sin(angle2))) / 2;

      if (!backgroundCtx) return;

      const gradient1 = backgroundCtx.createLinearGradient(x4, y4, x3, y3);
      gradient1.addColorStop(0, color1);
      gradient1.addColorStop(1, color3);

      const gradient2 = backgroundCtx.createLinearGradient(x1, x2, y1, y2);
      gradient2.addColorStop(0, color2);
      gradient2.addColorStop(1, color4);

      backgroundCtx.fillStyle = gradient2;
      backgroundCtx.fillRect(0, 0, imageCanvas.width, imageCanvas.height);

      backgroundCtx.fillStyle = gradient1;
      backgroundCtx.fillRect(0, 0, imageCanvas.width, imageCanvas.height);

      backgroundCtx.globalCompositeOperation = "source-over";

      // Handle the shadow
      const boxShadow = window.getComputedStyle(screenshot).boxShadow;

      if (boxShadow !== "none") {
        // Extract the shadow values from the boxShadow string
        const shadowValues = boxShadow.match(/-?\d+px|#[\da-fA-F]+|\w+/g);
        if (!shadowValues) return;
        const shadowBlur = parseFloat(shadowValues[shadowValues.length - 2]);

        if (!imageCtx) return;

        imageCtx.shadowOffsetX = 3;
        imageCtx.shadowOffsetY = 3;
        imageCtx.shadowColor = "rgba(0, 0, 0, 0.5)";

        // This is the only dynamic property
        imageCtx.shadowBlur = shadowBlur;
      }

      const shadowCtx = shadowCanvas.getContext("2d");
      if (!shadowCtx || !imageCtx) return;
      shadowCtx.shadowOffsetX = imageCtx.shadowOffsetX;
      shadowCtx.shadowOffsetY = imageCtx.shadowOffsetY;
      shadowCtx.shadowBlur = imageCtx.shadowBlur;
      shadowCtx.shadowColor = imageCtx.shadowColor;

      function drawShadow(fillStyle) {
        if (!shadowCtx || !screenshot) return;
        const x = screenshotX + 3;
        const y = screenshotY + 3;
        const width = actualImageWidth - 6;
        const height = actualImageHeight - 6;
        shadowCtx.beginPath();
        shadowCtx.moveTo(x + radiusX, y);
        shadowCtx.lineTo(x + width - radiusX, y);
        shadowCtx.arcTo(
          x + width,
          y,
          x + width,
          y + radiusY,
          Math.min(radiusX, radiusY)
        );
        shadowCtx.lineTo(x + width, y + height - radiusY);
        shadowCtx.arcTo(
          x + width,
          y + height,
          x + width - radiusX,
          y + height,
          Math.min(radiusX, radiusY)
        );
        shadowCtx.lineTo(x + radiusX, y + height);
        shadowCtx.arcTo(
          x,
          y + height,
          x,
          y + height - radiusY,
          Math.min(radiusX, radiusY)
        );
        shadowCtx.lineTo(x, y + radiusY);
        shadowCtx.arcTo(x, y, x + radiusX, y, Math.min(radiusX, radiusY));
        shadowCtx.closePath();
        shadowCtx.fillStyle = fillStyle;
        shadowCtx.fill();
      }

      drawShadow("rgba(0,0,0,1)");
      drawShadow("rgba(0,0,0,0)");

      imageCtx.beginPath();
      imageCtx.moveTo(screenshotX + radiusX, screenshotY);
      imageCtx.lineTo(screenshotX + actualImageWidth - radiusX, screenshotY);
      imageCtx.arcTo(
        screenshotX + actualImageWidth,
        screenshotY,
        screenshotX + actualImageWidth,
        screenshotY + radiusY,
        Math.min(radiusX, radiusY)
      );
      imageCtx.lineTo(
        screenshotX + actualImageWidth,
        screenshotY + actualImageHeight - radiusY
      );
      imageCtx.arcTo(
        screenshotX + actualImageWidth,
        screenshotY + actualImageHeight,
        screenshotX + actualImageWidth - radiusX,
        screenshotY + actualImageHeight,
        Math.min(radiusX, radiusY)
      );
      imageCtx.lineTo(screenshotX + radiusX, screenshotY + actualImageHeight);
      imageCtx.arcTo(
        screenshotX,
        screenshotY + actualImageHeight,
        screenshotX,
        screenshotY + actualImageHeight - radiusY,
        Math.min(radiusX, radiusY)
      );
      imageCtx.lineTo(screenshotX, screenshotY + radiusY);
      imageCtx.arcTo(
        screenshotX,
        screenshotY,
        screenshotX + radiusX,
        screenshotY,
        Math.min(radiusX, radiusY)
      );
      imageCtx.closePath();
      imageCtx.clip();
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          imageCtx.drawImage(
            img,
            screenshotX,
            screenshotY,
            actualImageWidth,
            actualImageHeight
          );
          const combinedCanvas = document.createElement("canvas");
          combinedCanvas.width = imageCanvas.width;
          combinedCanvas.height = imageCanvas.height;
          const combinedCtx = combinedCanvas.getContext("2d");
          if (!combinedCtx) reject(new Error("Could not get combined context"));
          combinedCtx.drawImage(backgroundCanvas, 0, 0);
          combinedCtx.drawImage(shadowCanvas, 0, 0);
          combinedCtx.drawImage(imageCanvas, 0, 0);
          resolve(combinedCanvas);
        };
        img.onerror = () => reject(new Error("Could not load image"));
        img.src = screenshot.src;
      });
    });
  };

  const updateBorderRadius = (newBorderRadius) => {
    setBorderRadius(newBorderRadius);
    const screenshot = document.getElementById("screenshot");
    if (!screenshot) return;
    screenshot.style.borderRadius = `${newBorderRadius.toString()}px`;
  };

  const saveScreenshot = async () => {
    const canvas = await getScreenshotBuffer();
    const link = document.createElement("a");
    link.href = canvas.toDataURL().replace(/^data:image\/png;base64,/, "");
    link.download = "output.png";
    link.click();
    message.success("Screenshot saved!");
  };

  const updateShadow = (number) => {
    setShadow(number);
    const shadowBlur = number;
    const shadowColor = "rgba(0, 0, 0, 0.5)";
    const shadowOffsetX = 3;
    const shadowOffsetY = 3;

    const screenshot = document.querySelector("#screenshot");
    if (!screenshot) return;

    if (shadowBlur > 0) {
      screenshot.style.boxShadow = `${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur.toString()}px ${shadowColor}`;
    } else {
      screenshot.style.boxShadow = "none";
    }
  };

  const updateHeight = (number) => {
    setHeight(number);
    const canvasContainer = document.getElementById("canvas-container");
    if (!canvasContainer) return;
    canvasContainer.style.width = width + "px";
    canvasContainer.style.height = number.toString() + "px";
  };

  const updateWidth = (number) => {
    setWidth(number);
    const canvasContainer = document.getElementById("canvas-container");
    if (!canvasContainer) return;
    canvasContainer.style.width = number.toString() + "px";
    canvasContainer.style.height = height + "px";
  };

  const resetSettings = () => {
    const screenshot = document.getElementById("screenshot");
    if (!screenshot) return;
    setBorderRadius(0);
    setHeight(screenshot.height + 30);
    setShadow(0);
    setWidth(screenshot.width + 30);
    const canvasContainer = document.getElementById("canvas-container");
    if (!canvasContainer) return;
    canvasContainer.style.width = screenshot.width + 30 + "px";
    canvasContainer.style.height = screenshot.height + 30 + "px";
  };

  const copyContent = async () => {
    const canvas = await getScreenshotBuffer();
    navigator.clipboard.write([
      new ClipboardItem({
        [dataUrl]: new Blob([canvas.toDataURL("image/png")], {
          type: "image/png",
        }),
      }),
    ]);
    message.success("Copied to clipboard!");
  };

  useEffect(() => {
    if (color1 && color2 && color3 && color4) setBgGradiant();
  }, [color1, color2, color3, color4]);

  const changeBackground = () => {
    setColor1(getRandomBrightColor());
    setColor2(getRandomBrightColor());
    setColor3(getRandomBrightColor());
    setColor4(getRandomBrightColor());
  };
  return (
    <>
      {contextHolder}
      <Row>
        <Col sm={24} md={24} lg={16} xl={16} xxl={18} className="lg:px-5 mb-10">
          <Row>
            <Col className="my-3">
              <Upload {...props}>
                <Button
                  type="dashed"
                  className="bg-transparent mr-5 !text-gray-300"
                >
                  Upload File <UploadOutlined />
                </Button>
              </Upload>
              <Button
                type="primary"
                className=" !text-gray-300"
                onClick={changeBackground}
              >
                Change Gradiant <HighlightOutlined />
              </Button>
            </Col>
            <Col className="w-full" id="canva-side">
              {selectedFilePath === "" ? (
                <Dragger {...props} className="!border-slate-700 shadow-lg">
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text !text-gray-300">
                    Click or drag file to this area to upload
                  </p>
                  <p className="ant-upload-hint  !text-gray-300">
                    Support for a single or bulk upload. Strictly prohibited
                    from uploading company data or other banned files.
                  </p>
                </Dragger>
              ) : (
                <Screenshot
                  api={api}
                  filePath={selectedFilePath}
                  dimensions={selectedFileDimensions}
                  color1={color1}
                  color2={color2}
                  color3={color3}
                  color4={color4}
                  width={width}
                  height={height}
                  setHeight={setHeight}
                  setWidth={setWidth}
                  setMinWidth={setMinWidth}
                  setMinHeight={setMinHeight}
                />
              )}
            </Col>
          </Row>
        </Col>
        <Col sm={24} md={24} lg={8} xl={8} xxl={6} className="lg:px-5 mt-9">
          <Card
            className="mt-5 !border-slate-700"
            title="Adjustment Settings"
            actions={[
              <div className="action-buttons">
                <Button
                  type="dashed"
                  className="bg-transparent !text-gray-300"
                  onClick={copyContent}
                  disabled={selectedFilePath === ""}
                >
                  Copy <CopyOutlined />
                </Button>{" "}
                &nbsp;&nbsp;
                <Button
                  type="primary"
                  className=" !text-gray-300"
                  disabled={selectedFilePath === ""}
                  onClick={saveScreenshot}
                >
                  Save <SaveOutlined />
                </Button>{" "}
                &nbsp;&nbsp;
                <Button
                  type="dashed"
                  className="bg-transparent !text-gray-300"
                  onClick={resetSettings}
                >
                  Reset <UndoOutlined />
                </Button>
              </div>,
            ]}
          >
            <Row className="mb-5">
              <Col span={24}>
                <Typography.Text className="!text-gray-300">
                  Shadow
                </Typography.Text>
              </Col>
              <Col span={12}>
                <Slider
                  min={0}
                  max={50}
                  step={1}
                  onChange={(value) => updateShadow(value)}
                  value={typeof shadow === "number" ? shadow : 0}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={0}
                  max={50}
                  step={1}
                  value={shadow}
                  className="bg-transparent !text-gray-300 app_border ml-2"
                  onChange={(value) => updateShadow(value || 0)}
                />
              </Col>
            </Row>
            <Row className="mb-5">
              <Col span={24}>
                <Typography.Text className="!text-gray-300">
                  Border Radius
                </Typography.Text>
              </Col>
              <Col span={12}>
                <Slider
                  min={0}
                  max={24}
                  step={1}
                  onChange={(value) => updateBorderRadius(value)}
                  value={typeof borderRadius === "number" ? borderRadius : 0}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={0}
                  max={20}
                  step={1}
                  value={borderRadius}
                  className="bg-transparent !text-gray-300 app_border ml-2"
                  onChange={(value) => updateBorderRadius(value || 0)}
                />
              </Col>
            </Row>
            <Row className="mb-5">
              <Col span={24}>
                <Typography.Text className="!text-gray-300">
                  Width
                </Typography.Text>
              </Col>
              <Col span={12}>
                <Slider
                  min={minWidth}
                  max={maxWidth}
                  step={1}
                  onChange={(value) => updateWidth(parseInt(value))}
                  value={typeof width === "number" ? width : 0}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={minWidth}
                  max={maxWidth}
                  value={width}
                  step={1}
                  className="bg-transparent !text-gray-300 app_border ml-2"
                  onChange={(value) => updateWidth(parseInt(value) || 0)}
                />
              </Col>
            </Row>
            <Row className="mb-5">
              <Col span={24}>
                <Typography.Text className="!text-gray-300">
                  Height
                </Typography.Text>
              </Col>
              <Col span={12}>
                <Slider
                  min={minHeight}
                  max={maxWidth}
                  step={1}
                  onChange={(value) => updateHeight(parseInt(value))}
                  value={typeof height === "number" ? height : 0}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={minHeight}
                  max={maxWidth}
                  step={1}
                  value={height}
                  className="bg-transparent !text-gray-300 app_border ml-2"
                  onChange={(value) => updateHeight(parseInt(value) || 0)}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  );
}
