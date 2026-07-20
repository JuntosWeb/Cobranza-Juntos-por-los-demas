const { Jimp } = require('jimp');
const path = require('path');

const imgPath = path.resolve('public/logo-jpld.png');

async function analyzeColor() {
  try {
    const image = await Jimp.read(imgPath);
    const width = image.bitmap.width;
    const height = image.bitmap.height;
    const colorCounts = {};
    
    for (let x = 0; x < width; x+=5) {
      for (let y = 0; y < height; y+=5) {
        const hex = image.getPixelColor(x, y);
        const color = {
          r: (hex >>> 24) & 255,
          g: (hex >>> 16) & 255,
          b: (hex >>> 8) & 255,
          a: hex & 255
        };
        // Ignore white and black and transparent
        if (color.a < 20) continue;
        if (color.r > 240 && color.g > 240 && color.b > 240) continue;
        if (color.r < 15 && color.g < 15 && color.b < 15) continue;
        
        const key = `${color.r},${color.g},${color.b}`;
        colorCounts[key] = (colorCounts[key] || 0) + 1;
      }
    }
    
    const sortedColors = Object.keys(colorCounts).sort((a, b) => colorCounts[b] - colorCounts[a]);
    console.log('Top 5 dominant colors (R,G,B):');
    for(let i=0; i<Math.min(5, sortedColors.length); i++) {
      console.log(sortedColors[i], 'Count:', colorCounts[sortedColors[i]]);
    }
  } catch (err) {
    console.error(err);
  }
}

analyzeColor();
