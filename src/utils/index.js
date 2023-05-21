const getRandomBrightColor = () => {
  const minBrightness = 120;
  const colorValueRange = 256 - minBrightness;

  let r, g, b;

  const maxColorChannel = Math.floor(Math.random() * 3);

  switch (maxColorChannel) {
    case 0:
      r = 255;
      g = Math.floor(Math.random() * colorValueRange) + minBrightness;
      b = Math.floor(Math.random() * colorValueRange) + minBrightness;
      break;
    case 1:
      r = Math.floor(Math.random() * colorValueRange) + minBrightness;
      g = 255;
      b = Math.floor(Math.random() * colorValueRange) + minBrightness;
      break;
    case 2:
      r = Math.floor(Math.random() * colorValueRange) + minBrightness;
      g = Math.floor(Math.random() * colorValueRange) + minBrightness;
      b = 255;
      break;
  }

  return `rgb(${r}, ${g}, ${b})`;
};

export const calculateAspectRatioFit = (
  srcWidth,
  srcHeight,
  maxWidth,
  maxHeight
) => {
  const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
  const newWidth = srcWidth * ratio;
  const newHeight = srcHeight * ratio;
  return { width: newWidth, height: newHeight };
};

export default getRandomBrightColor;
