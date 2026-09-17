import { getContrastTextColor } from '../color/convert.js';

export function exportPNG(colors) {
  const swatchWidth = 160;
  const height = 320;

  const canvas = document.createElement('canvas');
  canvas.width = swatchWidth * colors.length;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  colors.forEach((c, i) => {
    ctx.fillStyle = c.hex;
    ctx.fillRect(i * swatchWidth, 0, swatchWidth, height);

    ctx.fillStyle = getContrastTextColor(c.hex);
    ctx.font = '14px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(c.hex.toUpperCase(), i * swatchWidth + swatchWidth / 2, height - 20);
  });

  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'palette.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });
}
