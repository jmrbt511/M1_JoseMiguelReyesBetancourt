// Chaque harmonie est définie par des écarts de teinte (en degrés) autour
// d'une teinte de base. C'est le coeur de "l'approche A" : une harmonie de
// base fixe, complétée ensuite par des variations systématiques (voir random.js).

export const HARMONIES = {
  complementary: { label: 'Complémentaire', offsets: [0, 180] },
  analogous: { label: 'Analogue', offsets: [-30, 0, 30] },
  triad: { label: 'Triade', offsets: [0, 120, 240] },
  splitComplementary: { label: 'Complémentaire divisée', offsets: [0, 150, 210] },
  square: { label: 'Carré', offsets: [0, 90, 180, 270] },
};

export function getBaseHues(harmonyType, baseHue) {
  const def = HARMONIES[harmonyType] || HARMONIES.complementary;
  return def.offsets.map((offset) => ((baseHue + offset) % 360 + 360) % 360);
}
