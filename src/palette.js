import { getBaseHues } from './color/harmony.js';
import { randomBaseHue, randomBaseSaturation, randomBaseLightness, applyVariation } from './color/random.js';
import { hslToHex, formatHslString } from './color/convert.js';

export function generatePalette(harmonyType, size) {
  const baseHue = randomBaseHue();
  const baseSaturation = randomBaseSaturation();
  const baseLightness = randomBaseLightness();
  const hues = getBaseHues(harmonyType, baseHue);

  const colors = [];
  for (let i = 0; i < size; i += 1) {
    const hue = hues[i % hues.length];
    const variantIndex = Math.floor(i / hues.length);
    const { s, l } = applyVariation(baseSaturation, baseLightness, variantIndex);
    const hex = hslToHex(hue, s, l);
    colors.push({
      h: hue,
      s,
      l,
      hex,
      hsl: formatHslString(hue, s, l),
    });
  }
  return colors;
}
