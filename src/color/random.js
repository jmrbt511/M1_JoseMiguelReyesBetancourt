export function randomBaseHue() {
  return Math.floor(Math.random() * 360);
}

export function randomBaseSaturation() {
  return 55 + Math.random() * 25; // 55–80 %, évite les tons ternes ou criards
}

export function randomBaseLightness() {
  return 42 + Math.random() * 18; // 42–60 %, garde une bonne lisibilité
}

// variantIndex = 0 → couleur "pure" de l'harmonie.
// variantIndex > 0 → alterne teintes plus claires / plus foncées, avec un
// pas croissant, pour remplir les tailles 8 et 9 sans répéter la même couleur.
export function applyVariation(baseSaturation, baseLightness, variantIndex) {
  if (variantIndex === 0) {
    return { s: baseSaturation, l: baseLightness };
  }

  const step = Math.ceil(variantIndex / 2) * 14;
  const direction = variantIndex % 2 === 1 ? 1 : -1;

  let l = baseLightness + direction * step;
  l = Math.min(92, Math.max(12, l));

  let s = baseSaturation - variantIndex * 3;
  s = Math.min(95, Math.max(20, s));

  return { s, l };
}
